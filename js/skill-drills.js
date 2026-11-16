// ============================================================================
// js/skill-drills.js
// Retos de habilidad medibles dentro de las lecciones:
//  - chord_change : cambios limpios entre dos acordes en una ventana de tiempo.
//  - strum_timing : precisión del pulso (ms) frente a una rejilla de metrónomo.
//  - ear_quality  : discriminación auditiva Mayor / menor (ítems aleatorios).
// Cada reto entrega su resultado con ctx.onResult({ success, userAnswer,
// expectedAnswer, summaryHtml, source }) y devuelve una función de limpieza.
// ============================================================================

import { audioEngine } from './audio-engine.js';
import { pitchDetector } from './pitch-detector.js';
import { renderChordSVG } from './chords-db.js';
import {
  OnsetDetector,
  beatGrid,
  scoreTiming,
  describeTimingTendency,
  ChordChangeCounter,
  makeEarRounds
} from './practice-metrics.js';

export const DRILL_TYPES = ['chord_change', 'strum_timing', 'ear_quality'];

const LEVEL_ID = 'skill-drill';

function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Convierte un instante del reloj de audio a performance.now() (ms), incluyendo la latencia de salida. */
function audioTimeToPerf(ctx, audioTime) {
  const outLatency = (ctx.outputLatency || 0) + (ctx.baseLatency || 0);
  return performance.now() + (audioTime - ctx.currentTime + outLatency) * 1000;
}

function inputLatencyMs() {
  const ctx = pitchDetector.ctx;
  // Latencia base del contexto de entrada + ~media ventana de análisis RMS (1024 muestras).
  return ((ctx?.baseLatency || 0) * 1000) + 12;
}

async function ensureMic(statusEl) {
  if (pitchDetector.isListening) return true;
  try {
    await pitchDetector.start();
    return pitchDetector.isListening;
  } catch (_) {
    if (statusEl) statusEl.textContent = '⚠️ No se pudo activar la entrada de audio. Usa el modo sin micrófono.';
    return false;
  }
}

function modeButtonsHtml(micLabel, tapLabel) {
  return `
    <div class="drill-mode-row">
      <button class="duo-btn btn-blue" data-drill-mode="mic">🎙️ ${esc(micLabel)}</button>
      <button class="duo-btn btn-outline" data-drill-mode="tap">👆 ${esc(tapLabel)}</button>
    </div>
    <p class="drill-status" data-drill-status></p>`;
}

export function renderDrill(step, ctx) {
  if (step.type === 'chord_change') return renderChordChange(step, ctx);
  if (step.type === 'strum_timing') return renderStrumTiming(step, ctx);
  if (step.type === 'ear_quality') return renderEarQuality(step, ctx);
  return () => {};
}

