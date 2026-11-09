// ============================================================================
// js/fretboard.js
// Estudio Interactivo de Mástil Cromático (15 Trastes) + Diccionario Visual Bono 1:
// - Colores vivos por nota (Boomwhackers / Estilo Duolingo)
// - Modos: Explorar Libre, Escalas/Pentatónicas/Mixolidio, Sistema CAGED,
//          Espejo en Vivo (Micrófono/Línea → Mástil) y Juego "Caza-Notas 60s"
// - Diccionario Completo de Acordes (Top 12 Litúrgico + Cejillas + Slash Chords)
// ============================================================================

import {
  NOTES,
  NOTES_ES,
  NOTE_COLORS,
  SCALES,
  getFretMidi,
  midiToNoteInfo,
  formatChordLabel,
  toKeynerFretCode
} from './music-theory.js';
import { CHORDS_DB, getChordData, renderChordSVG } from './chords-db.js';
import { audioEngine } from './audio-engine.js';
import { pitchDetector } from './pitch-detector.js';

const TOTAL_FRETS = 15; // 0 (al aire) hasta traste 15
const INLAY_FRETS = new Set([3, 5, 7, 9, 12, 15]);
const STRING_NAMES_1_TO_6 = [
  { s: 1, open: 'E', es: '1ª · Mi (e)' },
  { s: 2, open: 'B', es: '2ª · Si (B)' },
  { s: 3, open: 'G', es: '3ª · Sol (G)' },
  { s: 4, open: 'D', es: '4ª · Re (D)' },
  { s: 5, open: 'A', es: '5ª · La (A)' },
  { s: 6, open: 'E', es: '6ª · Mi (E)' }
];

export class FretboardStudio {
  constructor(containerEl, callbacks = {}) {
    this.container = containerEl;
    this.onAwardXP = callbacks.onAwardXP || null;
    this.onAttempt = callbacks.onAttempt || null;
    this.onOpenChordModal = callbacks.onOpenChordModal || null;
    this.onRequestMicSetup = callbacks.onRequestMicSetup || null;

    this.mode = 'explore'; // 'explore' | 'scales' | 'caged' | 'mirror' | 'game'
    this.labelStyle = 'dual'; // 'dual' | 'american' | 'latin'
    this.onlyNaturals = false;

    // Escalas
    this.scaleRoot = 'C';
    this.scaleKey = 'pentatonic_major';

    // CAGED
    this.cagedChord = 'C';
    this.cagedVoicingIdx = 0;

    // Selección / Espejo
    this.lastClicked = { s: 5, f: 3 }; // Do3 por defecto
    this.liveDetectedMidi = null;
    this.liveDetectedPitch = null;

    // Juego Caza-Notas 60s
    this.gameActive = false;
    this.gameTimeLeft = 60;
    this.gameScore = 0;
    this.gameStreak = 0;
    this.gameBest = Number(localStorage.getItem('cv_fret_highscore') || 0);
    this.gameTarget = null; // { s, note, validFrets }
    this.gameTimer = null;
    this.lastGameMicHit = 0;

    // Diccionario inferior
    this.dictFilter = 'top12'; // 'top12' | 'Mayor' | 'Menor' | 'Séptima' | 'Especial' | 'all'
  }

  init() {
    this._bindPitchEvents();
    this.render();
  }

  setMode(mode) {
    if (this.mode === 'game' && mode !== 'game') {
      this._stopGame(false);
    }
    this.mode = mode;
    this.render();
  }

  _bindPitchEvents() {
    pitchDetector.onPitch('fretboard-studio', (pitch) => {
      this.liveDetectedMidi = pitch.midi;
      this.liveDetectedPitch = pitch;

      if (this.mode === 'mirror') {
        this._refreshMirrorHighlights();
      } else if (this.mode === 'game' && this.gameActive && this.gameTarget) {
        const now = performance.now();
        if (now - this.lastGameMicHit < 450) return;

        // Validar si la nota tocada en guitarra real coincide con el objetivo en esa cuerda
        const matchFret = this.gameTarget.validFrets.find(f => getFretMidi(this.gameTarget.s, f) === pitch.midi);
        if (matchFret !== undefined || (pitch.note === this.gameTarget.note && pitch.clarity > 0.85)) {
          this.lastGameMicHit = now;
          this._handleGameHit(this.gameTarget.s, matchFret ?? this.gameTarget.validFrets[0], true);
        }
      }
    });
  }

