// ============================================================================
// js/tab-player.js
// Reproductor y Entrenador Interactivo de Tablaturas (TAB) Estilo Duolingo:
// - 6 cuerdas horizontales con píldoras cromáticas vivas (Traste / Nota / Dedo)
// - Mini-mástil guía sincronizado en tiempo real debajo de la tablatura
// - Reproducción sintetizada (Nylon, Requinto, Acordeón Vallenato) + Loop A-B + Velocidad
// - Modo "🎙️ Espera mi Guitarra" (Micrófono o Entrada de Línea Directa) con XP y combos
// ============================================================================

import { TABS_DB } from './tabs-db.js';
import { audioEngine } from './audio-engine.js';
import { pitchDetector } from './pitch-detector.js';
import { getFretMidi, midiToNoteInfo, NOTE_COLORS, NOTES_ES } from './music-theory.js';

export class TabPlayer {
  constructor(containerEl, onAwardXP = null, onOpenChordModal = null) {
    this.container = containerEl;
    this.onAwardXP = onAwardXP;
    this.onOpenChordModal = onOpenChordModal;

    this.currentCategory = 'all'; // 'all' | 'vallenato' | 'catolica' | 'metodo'
    this.currentTab = TABS_DB[0];
    this.activeStepIdx = 0;
    this.isPlaying = false;
    this.isWaitGuitarMode = false;
    this.speedFactor = 1.0; // 0.5, 0.75, 1.0, 1.25
    this.displayMode = 'fret_note'; // 'fret' | 'fret_note' | 'finger'
    this.accompanyChords = true;
    this.loopStart = null;
    this.loopEnd = null;
    this.completedSteps = new Set();
    this.comboCount = 0;
    this.lastHitTime = 0;

    this.timerId = null;
  }

  init() {
    this._bindMicListener();
    this.selectTab(this.currentTab.id);
  }

  _bindMicListener() {
    pitchDetector.onPitch('tab-player', (pitch) => {
      this._updateLiveGuitarBadge(pitch);
      if (!this.isWaitGuitarMode || !this.currentTab) return;

      const step = this.currentTab.steps[this.activeStepIdx];
      if (!step) return;

      const targetMidi = getFretMidi(step.s, step.f);
      const now = performance.now();
      // Evitar doble disparo por la misma vibración de cuerda en menos de 240ms
      if (now - this.lastHitTime < 240) return;

      // Aceptar coincidencia exacta de MIDI (o ±12 si armónico fuerte con misma nota)
      const exactMatch = pitch.midi === targetMidi;
      const closeOctaveMatch = (pitch.midi % 12 === targetMidi % 12) && Math.abs(pitch.midi - targetMidi) === 12 && pitch.clarity > 0.86;

      if (exactMatch || closeOctaveMatch) {
        this.lastHitTime = now;
        this.completedSteps.add(this.activeStepIdx);
        this.comboCount++;
        audioEngine.playSuccess();
        if (this.onAwardXP) this.onAwardXP(3, `Nota acertada en TAB`);

        // Avanzar al siguiente paso
        const endIdx = this.loopEnd !== null ? this.loopEnd : this.currentTab.steps.length - 1;
        const startIdx = this.loopStart !== null ? this.loopStart : 0;

        if (this.activeStepIdx < endIdx) {
          this.activeStepIdx++;
          this._refreshActiveStepUI();
        } else {
          // ¡Tablatura o bucle completado con guitarra real!
          audioEngine.playLessonFanfare();
          if (this.onAwardXP) this.onAwardXP(25, `¡Tablatura "${this.currentTab.title}" completada!`);
          if (this.loopStart !== null) {
            this.activeStepIdx = startIdx;
            this.completedSteps.clear();
            this._refreshActiveStepUI();
          } else {
            this.isWaitGuitarMode = false;
            this._showCompletionBanner();
            this.render();
          }
        }
      }
    });
  }

