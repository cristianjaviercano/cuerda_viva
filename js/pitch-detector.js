// ============================================================================
// js/pitch-detector.js
// Motor Profesional de Entrada de Audio para Micrófono + Línea Directa / Interfaz USB:
// - Selector de dispositivo (enumerateDevices) y selector de Canal (1+2, Canal 1, Canal 2 Hi-Z)
// - Preamplificador digital (GainBoost 0.5x - 8x) + Filtro Pasa-Altos (55Hz) + Noise Gate
// - Algoritmo YIN (CMNDF) de alta precisión para cuerdas graves a trastes agudos
// - Analizador Polifónico Chroma FFT (8192 pts) para verificar acordes rasgueados
// ============================================================================

import {
  NOTES,
  NOTES_ES,
  NOTE_COLORS,
  STRING_OPEN_MIDI,
  STRING_LABELS_6_TO_1,
  getChordPitchClasses
} from './music-theory.js';

class PitchDetector {
  constructor() {
    this.ctx = null;
    this.stream = null;
    this.source = null;
    this.splitter = null;
    this.ch1Gain = null;
    this.ch2Gain = null;
    this.preampGain = null;
    this.hpFilter = null;
    this.analyser = null;

    this.isListening = false;
    this.selectedDeviceId = localStorage.getItem('cv_audio_device') || 'default';
    this.channelMode = localStorage.getItem('cv_channel_mode') || 'sum'; // 'sum' | 'ch1' | 'ch2'
    this.inputGainValue = parseFloat(localStorage.getItem('cv_input_gain') || '2.0');
    this.noiseGate = parseFloat(localStorage.getItem('cv_noise_gate') || '0.008');
    this.a4Reference = 440;

    this.timeBuffer = null;
    this.freqBuffer = null;
    this.rafId = null;

    this.recentMidis = [];
    this.subscribers = new Map();       // id -> (pitchData) => void
    this.levelSubscribers = new Map();  // id -> ({ rms, peak, active }) => void
    this.statusSubscribers = new Map(); // id -> (isListening, deviceLabel) => void
    this.activeDeviceLabel = 'Sin activar';
  }

  onPitch(id, callback) {
    this.subscribers.set(id, callback);
  }

  offPitch(id) {
    this.subscribers.delete(id);
  }

  onLevel(id, callback) {
    this.levelSubscribers.set(id, callback);
  }

  offLevel(id) {
    this.levelSubscribers.delete(id);
  }

  onStatusChange(id, callback) {
    this.statusSubscribers.set(id, callback);
  }