// ---------------------------------------------------------------------------
// 1) CAMBIOS DE ACORDE CRONOMETRADOS
// ---------------------------------------------------------------------------
function renderChordChange(step, ctx) {
  const [chordA, chordB] = step.chords;
  const durationSec = step.durationSec || 30;
  const target = step.targetChanges || 10;
  const perMinute = Math.round((target * 60) / durationSec);
  const timers = [];
  let rafId = null;
  let keyHandler = null;
  let running = false;

  ctx.body.innerHTML = `
    <div class="lesson-card-step center-step drill-card">
      ${ctx.headerHtml}
      <h2 class="lesson-step-title">${esc(step.title)}</h2>
      <p class="lesson-instruction-p">${esc(step.instruction)}</p>
      <div class="drill-objective">🎯 Meta: <strong>${target} cambios limpios en ${durationSec} s</strong> (≈ ${perMinute} por minuto)</div>
      <div class="drill-chord-pair">
        <div class="drill-chord" data-chord-slot="A">${renderChordSVG(chordA, { width: 130, showBasses: true })}</div>
        <div class="drill-arrow">⇄</div>
        <div class="drill-chord" data-chord-slot="B">${renderChordSVG(chordB, { width: 130, showBasses: true })}</div>
      </div>
      <button class="duo-btn btn-purple btn-sm" data-drill-listen>🔊 Escuchar ${esc(chordA)} → ${esc(chordB)}</button>
      <div class="drill-meter">
        <div class="drill-big-count"><strong data-drill-count>0</strong><span>/ ${target} cambios</span></div>
        <div class="drill-timebar"><div class="drill-timebar-fill" data-drill-timefill></div></div>
        <div class="drill-time-left" data-drill-time>${durationSec}s</div>
      </div>
      <button class="drill-tap-pad hidden" data-drill-tap>✔ Cambio limpio<br><small>(o barra espaciadora)</small></button>
      ${modeButtonsHtml('Medir con micrófono / línea', 'Sin micrófono (autoconteo)')}
    </div>`;

  const $ = sel => ctx.body.querySelector(sel);
  const statusEl = $('[data-drill-status]');
  const countEl = $('[data-drill-count]');

  $('[data-drill-listen]').addEventListener('click', () => {
    audioEngine.strumChord(chordA, 'down');
    timers.push(setTimeout(() => audioEngine.strumChord(chordB, 'down'), 900));
  });

  const finish = (changes, source) => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    if (keyHandler) window.removeEventListener('keydown', keyHandler);
    ctx.body.querySelectorAll('[data-drill-mode]').forEach(b => { b.disabled = true; });
    $('[data-drill-tap]')?.classList.add('hidden');
    const rate = Math.round((changes * 60) / durationSec);
    const success = changes >= target;
    ctx.onResult({
      success,
      source,
      userAnswer: `${changes} cambios en ${durationSec}s (${rate}/min) · ${source}`,
      expectedAnswer: `≥ ${target} cambios en ${durationSec}s`,
      summaryHtml: `${changes} cambios en ${durationSec} s (≈ ${rate}/min). Meta: ${target}.`
    });
  };

  const runTimer = (onTick, onEnd) => {
    const start = performance.now();
    const fill = $('[data-drill-timefill]');
    const timeEl = $('[data-drill-time]');
    const tick = () => {
      if (!running) return;
      const elapsed = (performance.now() - start) / 1000;
      fill.style.width = `${Math.min(100, (elapsed / durationSec) * 100)}%`;
      timeEl.textContent = `${Math.max(0, Math.ceil(durationSec - elapsed))}s`;
      onTick?.(performance.now());
      if (elapsed >= durationSec) { onEnd(); return; }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
  };

  const countIn = then => {
    statusEl.textContent = 'Prepárate: 3 · 2 · 1 …';
    const ac = audioEngine.init();
    for (let i = 0; i < 3; i++) audioEngine.playClick(i === 0, ac.currentTime + 0.1 + i * 0.6);
    timers.push(setTimeout(then, 100 + 3 * 600));
  };

  const highlight = label => {
    ctx.body.querySelectorAll('[data-chord-slot]').forEach(el => {
      el.classList.toggle('drill-chord-on', el.dataset.chordSlot === label);
    });
  };

  ctx.body.querySelectorAll('[data-drill-mode]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (running) return;
      const mode = btn.dataset.drillMode;
      if (mode === 'mic') {
        const ok = await ensureMic(statusEl);
        if (!ok) return;
      }
      running = true;
      ctx.body.querySelectorAll('[data-drill-mode]').forEach(b => { b.disabled = true; });
      countIn(() => {
        if (!running) return;
        if (mode === 'mic') {
          statusEl.textContent = `🟢 Escuchando: alterna ${chordA} ⇄ ${chordB} dejando sonar cada acorde.`;
          const counter = new ChordChangeCounter({ minHoldMs: step.minHoldMs || 250 });
          runTimer(now => {
            const a = pitchDetector.checkChordMatch(chordA);
            const b = pitchDetector.checkChordMatch(chordB);
            let label = null;
            if (a.matched || b.matched) label = a.score >= b.score ? 'A' : 'B';
            highlight(counter.stable);
            if (counter.push(label, now)) countEl.textContent = String(counter.changes);
          }, () => finish(counter.changes, 'micrófono'));
        } else {
          statusEl.textContent = 'Toca el botón cada vez que el nuevo acorde suene limpio (sé honesto: es tu práctica).';
          const pad = $('[data-drill-tap]');
          pad.classList.remove('hidden');
          let changes = 0;
          let last = 0;
          const register = () => {
            const now = performance.now();
            if (!running || now - last < 250) return;
            last = now;
            changes++;
            countEl.textContent = String(changes);
            highlight(changes % 2 ? 'B' : 'A');
          };
          pad.addEventListener('pointerdown', register);
          keyHandler = e => { if (e.code === 'Space') { e.preventDefault(); register(); } };
          window.addEventListener('keydown', keyHandler);
          runTimer(null, () => finish(changes, 'autoconteo'));
        }
      });
    });
  });

  return () => {
    running = false;
    timers.forEach(clearTimeout);
    if (rafId) cancelAnimationFrame(rafId);
    if (keyHandler) window.removeEventListener('keydown', keyHandler);
  };
}