  _formatNote(noteName) {
    if (this.labelStyle === 'american') return noteName;
    if (this.labelStyle === 'latin') return NOTES_ES[noteName] || noteName;
    const es = NOTES_ES[noteName] || noteName;
    return noteName.includes('#') ? noteName : `${noteName}·${es}`;
  }

  _isNoteVisible(s, f) {
    const midi = getFretMidi(s, f);
    const info = midiToNoteInfo(midi);

    if (this.mode === 'explore') {
      if (this.onlyNaturals && info.note.includes('#')) return { show: false, info };
      return { show: true, info, isRoot: info.note === 'C' };
    }

    if (this.mode === 'scales') {
      const rootIdx = NOTES.indexOf(this.scaleRoot);
      const scaleObj = SCALES[this.scaleKey] || SCALES.major;
      const allowed = new Set(scaleObj.intervals.map(iv => NOTES[(rootIdx + iv) % 12]));
      const show = allowed.has(info.note);
      return { show, info, isRoot: info.note === this.scaleRoot };
    }

    if (this.mode === 'caged') {
      const chordData = getChordData(this.cagedChord);
      const v = chordData.voicings[this.cagedVoicingIdx] || chordData.voicings[0];
      // v.frets index: 0=6ª, 5=1ª => idx = 6 - s
      const targetFret = v.frets[6 - s];
      const finger = v.fingers ? v.fingers[6 - s] : 0;
      const show = targetFret === f;
      const isBass1 = v.bass1 === s && show;
      const isBass2 = v.bass2 === s && show;
      return { show, info, finger, isBass1, isBass2, isRoot: isBass1 };
    }

    if (this.mode === 'mirror') {
      const isLive = this.liveDetectedMidi === midi;
      const samePitchClass = this.liveDetectedPitch && this.liveDetectedPitch.note === info.note;
      return { show: true, info, isLive, samePitchClass, ghost: !isLive };
    }

    if (this.mode === 'game') {
      // En modo juego ocultamos los nombres de las notas para desafiar la memoria espacial!
      const isTargetString = this.gameTarget && this.gameTarget.s === s;
      return { show: true, info, blind: true, isTargetString };
    }

    return { show: true, info };
  }

  _onClickFret(s, f) {
    audioEngine.init();
    audioEngine.playStringFret(s, f, 1.35);
    this.lastClicked = { s, f };

    if (this.mode === 'game' && this.gameActive && this.gameTarget) {
      const midi = getFretMidi(s, f);
      const info = midiToNoteInfo(midi);
      if (s === this.gameTarget.s && info.note === this.gameTarget.note) {
        this._handleGameHit(s, f, false);
      } else {
        this.gameStreak = 0;
        audioEngine.playError();
        if (this.onAttempt) {
          this.onAttempt({
            lessonId: 'fretboard_game_60s',
            lessonTitle: 'Juego Caza-Notas 60s (Mástil)',
            unitId: 'free_practice',
            questionId: `fb_${this.gameTarget.s}_${this.gameTarget.note}`,
            questionText: `Ubicar ${this.gameTarget.note} (${NOTES_ES[this.gameTarget.note]}) en ${this.gameTarget.s}ª cuerda`,
            questionType: 'fretboard_game',
            theoryId: 'open_strings_colors',
            theoryTitle: 'Las 6 Cuerdas al Aire y su Afinación Estándar',
            outcome: 'no_acierto',
            phase: 'initial',
            userAnswer: `${s}ª tr.${f} (${info.note})`,
            expectedAnswer: `${this.gameTarget.s}ª tr.${this.gameTarget.validFrets.join('/')} (${this.gameTarget.note})`
          });
        }
        this._updateGameHUD(`¡Casi! Pulsaste ${info.note} (${NOTES_ES[info.note]}) en ${s}ª cuerda. Busca ${this.gameTarget.note} en la ${this.gameTarget.s}ª.`, 'error');
      }
      return;
    }

    this._updateInspectorNote();
  }

