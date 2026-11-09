// ============================================================================
// js/audio-engine.js
// Sintetizador Web Audio para Guitarra (Nylon, Requinto Acústico, Acordeón Vallenato),
// Rasgueos/Arpegios con Bajo Primario y Secundario, Percusión Folclórica/Litúrgica
// y Efectos de Sonido Gamificados Estilo Duolingo.
// ============================================================================

import { getFretMidi } from './music-theory.js';
import { getChordMidiNotes } from './chords-db.js';

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.volume = 0.82;
    this.instrument = 'nylon'; // 'nylon' | 'requinto' | 'accordion'
    this.noiseBuffer = null;
    this.installMobileUnlock();
  }

  installMobileUnlock() {
    if (typeof window === 'undefined') return;
    const unlockEvents = ['touchstart', 'touchend', 'click', 'keydown'];
    const unlock = () => {
      try {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      } catch (_) {}
      unlockEvents.forEach(evt => window.removeEventListener(evt, unlock, { capture: true }));
    };
    unlockEvents.forEach(evt => window.addEventListener(evt, unlock, { capture: true, passive: true }));
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      // Compresor maestro suave para evitar distorsión al rasguear 6 cuerdas + percusión
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 18;
      comp.ratio.value = 4;
      comp.attack.value = 0.005;
      comp.release.value = 0.18;

      this.masterGain.connect(comp);
      comp.connect(this.ctx.destination);
      this._buildNoiseBuffer();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  _buildNoiseBuffer() {
    const sr = this.ctx.sampleRate;
    const len = sr * 1.0;
    const buf = this.ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buf;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  setInstrument(inst) {
    this.instrument = inst;
  }

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Síntesis expresiva de cuerda pulsada o acordeón vallenato
  playMidi(midi, duration = 1.25, velocity = 0.42, customInstrument = null, atTime = null) {
    if (midi < 20) return;
    const ctx = this.init();
    const t0 = atTime !== null ? Math.max(ctx.currentTime, atTime) : ctx.currentTime;
    const freq = this.midiToFreq(midi);
    const inst = customInstrument || this.instrument;

    if (inst === 'accordion') {
      this._playAccordionTone(freq, t0, Math.min(duration, 0.9), velocity * 0.65);
      return;
    }

    const isBright = inst === 'requinto';

    // Dos osciladores armónicos + transiente de uña/púa
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc2.type = isBright ? 'sawtooth' : 'sine';

    osc1.frequency.setValueAtTime(freq, t0);
    osc2.frequency.setValueAtTime(freq * (isBright ? 1.0015 : 2.0), t0);

    const mix2 = ctx.createGain();
    mix2.gain.value = isBright ? 0.34 : 0.18;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    const peakCut = isBright ? Math.min(6800, freq * 11) : Math.min(3800, freq * 6.5);
    filter.frequency.setValueAtTime(peakCut, t0);
    filter.frequency.exponentialRampToValueAtTime(Math.max(240, freq * 1.9), t0 + duration * 0.78);
    filter.Q.value = isBright ? 1.8 : 1.1;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.linearRampToValueAtTime(velocity, t0 + 0.006);
    env.gain.exponentialRampToValueAtTime(velocity * 0.38, t0 + 0.14);
    env.gain.exponentialRampToValueAtTime(0.0008, t0 + duration);

    // Pequeño "pluck click" de ataque de cuerda real
    if (this.noiseBuffer) {
      const pluckNoise = ctx.createBufferSource();
      pluckNoise.buffer = this.noiseBuffer;
      const nf = ctx.createBiquadFilter();
      nf.type = 'bandpass';
      nf.frequency.value = isBright ? 2900 : 1700;
      nf.Q.value = 2.2;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(velocity * (isBright ? 0.28 : 0.14), t0);
      ng.gain.exponentialRampToValueAtTime(0.001, t0 + 0.018);
      pluckNoise.connect(nf);
      nf.connect(ng);
      ng.connect(this.masterGain);
      pluckNoise.start(t0);
      pluckNoise.stop(t0 + 0.022);
    }

    osc1.connect(filter);
    osc2.connect(mix2);
    mix2.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    osc1.start(t0);
    osc2.start(t0);
    osc1.stop(t0 + duration + 0.04);
    osc2.stop(t0 + duration + 0.04);
  }

  _playAccordionTone(freq, t0, duration, velocity) {
    const ctx = this.ctx;
    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    oscA.type = 'sawtooth';
    oscB.type = 'square';
    // Desafinación musette típica del acordeón diatónico vallenato (Corona III)
    oscA.frequency.setValueAtTime(freq, t0);
    oscB.frequency.setValueAtTime(freq * 1.0042, t0);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = Math.min(2600, freq * 3.4);
    filter.Q.value = 0.9;

    const env = ctx.createGain();
    env.gain.setValueAtTime(0.001, t0);
    env.gain.linearRampToValueAtTime(velocity * 0.55, t0 + 0.022);
    env.gain.setValueAtTime(velocity * 0.48, Math.max(t0 + 0.03, t0 + duration - 0.05));
    env.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(env);
    env.connect(this.masterGain);

    oscA.start(t0);
    oscB.start(t0);
    oscA.stop(t0 + duration + 0.03);
    oscB.stop(t0 + duration + 0.03);
  }

  playStringFret(stringNum1To6, fret, duration = 1.3, velocity = 0.45) {
    const midi = getFretMidi(stringNum1To6, fret);
    this.playMidi(midi, duration, velocity);
  }

  // Rasguear un acorde completo (abajo, arriba o arpegio rápido)
  strumChord(chordName, mode = 'down', voicingIndex = 0, atTime = null) {
    const ctx = this.init();
    const baseTime = atTime !== null ? Math.max(ctx.currentTime, atTime) : ctx.currentTime;
    const { stringMidis } = getChordMidiNotes(chordName, voicingIndex);
    const active = stringMidis
      .map((m, idx6To1) => ({ midi: m, idx: idx6To1 }))
      .filter(x => x.midi > 0);

    if (active.length === 0) return;

    if (mode === 'up') {
      const trebles = active.slice(-4).reverse();
      trebles.forEach((s, k) => {
        this.playMidi(s.midi, 0.95, 0.28, 'nylon', baseTime + k * 0.018);
      });
    } else if (mode === 'arpeggio') {
      active.forEach((s, k) => {
        this.playMidi(s.midi, 1.45, 0.36, 'nylon', baseTime + k * 0.11);
      });
    } else {
      active.forEach((s, k) => {
        this.playMidi(s.midi, 1.35, 0.34, 'nylon', baseTime + k * 0.024);
      });
    }
  }

  // Ejecuta un paso individual de patrón de rasgueo o arpegio sobre un acorde
  playPatternStep(stepCode, chordName, stepDurSec = 0.25, atTime = null) {
    if (!stepCode || stepCode === '-') return;
    const ctx = this.init();
    const t = atTime !== null ? Math.max(ctx.currentTime, atTime) : ctx.currentTime;
    const { stringMidis, bass1StringIdx, bass2StringIdx } = getChordMidiNotes(chordName, 0);

    const dur = Math.max(0.38, stepDurSec * 2.1);

    if (stepCode === 'X') {
      this.playPalmMuteChasquido(t);
      return;
    }

    if (stepCode === 'B' || stepCode === 'B1' || stepCode === 'p') {
      let m = stringMidis[bass1StringIdx];
      if (!m || m < 0) m = stringMidis.find(n => n > 0) || 48;
      this.playMidi(m, dur * 1.3, 0.50, 'nylon', t);
      return;
    }

    if (stepCode === 'B2' || stepCode === 'p2') {
      let m = stringMidis[bass2StringIdx];
      if (!m || m < 0) m = stringMidis.filter(n => n > 0)[1] || stringMidis.find(n => n > 0) || 55;
      this.playMidi(m, dur * 1.25, 0.46, 'nylon', t);
      return;
    }

    if (stepCode === 'D') {
      const sounding = stringMidis.filter(n => n > 0);
      sounding.forEach((m, k) => {
        this.playMidi(m, dur, 0.30, 'nylon', t + k * 0.014);
      });
      return;
    }

    if (stepCode === 'U') {
      const trebles = stringMidis.slice(2).filter(n => n > 0).reverse();
      trebles.forEach((m, k) => {
        this.playMidi(m, dur * 0.8, 0.24, 'nylon', t + k * 0.012);
      });
      return;
    }

    // Dedos de arpegio: i = 3ª cuerda (idx 3), m = 2ª cuerda (idx 4), a = 1ª cuerda (idx 5)
    const fingerIdxMap = { i: 3, m: 4, a: 5 };
    if (fingerIdxMap[stepCode] !== undefined) {
      const m = stringMidis[fingerIdxMap[stepCode]];
      if (m > 0) this.playMidi(m, dur * 1.35, 0.38, 'nylon', t);
      return;
    }

    if (stepCode === 'ima') {
      [3, 4, 5].forEach(idx => {
        if (stringMidis[idx] > 0) this.playMidi(stringMidis[idx], dur, 0.32, 'nylon', t);
      });
    }
  }

  // Apagado / Chasquido de guitarra (golpe percusivo de palma + roce de uñas)
  playPalmMuteChasquido(atTime = null) {
    const ctx = this.init();
    const t = atTime !== null ? Math.max(ctx.currentTime, atTime) : ctx.currentTime;
    if (!this.noiseBuffer) return;

    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1350;
    bp.Q.value = 1.6;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.42, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

    // Golpe grave de madera ("golpe de caja")
    const bodyOsc = ctx.createOscillator();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(145, t);
    bodyOsc.frequency.exponentialRampToValueAtTime(62, t + 0.045);
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.28, t);
    bg.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    src.connect(bp);
    bp.connect(g);
    g.connect(this.masterGain);

    bodyOsc.connect(bg);
    bg.connect(this.masterGain);

    src.start(t);
    src.stop(t + 0.06);
    bodyOsc.start(t);
    bodyOsc.stop(t + 0.055);
  }

  // ============================================================================
  // PERCUSIÓN FOLCLÓRICA COLOMBIANA Y LITÚRGICA
  // ============================================================================
  playPercussion(type, atTime = null) {
    const ctx = this.init();
    const t = atTime !== null ? Math.max(ctx.currentTime, atTime) : ctx.currentTime;

    if (type === 'caja_bajo' || type === 'bombo') {
      // Cuero abierto profundo de Caja Vallenata / Cajón grave
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(type === 'caja_bajo' ? 130 : 95, t);
      osc.frequency.exponentialRampToValueAtTime(48, t + 0.14);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.46, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.17);
    } else if (type === 'caja_slap' || type === 'alegre') {
      // Quinto / Canto agudo de Caja Vallenata o Tambor Alegre
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(type === 'caja_slap' ? 420 : 340, t);
      osc.frequency.exponentialRampToValueAtTime(175, t + 0.065);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.36, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.075);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.08);

      if (this.noiseBuffer && type === 'caja_slap') {
        const ns = ctx.createBufferSource();
        ns.buffer = this.noiseBuffer;
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 2200;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.24, t);
        ng.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        ns.connect(hp);
        hp.connect(ng);
        ng.connect(this.masterGain);
        ns.start(t);
        ns.stop(t + 0.045);
      }
    } else if (type === 'guacharaca' || type === 'guacharaca_long' || type === 'maracon' || type === 'shaker') {
      if (!this.noiseBuffer) return;
      const dur = type === 'guacharaca_long' ? 0.13 : 0.055;
      const ns = ctx.createBufferSource();
      ns.buffer = this.noiseBuffer;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = type.startsWith('guacharaca') ? 5200 : 6500;
      bp.Q.value = type.startsWith('guacharaca') ? 2.4 : 1.4;
      const g = ctx.createGain();
      g.gain.setValueAtTime(type === 'shaker' ? 0.14 : 0.22, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      ns.connect(bp);
      bp.connect(g);
      g.connect(this.masterGain);
      ns.start(t);
      ns.stop(t + dur + 0.01);
    } else if (type === 'llamador') {
      // Contratiempo de Cumbia ("pa-cá")
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(235, t);
      osc.frequency.exponentialRampToValueAtTime(145, t + 0.09);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.38, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.12);
    } else if (type === 'click_hi' || type === 'click_lo') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = type === 'click_hi' ? 1150 : 780;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.04);
    }
  }

  // ============================================================================
  // EFECTOS DE SONIDO GAMIFICADOS ESTILO DUOLINGO
  // ============================================================================
  playSuccess() {
    const ctx = this.init();
    const now = ctx.currentTime;
    // Doble campanita alegre Do6 -> Sol6
    [72, 79].forEach((m, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = this.midiToFreq(m);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, now + i * 0.085);
      g.gain.linearRampToValueAtTime(0.26, now + i * 0.085 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.085 + 0.28);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now + i * 0.085);
      osc.stop(now + i * 0.085 + 0.30);
    });
  }

  playCombo(streak = 3) {
    const ctx = this.init();
    const now = ctx.currentTime;
    const base = Math.min(12, Math.floor(streak / 2));
    [60 + base, 64 + base, 67 + base, 72 + base].forEach((m, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = this.midiToFreq(m);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.20, now + i * 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.26);
    });
  }

  playError() {
    const ctx = this.init();
    const now = ctx.currentTime;
    [52, 48].forEach((m, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = this.midiToFreq(m);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.22, now + i * 0.09);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.18);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.2);
    });
  }

  playLessonFanfare() {
    const ctx = this.init();
    const now = ctx.currentTime;
    const notes = [
      { m: 60, t: 0.00, d: 0.15 },
      { m: 64, t: 0.11, d: 0.15 },
      { m: 67, t: 0.22, d: 0.15 },
      { m: 72, t: 0.34, d: 0.55 }
    ];
    notes.forEach(n => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = this.midiToFreq(n.m);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.28, now + n.t);
      g.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now + n.t);
      osc.stop(now + n.t + n.d + 0.02);
    });
  }
}

export const audioEngine = new AudioEngine();