  async listInputDevices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return [];
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices
        .filter(d => d.kind === 'audioinput')
        .map((d, idx) => ({
          deviceId: d.deviceId,
          label: d.label || `Entrada de Audio / Guitarra #${idx + 1}`,
          isLineOrInterface: /usb|interface|scarlett|behringer|irig|line|external|guitar|codec|asio|coreaudio/i.test(d.label || '')
        }));
    } catch (_) {
      return [];
    }
  }

  setInputGain(val) {
    this.inputGainValue = Math.max(0.2, Math.min(8.0, Number(val) || 1.5));
    localStorage.setItem('cv_input_gain', String(this.inputGainValue));
    if (this.preampGain && this.ctx) {
      this.preampGain.gain.setValueAtTime(this.inputGainValue, this.ctx.currentTime);
    }
  }

  setNoiseGate(val) {
    this.noiseGate = Math.max(0.001, Math.min(0.08, Number(val) || 0.008));
    localStorage.setItem('cv_noise_gate', String(this.noiseGate));
  }

  setChannelMode(mode) {
    this.channelMode = mode;
    localStorage.setItem('cv_channel_mode', mode);
    this._applyChannelGains();
  }

  _applyChannelGains() {
    if (!this.ch1Gain || !this.ch2Gain || !this.ctx) return;
    const t = this.ctx.currentTime;
    if (this.channelMode === 'ch1') {
      this.ch1Gain.gain.setValueAtTime(1.0, t);
      this.ch2Gain.gain.setValueAtTime(0.0, t);
    } else if (this.channelMode === 'ch2') {
      this.ch1Gain.gain.setValueAtTime(0.0, t);
      this.ch2Gain.gain.setValueAtTime(1.0, t);
    } else {
      this.ch1Gain.gain.setValueAtTime(0.85, t);
      this.ch2Gain.gain.setValueAtTime(0.85, t);
    }
  }

  async start(deviceId = null) {
    if (deviceId) {
      this.selectedDeviceId = deviceId;
      localStorage.setItem('cv_audio_device', deviceId);
    }
    if (this.isListening) {
      this.stop();
    }

    const baseAudioConstraints = {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false,
      channelCount: { ideal: 2 }
    };

    if (this.selectedDeviceId && this.selectedDeviceId !== 'default') {
      baseAudioConstraints.deviceId = { ideal: this.selectedDeviceId };
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: baseAudioConstraints });
    } catch (_) {
      // Fallback universal si algún navegador rechaza constraints avanzados
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    const track = this.stream.getAudioTracks()[0];
    this.activeDeviceLabel = (track && track.label) ? track.label : 'Micrófono / Línea Activa';

    this.source = this.ctx.createMediaStreamSource(this.stream);

    // Divisor de canales L/R para soportar interfaces con guitarra en Entrada 1 o Entrada 2
    const channelCount = Math.max(1, this.source.channelCount || 1);
    this.preampGain = this.ctx.createGain();
    this.preampGain.gain.value = this.inputGainValue;

    if (channelCount >= 2) {
      this.splitter = this.ctx.createChannelSplitter(2);
      this.ch1Gain = this.ctx.createGain();
      this.ch2Gain = this.ctx.createGain();
      this._applyChannelGains();
      this.source.connect(this.splitter);
      this.splitter.connect(this.ch1Gain, 0);
      this.splitter.connect(this.ch2Gain, 1);
      this.ch1Gain.connect(this.preampGain);
      this.ch2Gain.connect(this.preampGain);
    } else {
      this.source.connect(this.preampGain);
    }

    // Filtro pasa-altos suave a 55 Hz para limpiar ruido eléctrico/golpes sin afectar Mi2 (82.4 Hz)
    this.hpFilter = this.ctx.createBiquadFilter();
    this.hpFilter.type = 'highpass';
    this.hpFilter.frequency.value = 55;
    this.hpFilter.Q.value = 0.7;

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 8192; // Alta resolución para graves (82Hz) y Chroma FFT de acordes
    this.analyser.smoothingTimeConstant = 0.65;

    this.preampGain.connect(this.hpFilter);
    this.hpFilter.connect(this.analyser);

    this.timeBuffer = new Float32Array(4096);
    this.freqBuffer = new Float32Array(this.analyser.frequencyBinCount);
    this.recentMidis = [];
    this.isListening = true;

    this._notifyStatus();
    this._loop();
    return { ok: true, label: this.activeDeviceLabel };
  }

  stop() {
    this.isListening = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
    this.activeDeviceLabel = 'Desconectado';
    this._notifyStatus();
  }

  _notifyStatus() {
    this.statusSubscribers.forEach(fn => {
      try { fn(this.isListening, this.activeDeviceLabel); } catch (_) {}
    });
  }

  _loop() {
    if (!this.isListening || !this.analyser || !this.ctx) return;

    // Obtener las últimas 4096 muestras de dominio temporal
    if (this.analyser.getFloatTimeDomainData) {
      const fullBuf = new Float32Array(this.analyser.fftSize);
      this.analyser.getFloatTimeDomainData(fullBuf);
      this.timeBuffer.set(fullBuf.subarray(fullBuf.length - 4096));
    }

    // Calcular RMS y Pico para el medidor VU de señal de guitarra
    let sumSq = 0;
    let peak = 0;
    for (let i = 0; i < this.timeBuffer.length; i++) {
      const v = this.timeBuffer[i];
      sumSq += v * v;
      const av = Math.abs(v);
      if (av > peak) peak = av;
    }
    const rms = Math.sqrt(sumSq / this.timeBuffer.length);
    const gateOpen = rms >= this.noiseGate;

    this.levelSubscribers.forEach(fn => {
      try { fn({ rms, peak, active: gateOpen }); } catch (_) {}
    });

    if (gateOpen) {
      const yinResult = this._yinDetect(this.timeBuffer, this.ctx.sampleRate);
      if (yinResult && yinResult.freq >= 68 && yinResult.freq <= 1350 && yinResult.clarity >= 0.72) {
        const pitchInfo = this._freqToPitchInfo(yinResult.freq, yinResult.clarity, rms);
        this.subscribers.forEach(fn => {
          try { fn(pitchInfo); } catch (_) {}
        });
      }
    }

    this.rafId = requestAnimationFrame(() => this._loop());
  }

  // ============================================================================
  // ALGORITMO YIN (Cumulative Mean Normalized Difference Function)
  // Evita saltos de octava en las cuerdas entorchadas Mi6, La5 y Re4
  // ============================================================================
  _yinDetect(buf, sampleRate) {
    const halfLen = 1536; // Suficiente para bajar hasta ~31 Hz a 48kHz
    const minTau = Math.max(20, Math.floor(sampleRate / 1400));
    const maxTau = Math.min(halfLen - 2, Math.floor(sampleRate / 65));

    const yin = new Float32Array(maxTau + 2);
    yin[0] = 1;
    let runningSum = 0;

    for (let tau = 1; tau <= maxTau + 1; tau++) {
      let deltaSum = 0;
      for (let i = 0; i < halfLen; i++) {
        const d = buf[i] - buf[i + tau];
        deltaSum += d * d;
      }
      runningSum += deltaSum;
      yin[tau] = runningSum > 0 ? (deltaSum * tau) / runningSum : 1;
    }

    const threshold = 0.16;
    let bestTau = -1;

    for (let tau = minTau; tau <= maxTau; tau++) {
      if (yin[tau] < threshold) {
        while (tau + 1 <= maxTau && yin[tau + 1] < yin[tau]) {
          tau++;
        }
        bestTau = tau;
        break;
      }
    }

    // Si no cruzó el umbral estricto, buscar el mínimo global si es suficientemente claro
    if (bestTau === -1) {
      let minVal = 1;
      for (let tau = minTau; tau <= maxTau; tau++) {
        if (yin[tau] < minVal) {
          minVal = yin[tau];
          bestTau = tau;
        }
      }
      if (minVal > 0.28) return null;
    }

    const clarity = Math.max(0, Math.min(1, 1 - yin[bestTau]));

    // Interpolación parabólica para precisión sub-centésima
    let refinedTau = bestTau;
    if (bestTau > 1 && bestTau < maxTau) {
      const s0 = yin[bestTau - 1];
      const s1 = yin[bestTau];
      const s2 = yin[bestTau + 1];
      const denom = 2 * (2 * s1 - s2 - s0);
      if (Math.abs(denom) > 1e-6) {
        refinedTau = bestTau + (s2 - s0) / denom;
      }
    }

    return {
      freq: sampleRate / refinedTau,
      clarity
    };
  }

  _freqToPitchInfo(freq, clarity, rms) {
    const exactMidi = 69 + 12 * Math.log2(freq / this.a4Reference);
    const rawMidi = Math.round(exactMidi);

    // Filtro de mediana de 3 muestras para eliminar parpadeo visual
    this.recentMidis.push(rawMidi);
    if (this.recentMidis.length > 3) this.recentMidis.shift();
    const sorted = [...this.recentMidis].sort((a, b) => a - b);
    const stableMidi = sorted[Math.floor(sorted.length / 2)];

    const cents = Math.round((exactMidi - stableMidi) * 100);
    const noteIdx = ((stableMidi % 12) + 12) % 12;
    const note = NOTES[noteIdx];
    const noteEs = NOTES_ES[note] || note;
    const octave = Math.floor(stableMidi / 12) - 1;

    // Cuerda al aire más cercana (para el afinador)
    let closestString = STRING_LABELS_6_TO_1[0];
    let minDiff = Infinity;
    for (const s of STRING_LABELS_6_TO_1) {
      const diff = Math.abs(freq - s.freq);
      if (diff < minDiff) {
        minDiff = diff;
        closestString = s;
      }
    }

    // Todas las posiciones posibles en el mástil (trastes 0..22) donde vive este MIDI exacto
    const fretPositions = [];
    STRING_OPEN_MIDI.forEach((openMidi, idx6To1) => {
      const fret = stableMidi - openMidi;
      if (fret >= 0 && fret <= 22) {
        fretPositions.push({
          string: 6 - idx6To1, // 1..6
          fret
        });
      }
    });

    return {
      freq: Number(freq.toFixed(2)),
      midi: stableMidi,
      cents: Math.max(-50, Math.min(50, cents)),
      note,
      noteEs,
      octave,
      color: NOTE_COLORS[note],
      clarity,
      rms,
      closestString,
      fretPositions
    };
  }

  // ============================================================================
  // DETECTOR POLIFÓNICO CHROMA FFT PARA RASGUEOS DE ACORDES REALES
  // ============================================================================
  checkChordMatch(targetChordName) {
    if (!this.isListening || !this.analyser || !this.ctx) {
      return { matched: false, score: 0 };
    }
    const targetClasses = getChordPitchClasses(targetChordName);
    if (targetClasses.length === 0) return { matched: false, score: 0 };

    this.analyser.getFloatFrequencyData(this.freqBuffer);
    const chroma = new Float32Array(12);
    const sr = this.ctx.sampleRate;
    const fftSize = this.analyser.fftSize;
    const minBin = Math.floor((75 * fftSize) / sr);
    const maxBin = Math.min(this.freqBuffer.length - 1, Math.ceil((1050 * fftSize) / sr));

    let totalEnergy = 0;
    for (let bin = minBin; bin <= maxBin; bin++) {
      const db = this.freqBuffer[bin];
      if (db < -72) continue;
      const mag = Math.pow(10, db / 20);
      const freq = (bin * sr) / fftSize;
      const midi = Math.round(69 + 12 * Math.log2(freq / this.a4Reference));
      const pc = ((midi % 12) + 12) % 12;
      chroma[pc] += mag;
      totalEnergy += mag;
    }

    if (totalEnergy < 0.015) {
      return { matched: false, score: 0 };
    }

    let inChordEnergy = 0;
    targetClasses.forEach(pc => {
      inChordEnergy += chroma[pc];
    });

    const ratio = inChordEnergy / totalEnergy;
    // Un acorde en guitarra concentra típicamente >52% de la energía espectral en sus clases de altura fundamentales
    return {
      matched: ratio >= 0.50,
      score: Math.min(1, ratio / 0.65)
    };
  }
}

export const pitchDetector = new PitchDetector();