  selectTab(tabId) {
    this.stop();
    const found = TABS_DB.find(t => t.id === tabId) || TABS_DB[0];
    this.currentTab = found;
    this.activeStepIdx = 0;
    this.loopStart = null;
    this.loopEnd = null;
    this.completedSteps.clear();
    this.comboCount = 0;
    audioEngine.setInstrument(found.recommendedInstrument || 'nylon');
    this.render();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this._updateTransportButtons();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stop();
      return;
    }
    this.isWaitGuitarMode = false;
    this.isPlaying = true;
    audioEngine.init();

    const startIdx = this.loopStart !== null ? this.loopStart : 0;
    if (this.activeStepIdx >= this.currentTab.steps.length - 1 ||
        (this.loopEnd !== null && this.activeStepIdx > this.loopEnd)) {
      this.activeStepIdx = startIdx;
    }

    this._updateTransportButtons();
    this._scheduleCurrentStep();
  }

  async toggleWaitGuitarMode() {
    this.stop();
    if (this.isWaitGuitarMode) {
      this.isWaitGuitarMode = false;
      this.render();
      return;
    }
    if (!pitchDetector.isListening) {
      try {
        await pitchDetector.start();
      } catch (err) {
        alert('No pudimos activar el micrófono/entrada de guitarra. Revisa los permisos del navegador en la barra superior.');
        return;
      }
    }
    this.isWaitGuitarMode = true;
    this.completedSteps.clear();
    this.comboCount = 0;
    if (this.loopStart !== null) {
      this.activeStepIdx = this.loopStart;
    }
    this.render();
  }

  _scheduleCurrentStep() {
    if (!this.isPlaying || !this.currentTab) return;
    const steps = this.currentTab.steps;
    const step = steps[this.activeStepIdx];
    if (!step) {
      this.stop();
      return;
    }

    this._refreshActiveStepUI();

    const effectiveBpm = this.currentTab.bpm * this.speedFactor;
    const beatSec = 60 / effectiveBpm;
    const stepSec = Math.max(0.12, (step.dur || 0.5) * beatSec);

    // Sonar acompañamiento de acorde suave si el paso abre un nuevo acorde
    if (this.accompanyChords && step.chord) {
      audioEngine.strumChord(step.chord, 'down');
    }

    // Sonar la nota principal de la tablatura
    const midi = getFretMidi(step.s, step.f);
    audioEngine.playMidi(midi, Math.max(0.45, stepSec * 1.4), 0.52, audioEngine.instrument);

    const endIdx = this.loopEnd !== null ? this.loopEnd : steps.length - 1;
    const startIdx = this.loopStart !== null ? this.loopStart : 0;

    this.timerId = setTimeout(() => {
      if (!this.isPlaying) return;
      if (this.activeStepIdx < endIdx) {
        this.activeStepIdx++;
        this._scheduleCurrentStep();
      } else if (this.loopStart !== null) {
        this.activeStepIdx = startIdx;
        this._scheduleCurrentStep();
      } else {
        this.stop();
        audioEngine.playSuccess();
        if (this.onAwardXP) this.onAwardXP(10, 'Estudio de Tablatura escuchado');
      }
    }, stepSec * 1000);
  }

  render() {
    if (!this.container) return;
    const filteredTabs = this.currentCategory === 'all'
      ? TABS_DB
      : (this.currentCategory === 'keyner'
          ? TABS_DB.filter(t => t.sourceMethod === 'keyner')
          : TABS_DB.filter(t => t.category === this.currentCategory));
    const keynerCount = TABS_DB.filter(t => t.sourceMethod === 'keyner').length;

    const tab = this.currentTab;
    const currentStep = tab.steps[this.activeStepIdx] || tab.steps[0];
    const currentMidi = getFretMidi(currentStep.s, currentStep.f);
    const currentNoteInfo = midiToNoteInfo(currentMidi);

    this.container.innerHTML = `
      <div class="tab-studio-layout">
        <!-- Selector Superior de Categorías y Piezas -->
        <div class="duo-card tab-catalog-card">
          <div class="tab-cat-pills">
            <button class="duo-pill ${this.currentCategory === 'all' ? 'active' : ''}" data-cat="all">🌟 Todas (${TABS_DB.length})</button>
            <button class="duo-pill pill-orange ${this.currentCategory === 'vallenato' ? 'active' : ''}" data-cat="vallenato">🪗 Vallenatos y Folclor</button>
            <button class="duo-pill pill-blue ${this.currentCategory === 'catolica' ? 'active' : ''}" data-cat="catolica">🕊️ Alabanzas Católicas</button>
            <button class="duo-pill pill-purple ${this.currentCategory === 'metodo' ? 'active' : ''}" data-cat="metodo">🎓 Ejercicios de Métodos</button>
            <button class="duo-pill pill-teal ${this.currentCategory === 'keyner' ? 'active' : ''}" data-cat="keyner">📕 Método Keyner 10-60 (${keynerCount})</button>
          </div>

          <div class="tab-song-strip">
            ${filteredTabs.map(t => `
              <button class="tab-select-chip ${t.id === tab.id ? 'selected' : ''}" data-tabid="${t.id}">
                <span class="chip-icon">${t.category === 'vallenato' ? '🪗' : (t.category === 'catolica' ? '🕊️' : '🎓')}</span>
                <span class="chip-texts">
                  <strong>${t.title}</strong>
                  <small>${t.subgenre} · Tono ${t.key} · ${'⭐'.repeat(t.difficulty)}</small>
                </span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Cabecera y Controles del Reproductor TAB -->
        <div class="duo-card tab-main-card">
          <div class="tab-header-row">
            <div>
              <div class="tab-badges-line">
                <span class="badge-vivid badge-green">${tab.subgenre}</span>
                <span class="badge-vivid badge-blue">Tono: ${tab.key}</span>
                <span class="badge-vivid badge-yellow">♩ = ${Math.round(tab.bpm * this.speedFactor)} BPM</span>
              </div>
              <h2 class="tab-title">${tab.title}</h2>
              <p class="tab-subtitle">${tab.artist} — ${tab.description}</p>
            </div>
            <div class="tab-yt-actions">
              <a class="duo-btn btn-red btn-sm" href="https://www.youtube.com/results?search_query=${encodeURIComponent(tab.youtubeQuery)}" target="_blank" rel="noopener">
                ▶ Ver Video en YouTube
              </a>
            </div>
          </div>

          <!-- Barra de Transporte Estilo Duolingo -->
          <div class="tab-transport-bar">
            <button id="tab-btn-play" class="duo-btn ${this.isPlaying ? 'btn-orange' : 'btn-green'}">
              ${this.isPlaying ? '⏸ Pausar TAB' : '▶ Escuchar TAB'}
            </button>

            <button id="tab-btn-wait-mic" class="duo-btn ${this.isWaitGuitarMode ? 'btn-purple pulse-border' : 'btn-blue'}">
              ${this.isWaitGuitarMode ? '🎙️ Escuchando tu Guitarra (Activo)' : '🎸 Practicar con mi Guitarra (Mic/Línea)'}
            </button>

            <button id="tab-btn-reset" class="duo-btn btn-outline btn-sm" title="Volver al inicio">⏮ Inicio</button>

            <div class="transport-group">
              <label>Velocidad:</label>
              <div class="speed-pills">
                ${[0.5, 0.75, 1.0, 1.25].map(sp => `
                  <button class="mini-pill ${this.speedFactor === sp ? 'active' : ''}" data-speed="${sp}">${Math.round(sp * 100)}%</button>
                `).join('')}
              </div>
            </div>

            <div class="transport-group">
              <label>Sonido:</label>
              <select id="tab-inst-select" class="duo-select">
                <option value="nylon" ${audioEngine.instrument === 'nylon' ? 'selected' : ''}>🎸 Guitarra Clásica</option>
                <option value="requinto" ${audioEngine.instrument === 'requinto' ? 'selected' : ''}>✨ Requinto Punteo</option>
                <option value="accordion" ${audioEngine.instrument === 'accordion' ? 'selected' : ''}>🪗 Acordeón Vallenato</option>
              </select>
            </div>

            <div class="transport-group">
              <label>Mostrar:</label>
              <select id="tab-display-select" class="duo-select">
                <option value="fret_note" ${this.displayMode === 'fret_note' ? 'selected' : ''}>Traste + Nota</option>
                <option value="keyner" ${this.displayMode === 'keyner' ? 'selected' : ''}>🔢 Método Keyner (10-60)</option>
                <option value="fret" ${this.displayMode === 'fret' ? 'selected' : ''}>Solo N.º Traste</option>
                <option value="finger" ${this.displayMode === 'finger' ? 'selected' : ''}>Dedo Mano Izq.</option>
              </select>
            </div>

            <label class="duo-checkbox">
              <input type="checkbox" id="tab-chk-chords" ${this.accompanyChords ? 'checked' : ''} />
              <span>Acordes base</span>
            </label>
          </div>

          ${this.isWaitGuitarMode ? `
            <div class="wait-guitar-banner">
              <div class="wg-left">
                <span class="wg-mic-dot"></span>
                <div>
                  <strong>¡Toca la nota resaltada en tu guitarra!</strong>
                  <span>Objetivo ahora: <b>${currentStep.s}ª cuerda · Traste ${currentStep.f}</b> (${currentNoteInfo.noteEs}${currentNoteInfo.octave} / ${currentNoteInfo.note}${currentNoteInfo.octave})</span>
                </div>
              </div>
              <div class="wg-right">
                <span id="tab-live-heard" class="live-heard-pill">Esperando tu cuerda...</span>
                <button id="tab-btn-skip-step" class="duo-btn btn-outline btn-xs">Saltar nota ⏭</button>
              </div>
            </div>
          ` : ''}

          <!-- Lienzo Horizontal de 6 Cuerdas (TAB) -->
          <div class="tab-scroll-viewport" id="tab-scroll-viewport">
            <div class="tab-sheet-grid" style="grid-template-columns: 78px repeat(${tab.steps.length}, 66px);">
              <!-- Fila de Acordes Arriba -->
              <div class="tab-row-label chord-row-lbl">Acorde</div>
              ${tab.steps.map((st, idx) => `
                <div class="tab-chord-cell ${idx === this.activeStepIdx ? 'active-col' : ''}" data-step="${idx}">
                  ${st.chord ? `<button class="tab-chord-badge" data-chord="${st.chord}">${st.chord}</button>` : ''}
                </div>
              `).join('')}

              <!-- 6 Cuerdas: 1ª (arriba) a 6ª (abajo) -->
              ${[
                { s: 1, lbl: '1ª Mi (e)' },
                { s: 2, lbl: '2ª Si (B)' },
                { s: 3, lbl: '3ª Sol (G)' },
                { s: 4, lbl: '4ª Re (D)' },
                { s: 5, lbl: '5ª La (A)' },
                { s: 6, lbl: '6ª Mi (E)' }
              ].map(strObj => `
                <div class="tab-string-label">${strObj.lbl}</div>
                ${tab.steps.map((st, idx) => {
                  const isActive = idx === this.activeStepIdx;
                  const isDone = this.completedSteps.has(idx);
                  const inLoop = this.loopStart !== null && this.loopEnd !== null && idx >= this.loopStart && idx <= this.loopEnd;
                  if (st.s !== strObj.s) {
                    return `
                      <div class="tab-cell empty-cell ${isActive ? 'active-col' : ''} ${inLoop ? 'loop-col' : ''}" data-step="${idx}">
                        <span class="tab-wire string-w-${strObj.s}"></span>
                      </div>
                    `;
                  }
                  const midi = getFretMidi(st.s, st.f);
                  const nInfo = midiToNoteInfo(midi);
                  let badgeText = String(st.f);
                  let subText = '';
                  if (this.displayMode === 'fret_note') {
                    badgeText = String(st.f);
                    subText = nInfo.noteEs;
                  } else if (this.displayMode === 'keyner') {
                    badgeText = `${st.s}${st.f}`;
                    subText = nInfo.noteEs;
                  } else if (this.displayMode === 'finger') {
                    badgeText = st.finger === 0 ? '0' : `D${st.finger}`;
                    subText = `Tr.${st.f}`;
                  }
                  const keynerCode = `${st.s}${st.f}`;
                  return `
                    <div class="tab-cell note-cell ${isActive ? 'active-col' : ''} ${isDone ? 'done-col' : ''} ${inLoop ? 'loop-col' : ''}" data-step="${idx}">
                      <span class="tab-wire string-w-${strObj.s}"></span>
                      <button
                        class="tab-fret-pill ${isActive ? 'pill-current' : ''}"
                        style="--pill-bg:${nInfo.color.bg}; --pill-border:${nInfo.color.border}; --pill-txt:${nInfo.color.text};"
                        title="${strObj.lbl}, Traste ${st.f} (Cód. Keyner: ${keynerCode}) · ${nInfo.noteEs}${nInfo.octave} - Dedo ${st.finger || 'aire'}"
                      >
                        <span class="pill-main">${badgeText}</span>
                        ${subText ? `<span class="pill-sub">${subText}</span>` : ''}
                      </button>
                      ${st.tech ? `<span class="tab-tech-tag" title="${st.tech === '*' ? 'Bajo de paso (*) Método Keyner' : st.tech}">${st.tech}</span>` : ''}
                    </div>
                  `;
                }).join('')}
              `).join('')}

              <!-- Fila Inferior: Sílaba / Guía + Estado -->
              <div class="tab-row-label lyric-row-lbl">Guía</div>
              ${tab.steps.map((st, idx) => `
                <div class="tab-lyric-cell ${idx === this.activeStepIdx ? 'active-col' : ''}" data-step="${idx}">
                  <span class="lyric-txt">${st.lyric || '·'}</span>
                  ${this.completedSteps.has(idx) ? '<span class="step-check">★</span>' : `<span class="step-idx">${idx + 1}</span>`}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Controles de Bucle A-B + Guía de Posición en Mástil -->
          <div class="tab-loop-bar">
            <div class="loop-btns">
              <button id="tab-set-a" class="duo-btn btn-outline btn-xs">📍 Marcar Inicio A (Paso ${this.activeStepIdx + 1})</button>
              <button id="tab-set-b" class="duo-btn btn-outline btn-xs">📍 Marcar Fin B (Paso ${this.activeStepIdx + 1})</button>
              ${this.loopStart !== null ? `
                <span class="badge-vivid badge-purple">🔁 Loop Activo: Paso ${this.loopStart + 1} → ${(this.loopEnd ?? tab.steps.length - 1) + 1}</span>
                <button id="tab-clear-loop" class="duo-btn btn-red btn-xs">Quitar Loop</button>
              ` : '<span class="muted-hint">💡 Haz clic en cualquier nota de la tablatura para escucharla y ver dónde pisar.</span>'}
            </div>
          </div>

          <!-- Mini Mástil Guía en Vivo (Trastes 0 a 10) -->
          <div class="tab-mini-neck-box">
            <div class="mini-neck-header">
              <span id="tab-neck-guide-text">
                👉 <strong>Paso ${this.activeStepIdx + 1}/${tab.steps.length}:</strong>
                Cuerda <b>${currentStep.s}ª</b> · Traste <b>${currentStep.f}</b> ·
                <span class="badge-vivid badge-purple" style="padding:2px 8px;font-size:0.78rem;">Cód. Keyner ${currentStep.s}${currentStep.f}</span> ·
                Nota <span class="inline-note-chip" style="background:${currentNoteInfo.color.bg};color:${currentNoteInfo.color.text}">${currentNoteInfo.noteEs} (${currentNoteInfo.note})</span> ·
                ${currentStep.finger ? `Usa <b>Dedo ${currentStep.finger}</b>` : '<b>Cuerda al aire (0)</b>'}
              </span>
            </div>
            <div id="tab-mini-neck-grid" class="tab-mini-neck-grid">
              ${this._renderMiniNeckHTML(currentStep)}
            </div>
          </div>

          <!-- Tips Pedagógicos del Método -->
          <div class="tab-tips-box">
            <h4>💡 Consejos del Profesor para esta Pieza</h4>
            <ul>
              ${(tab.tips || []).map(tip => `<li>${tip}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
    this._scrollToActiveStep();
  }

  _renderMiniNeckHTML(step) {
    const maxFret = Math.max(9, (step.f || 0) + 2);
    let html = `<div class="mn-frets-header"><span class="mn-str-col">Cuerda</span>`;
    for (let f = 0; f <= maxFret; f++) {
      html += `<span class="mn-fret-num">${f === 0 ? 'Aire' : f}</span>`;
    }
    html += `</div>`;

    for (let s = 1; s <= 6; s++) {
      html += `<div class="mn-row"><span class="mn-str-col">${s}ª</span>`;
      for (let f = 0; f <= maxFret; f++) {
        const isTarget = step.s === s && step.f === f;
        const midi = getFretMidi(s, f);
        const info = midiToNoteInfo(midi);
        const dotMarker = (s === 3 && [3, 5, 7, 9].includes(f)) ? 'mn-inlay' : '';
        html += `
          <div class="mn-cell ${f === 0 ? 'mn-open' : ''} ${dotMarker}" data-s="${s}" data-f="${f}">
            ${isTarget ? `
              <span class="mn-target-dot" style="background:${info.color.bg};border-color:${info.color.border};color:${info.color.text}">
                ${info.noteEs}
              </span>
            ` : ''}
          </div>
        `;
      }
      html += `</div>`;
    }
    return html;
  }

  _bindEvents() {
    this.container.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCategory = btn.dataset.cat;
        const list = this.currentCategory === 'all'
          ? TABS_DB
          : (this.currentCategory === 'keyner'
              ? TABS_DB.filter(t => t.sourceMethod === 'keyner')
              : TABS_DB.filter(t => t.category === this.currentCategory));
        if (list.length && !list.some(t => t.id === this.currentTab.id)) {
          this.selectTab(list[0].id);
        } else {
          this.render();
        }
      });
    });

    this.container.querySelectorAll('[data-tabid]').forEach(btn => {
      btn.addEventListener('click', () => this.selectTab(btn.dataset.tabid));
    });

    const playBtn = this.container.querySelector('#tab-btn-play');
    if (playBtn) playBtn.addEventListener('click', () => this.togglePlay());

    const waitBtn = this.container.querySelector('#tab-btn-wait-mic');
    if (waitBtn) waitBtn.addEventListener('click', () => this.toggleWaitGuitarMode());

    const resetBtn = this.container.querySelector('#tab-btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.stop();
        this.activeStepIdx = this.loopStart !== null ? this.loopStart : 0;
        this.completedSteps.clear();
        this._refreshActiveStepUI();
      });
    }

    const skipBtn = this.container.querySelector('#tab-btn-skip-step');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        if (this.activeStepIdx < this.currentTab.steps.length - 1) {
          this.activeStepIdx++;
          this._refreshActiveStepUI();
        }
      });
    }

    this.container.querySelectorAll('[data-speed]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.speedFactor = parseFloat(btn.dataset.speed);
        this.render();
      });
    });

    const instSelect = this.container.querySelector('#tab-inst-select');
    if (instSelect) {
      instSelect.addEventListener('change', () => {
        audioEngine.setInstrument(instSelect.value);
      });
    }

    const dispSelect = this.container.querySelector('#tab-display-select');
    if (dispSelect) {
      dispSelect.addEventListener('change', () => {
        this.displayMode = dispSelect.value;
        this.render();
      });
    }

    const chkChords = this.container.querySelector('#tab-chk-chords');
    if (chkChords) {
      chkChords.addEventListener('change', () => {
        this.accompanyChords = chkChords.checked;
      });
    }

    // Clic en cualquier columna de la tablatura para escuchar y saltar ahí
    this.container.querySelectorAll('.tab-cell, .tab-lyric-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const idx = parseInt(cell.dataset.step, 10);
        if (Number.isNaN(idx)) return;
        this.activeStepIdx = idx;
        const st = this.currentTab.steps[idx];
        if (st) {
          audioEngine.playStringFret(st.s, st.f, 1.1, 0.5);
        }
        this._refreshActiveStepUI();
      });
    });

    // Clic en insignia de acorde para ver diagrama
    this.container.querySelectorAll('.tab-chord-badge').forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        const ch = badge.dataset.chord;
        audioEngine.strumChord(ch, 'down');
        if (this.onOpenChordModal) this.onOpenChordModal(ch);
      });
    });

    // Botones Loop A-B
    const setABtn = this.container.querySelector('#tab-set-a');
    if (setABtn) {
      setABtn.addEventListener('click', () => {
        this.loopStart = this.activeStepIdx;
        if (this.loopEnd === null || this.loopEnd < this.loopStart) {
          this.loopEnd = Math.min(this.currentTab.steps.length - 1, this.loopStart + 4);
        }
        this.render();
      });
    }

    const setBBtn = this.container.querySelector('#tab-set-b');
    if (setBBtn) {
      setBBtn.addEventListener('click', () => {
        this.loopEnd = this.activeStepIdx;
        if (this.loopStart === null || this.loopStart > this.loopEnd) {
          this.loopStart = Math.max(0, this.loopEnd - 4);
        }
        this.render();
      });
    }

    const clearLoopBtn = this.container.querySelector('#tab-clear-loop');
    if (clearLoopBtn) {
      clearLoopBtn.addEventListener('click', () => {
        this.loopStart = null;
        this.loopEnd = null;
        this.render();
      });
    }
  }

  _updateTransportButtons() {
    const playBtn = this.container?.querySelector('#tab-btn-play');
    if (playBtn) {
      playBtn.textContent = this.isPlaying ? '⏸ Pausar TAB' : '▶ Escuchar TAB';
      playBtn.className = `duo-btn ${this.isPlaying ? 'btn-orange' : 'btn-green'}`;
    }
  }

  _refreshActiveStepUI() {
    if (!this.container) return;
    this.container.querySelectorAll('[data-step]').forEach(el => {
      const idx = parseInt(el.dataset.step, 10);
      el.classList.toggle('active-col', idx === this.activeStepIdx);
      el.classList.toggle('done-col', this.completedSteps.has(idx));
      const pill = el.querySelector('.tab-fret-pill');
      if (pill) pill.classList.toggle('pill-current', idx === this.activeStepIdx);
    });

    const step = this.currentTab.steps[this.activeStepIdx];
    if (step) {
      const midi = getFretMidi(step.s, step.f);
      const info = midiToNoteInfo(midi);
      const neckText = this.container.querySelector('#tab-neck-guide-text');
      if (neckText) {
        neckText.innerHTML = `
          👉 <strong>Paso ${this.activeStepIdx + 1}/${this.currentTab.steps.length}:</strong>
          Cuerda <b>${step.s}ª</b> · Traste <b>${step.f}</b> ·
          <span class="badge-vivid badge-purple" style="padding:2px 8px;font-size:0.78rem;">Cód. Keyner ${step.s}${step.f}</span> ·
          Nota <span class="inline-note-chip" style="background:${info.color.bg};color:${info.color.text}">${info.noteEs} (${info.note})</span> ·
          ${step.finger ? `Usa <b>Dedo ${step.finger}</b>` : '<b>Cuerda al aire (0)</b>'}
        `;
      }
      const miniNeck = this.container.querySelector('#tab-mini-neck-grid');
      if (miniNeck) {
        miniNeck.innerHTML = this._renderMiniNeckHTML(step);
      }
    }

    this._scrollToActiveStep();
  }

  _scrollToActiveStep() {
    const viewport = this.container?.querySelector('#tab-scroll-viewport');
    const activeEl = viewport?.querySelector(`.note-cell[data-step="${this.activeStepIdx}"]`);
    if (viewport && activeEl) {
      const targetLeft = activeEl.offsetLeft - viewport.clientWidth / 2 + 40;
      viewport.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }
  }

  _updateLiveGuitarBadge(pitch) {
    const pill = this.container?.querySelector('#tab-live-heard');
    if (!pill) return;
    pill.textContent = `🎸 Escuchado: ${pitch.noteEs}${pitch.octave} (${pitch.note}${pitch.octave})`;
    pill.style.background = pitch.color.bg;
    pill.style.color = pitch.color.text;
  }

  _showCompletionBanner() {
    const toast = document.createElement('div');
    toast.className = 'duo-celebration-toast';
    toast.innerHTML = `🎉 ¡Increíble! Completaste "${this.currentTab.title}" con tu guitarra (+25 XP)`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
  }
}