// ---------------------------------------------------------------------------
// 2) PRECISIÓN RÍTMICA CON METRÓNOMO
// ---------------------------------------------------------------------------
function renderStrumTiming(step, ctx) {
  const bpm = step.bpm || 70;
  const beatsPerBar = step.beatsPerBar || 4;
  const bars = step.bars || 4;
  const tol = step.toleranceMs || 90;
  const minHitRate = step.minHitRate ?? 0.75;
  const totalBeats = beatsPerBar * bars;
  const interval = 60000 / bpm;
  const timers = [];
  let keyHandler = null;
  let running = false;

  ctx.body.innerHTML = `
    <div class="lesson-card-step center-step drill-card">
      ${ctx.headerHtml}
      <h2 class="lesson-step-title">${esc(step.title)}</h2>
      <p class="lesson-instruction-p">${esc(step.instruction)}</p>
      <div class="drill-objective">🎯 Meta: <strong>${Math.round(minHitRate * 100)}% de los ${totalBeats} pulsos</strong> dentro de ±${tol} ms · ${bpm} BPM · ${esc(step.meter || `${beatsPerBar}/4`)}</div>
      ${step.chord ? `<div class="drill-chord-pair"><div class="drill-chord">${renderChordSVG(step.chord, { width: 120, showBasses: true })}</div></div>` : ''}
      <div class="drill-beats" data-drill-beats>
        ${Array.from({ length: totalBeats }, (_, i) => `<span class="drill-beat ${i % beatsPerBar === 0 ? 'drill-beat-down' : ''}" data-beat="${i}"></span>`).join('')}
      </div>
      <label class="drill-toggle"><input type="checkbox" data-drill-audible> Metrónomo audible durante la medición <small>(con micrófono, solo usando audífonos)</small></label>
      <button class="drill-tap-pad hidden" data-drill-tap>👆 Toca aquí en cada pulso<br><small>(o barra espaciadora)</small></button>
      ${modeButtonsHtml('Medir mi guitarra (micrófono / línea)', 'Sin micrófono (tocar la pantalla)')}
    </div>`;

  const $ = sel => ctx.body.querySelector(sel);
  const statusEl = $('[data-drill-status]');
  const dots = [...ctx.body.querySelectorAll('[data-beat]')];

  const finish = (onsets, beats, source) => {
    running = false;
    if (keyHandler) window.removeEventListener('keydown', keyHandler);
    pitchDetector.offLevel(LEVEL_ID);
    $('[data-drill-tap]')?.classList.add('hidden');
    const r = scoreTiming(onsets, beats, tol);
    r.deviations.forEach((d, i) => {
      const cls = d === null ? 'beat-miss' : Math.abs(d) <= tol ? 'beat-hit' : Math.abs(d) <= tol * 2 ? 'beat-near' : 'beat-off';
      dots[i]?.classList.add(cls);
      if (dots[i]) dots[i].title = d === null ? 'Sin ataque' : `${d > 0 ? '+' : ''}${Math.round(d)} ms`;
    });
    const success = r.hitRate >= minHitRate;
    const pct = Math.round(r.hitRate * 100);
    ctx.onResult({
      success,
      source,
      userAnswer: `${r.hits}/${r.total} pulsos (${pct}%) · error medio ${r.meanAbsMs} ms · sesgo ${r.meanSignedMs} ms · ${source}`,
      expectedAnswer: `≥ ${Math.round(minHitRate * 100)}% dentro de ±${tol} ms a ${bpm} BPM`,
      summaryHtml: `${r.hits}/${r.total} pulsos a tiempo (${pct}%), error medio ${r.meanAbsMs} ms. ${describeTimingTendency(r.meanSignedMs)}${r.extra > 2 ? ` Hubo ${r.extra} ataques fuera del pulso.` : ''}`
    });
  };

  ctx.body.querySelectorAll('[data-drill-mode]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (running) return;
      const mode = btn.dataset.drillMode;
      if (mode === 'mic') {
        const ok = await ensureMic(statusEl);
        if (!ok) return;
      }
      running = true;
      ctx.body.querySelectorAll('[data-drill-mode]').forEach(b => { b.disabled = true; });
      dots.forEach(d => { d.className = d.className.replace(/\bbeat-\w+\b/g, '').trim(); });

      const audible = $('[data-drill-audible]').checked || mode === 'tap';
      const ac = audioEngine.init();
      const countIn = beatsPerBar;
      const t0 = ac.currentTime + 0.25;
      for (let i = 0; i < countIn + totalBeats; i++) {
        if (i < countIn || audible) audioEngine.playClick(i % beatsPerBar === 0, t0 + (i * interval) / 1000);
      }
      const firstBeatPerf = audioTimeToPerf(ac, t0 + (countIn * interval) / 1000);
      const beats = beatGrid(firstBeatPerf, bpm, totalBeats);
      const windowStart = beats[0] - interval / 2;
      const windowEnd = beats[beats.length - 1] + interval / 2;
      const onsets = [];

      statusEl.textContent = `Cuenta de entrada: ${countIn} clics… y empieza en el siguiente pulso.`;
      beats.forEach((b, i) => {
        timers.push(setTimeout(() => {
          dots.forEach(d => d.classList.remove('drill-beat-now'));
          dots[i]?.classList.add('drill-beat-now');
          if (i === 0) statusEl.textContent = mode === 'mic' ? '🟢 Midiendo: un rasgueo hacia abajo por pulso.' : '🟢 Midiendo: toca en cada pulso.';
        }, Math.max(0, b - performance.now())));
      });

      if (mode === 'mic') {
        const det = new OnsetDetector({ minRms: Math.max(0.012, pitchDetector.noiseGate * 1.5) });
        const lat = inputLatencyMs();
        pitchDetector.onLevel(LEVEL_ID, ({ rmsRecent, rms, t }) => {
          const level = rmsRecent ?? rms;
          const tt = (t ?? performance.now()) - lat;
          if (det.push(level, tt) && tt >= windowStart && tt <= windowEnd) onsets.push(tt);
        });
      } else {
        const pad = $('[data-drill-tap]');
        pad.classList.remove('hidden');
        const register = e => {
          const tt = e.timeStamp || performance.now();
          if (tt >= windowStart && tt <= windowEnd) onsets.push(tt);
          pad.classList.add('drill-tap-flash');
          setTimeout(() => pad.classList.remove('drill-tap-flash'), 90);
        };
        pad.addEventListener('pointerdown', register);
        keyHandler = e => { if (e.code === 'Space') { e.preventDefault(); register(e); } };
        window.addEventListener('keydown', keyHandler);
      }

      timers.push(setTimeout(() => {
        dots.forEach(d => d.classList.remove('drill-beat-now'));
        finish(onsets, beats, mode === 'mic' ? 'micrófono' : 'toque en pantalla');
      }, Math.max(0, windowEnd - performance.now()) + 50));
    });
  });

  return () => {
    running = false;
    timers.forEach(clearTimeout);
    pitchDetector.offLevel(LEVEL_ID);
    if (keyHandler) window.removeEventListener('keydown', keyHandler);
  };
}