  // ==================== JUEGO CAZA-NOTAS 60s ====================
  startGame() {
    this._stopGame(false);
    this.gameActive = true;
    this.gameTimeLeft = 60;
    this.gameScore = 0;
    this.gameStreak = 0;
    this._pickNextGameTarget();
    this.render();

    this.gameTimer = setInterval(() => {
      this.gameTimeLeft--;
      const timerEl = this.container.querySelector('#fb-game-timer');
      if (timerEl) timerEl.textContent = `${this.gameTimeLeft}s`;
      if (this.gameTimeLeft <= 0) {
        this._stopGame(true);
      }
    }, 1000);
  }

  _stopGame(completed = false) {
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }
    const wasActive = this.gameActive;
    this.gameActive = false;

    if (completed && wasActive) {
      if (this.gameScore > this.gameBest) {
        this.gameBest = this.gameScore;
        localStorage.setItem('cv_fret_highscore', String(this.gameBest));
      }
      audioEngine.playLessonFanfare();
      if (this.onAwardXP && this.gameScore > 0) {
        this.onAwardXP(Math.min(60, 15 + this.gameScore * 3), `Juego Caza-Notas (${this.gameScore} aciertos)`);
      }
      this.render();
    }
  }

  _pickNextGameTarget() {
    const naturals = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const pool = this.gameScore >= 6 ? NOTES : naturals;
    const s = Math.floor(Math.random() * 6) + 1;
    const note = pool[Math.floor(Math.random() * pool.length)];
    const validFrets = [];
    for (let f = 0; f <= 12; f++) {
      if (midiToNoteInfo(getFretMidi(s, f)).note === note) {
        validFrets.push(f);
      }
    }
    this.gameTarget = { s, note, validFrets };
  }

  _handleGameHit(s, f, viaGuitar) {
    this.gameScore++;
    this.gameStreak++;
    if (this.gameStreak > 0 && this.gameStreak % 3 === 0) {
      audioEngine.playCombo();
    } else {
      audioEngine.playSuccess();
    }
    if (this.onAwardXP) {
      this.onAwardXP(viaGuitar ? 5 : 3, viaGuitar ? 'Nota cazada con Guitarra Real' : 'Nota cazada en Mástil');
    }

    const hitNote = this.gameTarget.note;
    if (this.onAttempt) {
      this.onAttempt({
        lessonId: 'fretboard_game_60s',
        lessonTitle: 'Juego Caza-Notas 60s (Mástil)',
        unitId: 'free_practice',
        questionId: `fb_${this.gameTarget.s}_${hitNote}`,
        questionText: `Ubicar ${hitNote} (${NOTES_ES[hitNote]}) en ${this.gameTarget.s}ª cuerda`,
        questionType: 'fretboard_game',
        theoryId: 'open_strings_colors',
        theoryTitle: 'Las 6 Cuerdas al Aire y su Afinación Estándar',
        outcome: 'acierto',
        phase: 'initial',
        userAnswer: `${s}ª tr.${f} (${hitNote})${viaGuitar ? ' [Guitarra Real]' : ''}`,
        expectedAnswer: `${this.gameTarget.s}ª tr.${this.gameTarget.validFrets.join('/')} (${hitNote})`
      });
    }
    this._pickNextGameTarget();
    this.render();
    this._updateGameHUD(
      `¡Excelente! Encontraste ${hitNote} (${NOTES_ES[hitNote]}) ${viaGuitar ? 'con tu guitarra 🎸' : 'en el traste ' + f} · Racha x${this.gameStreak}`,
      'ok'
    );
  }

  _updateGameHUD(msg, status) {
    const el = this.container.querySelector('#fb-game-feedback');
    if (!el) return;
    el.textContent = msg;
    el.className = `fb-game-feedback ${status === 'error' ? 'fb-err' : 'fb-ok'}`;
  }

  _playScaleDemo() {
    audioEngine.init();
    const rootIdx = NOTES.indexOf(this.scaleRoot);
    const scaleObj = SCALES[this.scaleKey] || SCALES.major;
    // Encontrar raíz cómoda entre MIDI 48 (C3) y 59 (B3)
    const baseMidi = 48 + rootIdx;
    const sequence = [...scaleObj.intervals, 12];
    sequence.forEach((iv, i) => {
      setTimeout(() => {
        audioEngine.playMidi(baseMidi + iv, 0.55, 0.78);
      }, i * 210);
    });
  }

  _refreshMirrorHighlights() {
    if (!this.container) return;
    const badge = this.container.querySelector('#fb-mirror-live-readout');
    if (badge && this.liveDetectedPitch) {
      const p = this.liveDetectedPitch;
      const col = NOTE_COLORS[p.note] || NOTE_COLORS.C;
      const centsTxt = p.cents >= 0 ? `+${p.cents}` : `${p.cents}`;
      badge.innerHTML = `
        <span class="badge-vivid" style="background:${col.bg};color:${col.text}">
          🎸 Sonando: ${p.note}${p.octave} (${NOTES_ES[p.note]})
        </span>
        <span class="mirror-freq-txt">${p.freq.toFixed(1)} Hz · Desviación: ${centsTxt} cents</span>
      `;
    }

    this.container.querySelectorAll('.fb-note-chip').forEach((btn) => {
      const midi = Number(btn.dataset.midi);
      const note = btn.dataset.note;
      const isExact = midi === this.liveDetectedMidi;
      const isClass = this.liveDetectedPitch && note === this.liveDetectedPitch.note;
      btn.classList.toggle('mirror-exact-hit', isExact);
      btn.classList.toggle('mirror-octave-hit', !isExact && Boolean(isClass));
      btn.classList.toggle('mirror-dimmed', !isExact && !isClass);
    });
  }

  _updateInspectorNote() {
    const box = this.container.querySelector('#fb-note-inspector');
    if (!box) return;
    const { s, f } = this.lastClicked;
    const midi = getFretMidi(s, f);
    const info = midiToNoteInfo(midi);
    const col = NOTE_COLORS[info.note] || NOTE_COLORS.C;
    const freq = (440 * Math.pow(2, (midi - 69) / 12)).toFixed(1);

    // Buscar posiciones unísonas equivalentes en otras cuerdas
    const unisons = [];
    for (let str = 1; str <= 6; str++) {
      for (let fr = 0; fr <= TOTAL_FRETS; fr++) {
        if (str !== s && getFretMidi(str, fr) === midi) {
          unisons.push(`${str}ª cuerda traste ${fr}`);
        }
      }
    }

    box.innerHTML = `
      <div class="fb-insp-pill" style="background:${col.bg};border-bottom-color:${col.border};color:${col.text}">
        ${info.note}${info.octave} · ${NOTES_ES[info.note]}
      </div>
      <div class="fb-insp-details">
        <strong>${s}ª cuerda · Traste ${f === 0 ? '0 (Al aire)' : f} · <span class="badge-vivid badge-purple">Cód. Keyner ${toKeynerFretCode(s, f)}</span></strong>
        <span>Frecuencia: ${freq} Hz · MIDI ${midi}</span>
        ${unisons.length ? `<span class="fb-unison-hint">🔁 Misma altura exacta en: ${unisons.join(' · ')}</span>` : '<span class="fb-unison-hint">✨ Nota única en este registro del mástil</span>'}
      </div>
    `;
  }

  _getFilteredDictionaryChords() {
    const entries = Object.entries(CHORDS_DB);
    if (this.dictFilter === 'top12') {
      return entries
        .filter(([, d]) => d.top12Rank)
        .sort((a, b) => a[1].top12Rank - b[1].top12Rank);
    }
    if (this.dictFilter === 'all') {
      return entries;
    }
    return entries.filter(([, d]) => d.category === this.dictFilter);
  }

  render() {
    if (!this.container) return;

    const scaleObj = SCALES[this.scaleKey] || SCALES.major;
    const cagedData = getChordData(this.cagedChord);
    const dictEntries = this._getFilteredDictionaryChords();

    this.container.innerHTML = `
      <div class="fretboard-studio-wrap">
        <!-- Cabecera y Selector de Modos Estilo Duolingo -->
        <div class="duo-card fb-header-card">
          <div class="fb-top-row">
            <div>
              <h2 class="section-vivid-title">🎸 Mástil Cromático Vivo & Sistema CAGED</h2>
              <p class="tab-subtitle">Haz clic en cualquier traste o conecta tu guitarra para iluminar notas, escalas pentatónicas/mixolidias y posiciones CAGED.</p>
            </div>
            <div class="fb-notation-toggle">
              <label class="tb-lbl">Etiquetas:</label>
              <select id="fb-label-style" class="duo-select">
                <option value="dual" ${this.labelStyle === 'dual' ? 'selected' : ''}>Dual (C·Do)</option>
                <option value="american" ${this.labelStyle === 'american' ? 'selected' : ''}>Americano (C, D, E)</option>
                <option value="latin" ${this.labelStyle === 'latin' ? 'selected' : ''}>Latino (Do, Re, Mi)</option>
              </select>
            </div>
          </div>

          <div class="fb-mode-pills">
            <button class="duo-pill ${this.mode === 'explore' ? 'active' : ''}" data-fbmode="explore">🌈 Explorar Notas</button>
            <button class="duo-pill ${this.mode === 'scales' ? 'active' : ''}" data-fbmode="scales">🗺️ Escalas y Mapas</button>
            <button class="duo-pill ${this.mode === 'caged' ? 'active' : ''}" data-fbmode="caged">📐 Acordes CAGED</button>
            <button class="duo-pill ${this.mode === 'mirror' ? 'active' : ''}" data-fbmode="mirror">🎙️ Espejo Guitarra en Vivo</button>
            <button class="duo-pill ${this.mode === 'game' ? 'active' : ''}" data-fbmode="game">⚡ Juego Caza-Notas</button>
          </div>

          <!-- Sub-barra contextual según el modo -->
          <div class="fb-subcontrols-bar">
            ${this.mode === 'explore' ? `
              <label class="duo-checkbox">
                <input type="checkbox" id="fb-only-naturals" ${this.onlyNaturals ? 'checked' : ''} />
                <span>Mostrar solo notas naturales (ocultar sostenidos # para memorizar primero)</span>
              </label>
            ` : ''}

            ${this.mode === 'scales' ? `
              <div class="fb-controls-inline">
                <label>Tónica:</label>
                <select id="fb-scale-root" class="duo-select">
                  ${NOTES.map(n => `<option value="${n}" ${this.scaleRoot === n ? 'selected' : ''}>${n} (${NOTES_ES[n]})</option>`).join('')}
                </select>
                <label>Escala / Mapa:</label>
                <select id="fb-scale-key" class="duo-select">
                  ${Object.entries(SCALES).map(([k, sc]) => `<option value="${k}" ${this.scaleKey === k ? 'selected' : ''}>${sc.name}</option>`).join('')}
                </select>
                <button id="fb-play-scale" class="duo-btn btn-green btn-sm">▶ Escuchar Escala</button>
                <span class="scale-formula-chip">Fórmula: <strong>${scaleObj.formula}</strong> · ${scaleObj.usage}</span>
              </div>
            ` : ''}

            ${this.mode === 'caged' ? `
              <div class="fb-controls-inline">
                <label>Acorde:</label>
                <select id="fb-caged-chord" class="duo-select">
                  ${Object.keys(CHORDS_DB).map(ch => `<option value="${ch}" ${this.cagedChord === ch ? 'selected' : ''}>${formatChordLabel(ch, 'dual')}</option>`).join('')}
                </select>
                <div class="caged-voicing-pills">
                  ${cagedData.voicings.map((v, idx) => `
                    <button class="mini-pill ${this.cagedVoicingIdx === idx ? 'active' : ''}" data-vidx="${idx}">
                      Posición ${idx + 1}: ${v.label}
                    </button>
                  `).join('')}
                </div>
                <button id="fb-caged-strum" class="duo-btn btn-green btn-sm">🔊 Rasguear Posición</button>
              </div>
            ` : ''}

            ${this.mode === 'mirror' ? `
              <div class="fb-mirror-bar">
                <div id="fb-mirror-live-readout" class="fb-mirror-readout">
                  ${pitchDetector.isListening
                    ? '<span class="badge-vivid badge-green">🎙️ Escuchando tu guitarra... ¡Toca cualquier cuerda o traste!</span>'
                    : '<span class="badge-vivid badge-orange">🔌 Conecta tu micrófono o interfaz para iluminar el mástil en vivo</span>'}
                </div>
                ${!pitchDetector.isListening ? `<button id="fb-activate-mic" class="duo-btn btn-blue btn-sm">🎙️ Activar Entrada de Guitarra</button>` : ''}
              </div>
            ` : ''}

            ${this.mode === 'game' ? `
              <div class="fb-game-bar">
                <div class="fb-game-stats">
                  <span class="game-stat-pill pill-orange">⏱️ <strong id="fb-game-timer">${this.gameTimeLeft}s</strong></span>
                  <span class="game-stat-pill pill-green">🎯 Aciertos: <strong>${this.gameScore}</strong></span>
                  <span class="game-stat-pill pill-purple">🔥 Racha: <strong>x${this.gameStreak}</strong></span>
                  <span class="game-stat-pill pill-blue">🏆 Récord: <strong>${this.gameBest}</strong></span>
                </div>
                ${this.gameActive && this.gameTarget ? `
                  <div class="fb-game-prompt">
                    ¡Busca <strong class="target-note-badge" style="background:${NOTE_COLORS[this.gameTarget.note].bg};color:${NOTE_COLORS[this.gameTarget.note].text}">${this.gameTarget.note} (${NOTES_ES[this.gameTarget.note]})</strong> en la <strong>${this.gameTarget.s}ª cuerda</strong>!
                    <small>(Haz clic en el traste O tócala en tu guitarra real)</small>
                  </div>
                ` : `
                  <div class="fb-game-prompt">
                    Entrena tu velocidad mental ubicando notas en las 6 cuerdas (con clic o micrófono/línea).
                  </div>
                `}
                <button id="fb-start-game" class="duo-btn ${this.gameActive ? 'btn-orange' : 'btn-green'} btn-sm">
                  ${this.gameActive ? '🔄 Reiniciar (60s)' : '▶ ¡Iniciar Reto 60s!'}
                </button>
              </div>
              <div id="fb-game-feedback" class="fb-game-feedback"></div>
            ` : ''}
          </div>
        </div>

        <!-- DIAPASÓN HORIZONTAL DE MADERA CON TRASTES Y COLORES VIVOS -->
        <div class="duo-card fb-neck-card">
          <div class="fb-neck-scroll">
            <div class="fb-wood-board">
              <!-- Numeración superior de trastes -->
              <div class="fb-fret-numbers-row">
                <div class="fb-string-head-col">Cuerda</div>
                ${Array.from({ length: TOTAL_FRETS + 1 }, (_, f) => `
                  <div class="fb-fret-num-cell ${f === 0 ? 'nut-col' : ''} ${INLAY_FRETS.has(f) ? 'inlay-num' : ''}">
                    ${f === 0 ? 'Aire (0)' : f}
                  </div>
                `).join('')}
              </div>

              <!-- Las 6 cuerdas (1ª arriba -> 6ª abajo como vista estándar de tablatura/estudio) -->
              ${STRING_NAMES_1_TO_6.map(({ s, es }) => `
                <div class="fb-string-row ${this.mode === 'game' && this.gameTarget?.s === s ? 'target-string-glow' : ''}" data-string="${s}">
                  <div class="fb-string-head-col">${es}</div>
                  ${Array.from({ length: TOTAL_FRETS + 1 }, (_, f) => {
                    const state = this._isNoteVisible(s, f);
                    const midi = getFretMidi(s, f);
                    const col = NOTE_COLORS[state.info.note] || NOTE_COLORS.C;
                    const wireThickness = 1 + (s - 1) * 0.45;
                    let badgeText = this._formatNote(state.info.note);
                    if (state.blind) badgeText = '?';
                    if (this.mode === 'caged' && state.show && state.finger) {
                      badgeText = `${state.info.note} (D${state.finger})`;
                    }
                    const bassTag = state.isBass1 ? '<em class="fb-bass-mini">B1</em>' : (state.isBass2 ? '<em class="fb-bass-mini b2">B2</em>' : '');

                    return `
                      <div class="fb-fret-cell ${f === 0 ? 'nut-cell' : ''}">
                        <div class="fb-metal-string" style="height:${wireThickness}px"></div>
                        ${s === 3 && INLAY_FRETS.has(f) && f !== 12 ? '<span class="fb-pearl-dot"></span>' : ''}
                        ${(s === 2 || s === 4) && f === 12 ? '<span class="fb-pearl-dot"></span>' : ''}
                        ${state.show ? `
                          <button
                            class="fb-note-chip ${state.isRoot ? 'root-ring' : ''} ${state.blind ? 'blind-chip' : ''} ${this.mode === 'mirror' ? 'mirror-dimmed' : ''}"
                            data-s="${s}"
                            data-f="${f}"
                            data-midi="${midi}"
                            data-note="${state.info.note}"
                            style="${state.blind ? '' : `background:${col.bg};border-bottom-color:${col.border};color:${col.text};`}"
                            title="${s}ª cuerda · Traste ${f} · ${state.info.note}${state.info.octave}"
                          >
                            ${badgeText}${bassTag}
                          </button>
                        ` : ''}
                      </div>
                    `;
                  }).join('')}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Inspector inferior de la última nota tocada + Leyenda de colores -->
          <div class="fb-neck-footer">
            <div id="fb-note-inspector" class="fb-note-inspector"></div>
            <div class="fb-chromatic-legend">
              ${['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(n => {
                const c = NOTE_COLORS[n];
                return `<span class="chrom-key-pill" style="background:${c.bg};color:${c.text}">${n} · ${NOTES_ES[n]}</span>`;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- DICCIONARIO INTERACTIVO DE ACORDES (BONO 1 TOP 12 + TODOS) -->
        <div class="duo-card fb-dictionary-card">
          <div class="fb-dict-header">
            <div>
              <h3 class="section-vivid-title">📚 Diccionario Visual e Interactivo de Acordes (Bono 1 + CAGED)</h3>
              <p class="tab-subtitle">Toca cualquier tarjeta para escuchar el acorde real, ver sus bajos <strong>B1/B2</strong> o explorar sus inversiones en el mástil.</p>
            </div>
            <div class="fb-dict-filters">
              ${[
                ['top12', '🏅 Top 12 Cancionero'],
                ['Mayor', '☀️ Mayores'],
                ['Menor', '🌙 Menores'],
                ['Séptima', '⚡ Séptimas (7)'],
                ['Especial', '🪜 Puentes / Slash'],
                ['all', '📖 Todos']
              ].map(([id, lbl]) => `
                <button class="mini-pill ${this.dictFilter === id ? 'active' : ''}" data-dfilter="${id}">${lbl}</button>
              `).join('')}
            </div>
          </div>

          <div class="fb-chord-cards-grid">
            ${dictEntries.map(([chKey, chObj]) => {
              const col = NOTE_COLORS[chKey.replace(/m.*|7.*|sus.*|add.*|maj.*|\/.*/g, '')] || NOTE_COLORS.C;
              return `
                <div class="duo-chord-dict-item" data-dictchord="${chKey}">
                  <div class="dict-item-head">
                    <span class="dict-chord-badge" style="background:${col.bg};color:${col.text}">${chKey}</span>
                    ${chObj.top12Rank ? `<span class="dict-rank-tag">Top #${chObj.top12Rank}</span>` : `<span class="dict-cat-tag">${chObj.category}</span>`}
                  </div>
                  <div class="dict-chord-es-name">${chObj.nameEs}</div>
                  <div class="dict-svg-wrap">
                    ${renderChordSVG(chKey, { voicingIndex: 0, width: 148, showBasses: true })}
                  </div>
                  <div class="dict-card-actions">
                    <button class="duo-btn btn-green btn-xs" data-playchord="${chKey}">🔊 Sonar</button>
                    <button class="duo-btn btn-blue btn-xs" data-sendcaged="${chKey}">📐 En Mástil</button>
                    <button class="duo-btn btn-outline btn-xs" data-detailchord="${chKey}">🔍 Variantes</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this._updateInspectorNote();
    if (this.mode === 'mirror') {
      this._refreshMirrorHighlights();
    }
    this._attachListeners();
  }

  _attachListeners() {
    this.container.querySelectorAll('[data-fbmode]').forEach(btn => {
      btn.addEventListener('click', () => this.setMode(btn.dataset.fbmode));
    });

    this.container.querySelector('#fb-label-style')?.addEventListener('change', (e) => {
      this.labelStyle = e.target.value;
      this.render();
    });

    this.container.querySelector('#fb-only-naturals')?.addEventListener('change', (e) => {
      this.onlyNaturals = e.target.checked;
      this.render();
    });

    this.container.querySelector('#fb-scale-root')?.addEventListener('change', (e) => {
      this.scaleRoot = e.target.value;
      this.render();
    });

    this.container.querySelector('#fb-scale-key')?.addEventListener('change', (e) => {
      this.scaleKey = e.target.value;
      this.render();
    });

    this.container.querySelector('#fb-play-scale')?.addEventListener('click', () => {
      this._playScaleDemo();
    });

    this.container.querySelector('#fb-caged-chord')?.addEventListener('change', (e) => {
      this.cagedChord = e.target.value;
      this.cagedVoicingIdx = 0;
      audioEngine.strumChord(this.cagedChord, 'down', this.cagedVoicingIdx);
      this.render();
    });

    this.container.querySelectorAll('[data-vidx]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.cagedVoicingIdx = Number(btn.dataset.vidx);
        audioEngine.strumChord(this.cagedChord, 'down', this.cagedVoicingIdx);
        this.render();
      });
    });

    this.container.querySelector('#fb-caged-strum')?.addEventListener('click', () => {
      audioEngine.strumChord(this.cagedChord, 'down', this.cagedVoicingIdx);
    });

    this.container.querySelector('#fb-activate-mic')?.addEventListener('click', async () => {
      if (this.onRequestMicSetup) {
        this.onRequestMicSetup();
      } else {
        await pitchDetector.start();
        this.render();
      }
    });

    this.container.querySelector('#fb-start-game')?.addEventListener('click', () => {
      this.startGame();
    });

    this.container.querySelectorAll('.fb-note-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this._onClickFret(Number(btn.dataset.s), Number(btn.dataset.f));
      });
    });

    this.container.querySelectorAll('[data-dfilter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.dictFilter = btn.dataset.dfilter;
        this.render();
      });
    });

    this.container.querySelectorAll('[data-playchord]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        audioEngine.strumChord(btn.dataset.playchord, 'down', 0);
      });
    });

    this.container.querySelectorAll('[data-sendcaged]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.cagedChord = btn.dataset.sendcaged;
        this.cagedVoicingIdx = 0;
        this.mode = 'caged';
        audioEngine.strumChord(this.cagedChord, 'down', 0);
        this.render();
        this.container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    this.container.querySelectorAll('[data-detailchord]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onOpenChordModal) this.onOpenChordModal(btn.dataset.detailchord);
      });
    });

    this.container.querySelectorAll('.duo-chord-dict-item').forEach(card => {
      card.addEventListener('click', () => {
        audioEngine.strumChord(card.dataset.dictchord, 'down', 0);
      });
    });
  }
}