// ---------------------------------------------------------------------------
// 3) OÍDO: ACORDE MAYOR vs. MENOR
// ---------------------------------------------------------------------------
function renderEarQuality(step, ctx) {
  const roundsN = step.rounds || 4;
  const minCorrect = step.minCorrect ?? Math.ceil(roundsN * 0.75);
  const rounds = makeEarRounds(roundsN);
  const timers = [];
  let idx = 0;
  let correct = 0;
  const history = [];

  ctx.body.innerHTML = `
    <div class="lesson-card-step center-step drill-card">
      ${ctx.headerHtml}
      <h2 class="lesson-step-title">${esc(step.title)}</h2>
      <p class="lesson-instruction-p">${esc(step.instruction)}</p>
      <div class="drill-objective">🎯 Meta: <strong>${minCorrect} de ${roundsN}</strong> aciertos</div>
      <div class="drill-round" data-ear-round></div>
      <div class="drill-mode-row">
        <button class="duo-btn btn-purple" data-ear-play>🔊 Repetir acorde</button>
        <button class="duo-btn btn-outline btn-sm" data-ear-arp>🎼 Arpegiado (nota a nota)</button>
      </div>
      <div class="quiz-options-grid drill-ear-options">
        <button class="quiz-3d-option" data-ear-answer="major"><span class="opt-num-badge">😊</span><span class="opt-label-txt">Mayor (brillante, estable)</span></button>
        <button class="quiz-3d-option" data-ear-answer="minor"><span class="opt-num-badge">😔</span><span class="opt-label-txt">Menor (oscuro, melancólico)</span></button>
      </div>
      <p class="drill-status" data-drill-status></p>
    </div>`;

  const $ = sel => ctx.body.querySelector(sel);
  const play = (mode = 'down') => audioEngine.strumChord(rounds[idx]?.chord, mode);
  const showRound = () => {
    $('[data-ear-round]').textContent = `Ronda ${idx + 1} de ${roundsN}`;
    ctx.body.querySelectorAll('[data-ear-answer]').forEach(b => { b.disabled = false; b.classList.remove('correct', 'wrong'); });
    timers.push(setTimeout(() => play(), 250));
  };

  $('[data-ear-play]').addEventListener('click', () => play('down'));
  $('[data-ear-arp]').addEventListener('click', () => play('arpeggio'));

  ctx.body.querySelectorAll('[data-ear-answer]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (idx >= roundsN) return;
      const r = rounds[idx];
      const ok = btn.dataset.earAnswer === r.quality;
      if (ok) correct++;
      history.push(`${r.chord}${ok ? '✓' : '✗'}`);
      ctx.body.querySelectorAll('[data-ear-answer]').forEach(b => { b.disabled = true; });
      btn.classList.add(ok ? 'correct' : 'wrong');
      $(`[data-ear-answer="${r.quality}"]`).classList.add('correct');
      $('[data-drill-status]').textContent = `${ok ? '✅' : '❌'} Era ${r.chord} (${r.quality === 'major' ? 'Mayor' : 'menor'}).`;
      if (ok) audioEngine.playSuccess(); else audioEngine.playError();
      idx++;
      if (idx < roundsN) {
        timers.push(setTimeout(showRound, 1100));
      } else {
        const success = correct >= minCorrect;
        ctx.onResult({
          success,
          source: 'oído',
          userAnswer: `${correct}/${roundsN} (${history.join(' ')})`,
          expectedAnswer: `≥ ${minCorrect}/${roundsN}`,
          summaryHtml: `${correct} de ${roundsN} acordes identificados (${history.join(' · ')}).`
        });
      }
    });
  });

  showRound();
  return () => timers.forEach(clearTimeout);
}
