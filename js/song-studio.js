// ============================================================================
// js/song-studio.js
// Estudio Interactivo de Progresiones de Acordes sobre Canciones:
// - Fusiona el Cancionero Digital Católico + Vallenatos, Cumbias y Porros Colombianos
// - Línea de Tiempo Viva de Progresiones con Grados Romanos (I, IV, V7, V7/IV, VIm)
// - Acompañamiento rítmico sincronizado, Transposición (-6..+6), Calculadora de Capo
// - Práctica de cambios de acordes con Micrófono / Entrada de Línea en tiempo real
// ============================================================================

import { loadAllSongs, MASTER_SONGS } from './songs-db.js';
import { RHYTHM_PATTERNS } from './rhythm-trainer.js';
import { renderChordSVG, getChordData } from './chords-db.js';
import { audioEngine } from './audio-engine.js';
import { pitchDetector } from './pitch-detector.js';
import {
  parseSongLines,
  extractSongChords,
  detectKeyFromChords,
  analyzeHarmonicFunction,
  suggestCapoOptions,
  transposeChord,
  getNoteColor,
  formatChordLabel,
  parseChord,
  NOTES
} from './music-theory.js';

export class SongStudio {
  constructor(containerEl, callbacks = {}) {
    this.container = containerEl;
    this.onAwardXP = callbacks.onAwardXP || null;
    this.onOpenTab = callbacks.onOpenTab || null;
    this.onOpenChordModal = callbacks.onOpenChordModal || null;

    this.songs = [...MASTER_SONGS];
    this.selectedSong = MASTER_SONGS[0];
    this.filterGroup = 'featured'; // 'featured' | 'catolica' | 'vallenato' | 'easy' | 'all'
    this.liturgicalSubfilter = 'all';
    this.searchQuery = '';

    this.transpose = 0;
    this.notationMode = 'dual'; // 'dual' | 'american' | 'latin'
    this.bpmOverride = null;
    this.focusedChord = null;
    this.voicingIdx = 0;

    this.isPlayingProg = false;
    this.isMicChordPractice = false;
    this.activeProgIdx = 0;
    this.activeSubStep = 0;
    this.progTimer = null;
    this.autoScrollTimer = null;
    this.isAutoScrolling = false;
    this.lastChordMatchTime = 0;
  }

  async init() {
    this._bindPitchEvents();
    this.songs = await loadAllSongs();
    this.selectSong(this.selectedSong.id);
  }

  _bindPitchEvents() {
    pitchDetector.onPitch('song-studio', (pitch) => {
      if (!this.isMicChordPractice) return;
      const loop = this._getCurrentProgressionLoop();
      const targetChord = loop[this.activeProgIdx];
      if (!targetChord) return;

      const now = performance.now();
      if (now - this.lastChordMatchTime < 750) return;

      // Verificar mediante Chroma FFT polifónico O nota fundamental del bajo del acorde
      const poly = pitchDetector.checkChordMatch(targetChord);
      const { root } = parseChord(targetChord);
      const rootMatch = pitch.note === root && pitch.clarity > 0.80;

      if (poly.matched || rootMatch) {
        this.lastChordMatchTime = now;
        audioEngine.playSuccess();
        if (this.onAwardXP) this.onAwardXP(5, `Acorde ${targetChord} verificado`);

        this.activeProgIdx = (this.activeProgIdx + 1) % loop.length;
        this.focusedChord = loop[this.activeProgIdx];
        this._refreshActiveProgressionUI();
      }
    });
  }

  selectSong(songId) {
    this.stopPlayback();
    const found = this.songs.find(s => s.id === songId) || this.songs[0];
    this.selectedSong = found;
    this.transpose = 0;
    this.bpmOverride = null;
    this.activeProgIdx = 0;
    this.voicingIdx = 0;
    const loop = this._getCurrentProgressionLoop();
    this.focusedChord = loop[0] || 'C';
    this.render();
  }

  _getCurrentProgressionLoop() {
    const s = this.selectedSong;
    if (s.progressionLoop && s.progressionLoop.length > 0) {
      return s.progressionLoop.map(c => transposeChord(c, this.transpose));
    }
    const extracted = extractSongChords(s.content, this.transpose);
    return extracted.slice(0, 8);
  }

  stopPlayback() {
    this.isPlayingProg = false;
    this.isMicChordPractice = false;
    if (this.progTimer) {
      clearTimeout(this.progTimer);
      this.progTimer = null;
    }
    if (this.autoScrollTimer) {
      clearInterval(this.autoScrollTimer);
      this.autoScrollTimer = null;
    }
    this.isAutoScrolling = false;
  }

  togglePlayProgression() {
    if (this.isPlayingProg) {
      this.stopPlayback();
      this.render();
      return;
    }
    this.stopPlayback();
    this.isPlayingProg = true;
    this.activeSubStep = 0;
    audioEngine.init();
    this.render();
    this._tickProgression();
  }

  async toggleMicChordPractice() {
    if (this.isMicChordPractice) {
      this.isMicChordPractice = false;
      this.render();
      return;
    }
    this.stopPlayback();
    if (!pitchDetector.isListening) {
      try {
        await pitchDetector.start();
      } catch (_) {
        alert('Activa el permiso de micrófono o interfaz de guitarra para evaluar tus acordes.');
        return;
      }
    }
    this.isMicChordPractice = true;
    const loop = this._getCurrentProgressionLoop();
    this.focusedChord = loop[this.activeProgIdx] || 'C';
    this.render();
  }

  _tickProgression() {
    if (!this.isPlayingProg) return;
    const song = this.selectedSong;
    const pat = RHYTHM_PATTERNS[song.rhythmId] || RHYTHM_PATTERNS.pop_folk;
    const bpm = this.bpmOverride || song.bpm || pat.bpm || 84;
    const stepDurSec = 60 / bpm / (pat.subdivision || 2);

    const loop = this._getCurrentProgressionLoop();
    const currentChord = loop[this.activeProgIdx % loop.length] || 'C';
    this.focusedChord = currentChord;

    const stepCode = pat.steps[this.activeSubStep % pat.steps.length];
    audioEngine.playPatternStep(stepCode, currentChord, stepDurSec);

    if (pat.percussion) {
      const perc = pat.percussion[this.activeSubStep % pat.percussion.length];
      if (perc) audioEngine.playPercussion(perc);
    }

    this._refreshActiveProgressionUI();

    this.progTimer = setTimeout(() => {
      if (!this.isPlayingProg) return;
      this.activeSubStep++;
      if (this.activeSubStep >= pat.steps.length) {
        this.activeSubStep = 0;
        this.activeProgIdx = (this.activeProgIdx + 1) % loop.length;
        if (this.activeProgIdx === 0 && this.onAwardXP) {
          this.onAwardXP(6, `Ciclo de progresión en "${song.title}"`);
        }
      }
      this._tickProgression();
    }, stepDurSec * 1000);
  }

  _getFilteredSongs() {
    const q = this.searchQuery.trim().toLowerCase();
    return this.songs.filter(s => {
      if (this.filterGroup === 'featured' && !s.featured) return false;
      if (this.filterGroup === 'catolica' && s.category !== 'catolica') return false;
      if (this.filterGroup === 'vallenato' && s.category !== 'vallenato') return false;
      if (this.filterGroup === 'keyner' && s.sourceMethod !== 'keyner') return false;
      if (this.filterGroup === 'easy' && (s.difficulty || 1) > 1) return false;

      if (this.filterGroup === 'catolica' && this.liturgicalSubfilter !== 'all') {
        if ((s.liturgicalType || '').toLowerCase() !== this.liturgicalSubfilter.toLowerCase()) return false;
      }

      if (q) {
        const hay = `${s.title} ${s.author || ''} ${s.liturgicalType || ''} ${s.content || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }

  render() {
    if (!this.container) return;
    const filtered = this._getFilteredSongs();
    const song = this.selectedSong;
    const pat = RHYTHM_PATTERNS[song.rhythmId] || RHYTHM_PATTERNS.pop_folk;
    const bpm = this.bpmOverride || song.bpm || pat.bpm || 84;

    const allChords = extractSongChords(song.content, this.transpose);
    const uniqueChords = Array.from(new Set(allChords));
    const currentKey = detectKeyFromChords(allChords, song.key ? transposeChord(song.key, this.transpose) : '');
    const progLoop = this._getCurrentProgressionLoop();
    const activeChord = this.focusedChord || progLoop[0] || uniqueChords[0] || 'C';
    const activeChordData = getChordData(activeChord);
    const capoSuggestions = suggestCapoOptions(uniqueChords);
    const parsedLines = parseSongLines(song.content, this.transpose);

    // Subcategorías litúrgicas disponibles en el Cancionero Digital
    const liturgicalTypes = Array.from(new Set(
      this.songs.filter(s => s.category === 'catolica').map(s => s.liturgicalType).filter(Boolean)
    )).sort();

    const ytQuery = song.youtubeQuery || `${song.title} ${song.category === 'vallenato' ? 'vallenato' : 'catolica'} guitarra acordes tutorial`;

    this.container.innerHTML = `
      <div class="song-studio-grid">
        <!-- Columna Izquierda: Buscador y Biblioteca del Cancionero -->
        <aside class="duo-card song-sidebar-card">
          <div class="sidebar-search-box">
            <input
              type="search"
              id="ss-search-input"
              class="duo-input"
              placeholder="🔍 Buscar canto, vallenato o letra..."
              value="${this.searchQuery.replace(/"/g, '&quot;')}"
            />
          </div>

          <div class="ss-filter-pills">
            <button class="mini-pill ${this.filterGroup === 'featured' ? 'active' : ''}" data-sgrp="featured">⭐ Guiadas (${MASTER_SONGS.length})</button>
            <button class="mini-pill ${this.filterGroup === 'catolica' ? 'active' : ''}" data-sgrp="catolica">🕊️ Católicas</button>
            <button class="mini-pill ${this.filterGroup === 'vallenato' ? 'active' : ''}" data-sgrp="vallenato">🪗 Vallenato/Folclor</button>
            <button class="mini-pill ${this.filterGroup === 'keyner' ? 'active' : ''}" data-sgrp="keyner">📕 Libro Keyner</button>
            <button class="mini-pill ${this.filterGroup === 'easy' ? 'active' : ''}" data-sgrp="easy">🌱 Sin Cejilla</button>
            <button class="mini-pill ${this.filterGroup === 'all' ? 'active' : ''}" data-sgrp="all">📚 Todas (${this.songs.length})</button>
          </div>

          ${this.filterGroup === 'catolica' ? `
            <select id="ss-liturgical-select" class="duo-select" style="width:100%;margin-bottom:10px;">
              <option value="all">🕊️ Todos los momentos de Misa/Oración</option>
              ${liturgicalTypes.map(lt => `<option value="${lt}" ${this.liturgicalSubfilter === lt ? 'selected' : ''}>${lt}</option>`).join('')}
            </select>
          ` : ''}

          <div class="ss-song-list">
            ${filtered.length === 0 ? `<p class="empty-msg">No se encontraron canciones con ese filtro.</p>` : ''}
            ${filtered.map(s => `
              <button class="ss-song-item ${s.id === song.id ? 'selected' : ''}" data-sid="${s.id}">
                <span class="ss-item-emoji">${s.category === 'vallenato' ? '🪗' : '🕊️'}</span>
                <div class="ss-item-info">
                  <strong>${s.title}</strong>
                  <small>${s.liturgicalType || 'Canto'} · Tono ${s.key || 'C'} ${s.linkedTabId ? '· 🎯 Con TAB' : ''}</small>
                </div>
              </button>
            `).join('')}
          </div>
        </aside>

        <!-- Columna Central y Derecha: Progresión Viva + Letra con Acordes -->
        <div class="song-main-column">
          <!-- Cabecera de la Canción y Herramientas -->
          <div class="duo-card song-hero-card">
            <div class="song-hero-top">
              <div>
                <div class="tab-badges-line">
                  <span class="badge-vivid ${song.category === 'vallenato' ? 'badge-orange' : 'badge-blue'}">
                    ${song.category === 'vallenato' ? '🪗 Folclor / Vallenato' : `🕊️ ${song.liturgicalType || 'Alabanza Católica'}`}
                  </span>
                  <span class="badge-vivid badge-green">Tonalidad: ${formatChordLabel(currentKey, this.notationMode)}</span>
                  <span class="badge-vivid badge-purple">Ritmo: ${pat.name} (${bpm} BPM)</span>
                </div>
                <h2 class="song-main-title">${song.title}</h2>
                <p class="tab-subtitle">${song.author || 'Cancionero Digital'}</p>
              </div>

              <div class="song-hero-actions">
                ${song.linkedTabId ? `
                  <button id="ss-open-linked-tab" class="duo-btn btn-purple btn-sm">
                    🎯 Abrir Punteo / TAB Interactiva
                  </button>
                ` : ''}
                <a class="duo-btn btn-red btn-sm" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ytQuery)}" target="_blank" rel="noopener">
                  ▶ Ver en YouTube
                </a>
              </div>
            </div>

            <!-- Barra de Transposición, Notación y Tempo -->
            <div class="song-toolbar">
              <div class="toolbar-cluster">
                <span class="tb-lbl">Transportar Tono:</span>
                <button id="ss-tr-down" class="duo-btn btn-outline btn-xs">−1 Semitono</button>
                <span class="tr-badge">${this.transpose > 0 ? `+${this.transpose}` : this.transpose}</span>
                <button id="ss-tr-up" class="duo-btn btn-outline btn-xs">+1 Semitono</button>
                ${this.transpose !== 0 ? `<button id="ss-tr-reset" class="link-reset-btn">Original</button>` : ''}
              </div>

              <div class="toolbar-cluster">
                <span class="tb-lbl">Notación:</span>
                <select id="ss-notation-sel" class="duo-select">
                  <option value="dual" ${this.notationMode === 'dual' ? 'selected' : ''}>C (Do) — Doble</option>
                  <option value="american" ${this.notationMode === 'american' ? 'selected' : ''}>C, Am, G7 — Americano</option>
                  <option value="latin" ${this.notationMode === 'latin' ? 'selected' : ''}>Do, Lam, Sol7 — Español</option>
                  <option value="keyner" ${this.notationMode === 'keyner' ? 'selected' : ''}>🔢 DO+, LA-, 5ª LA (Keyner)</option>
                </select>
              </div>

              <div class="toolbar-cluster">
                <span class="tb-lbl">Tempo: ${bpm} BPM</span>
                <input type="range" id="ss-bpm-range" min="50" max="135" value="${bpm}" class="duo-range" style="width:95px;" />
              </div>
            </div>

            <!-- ========================================================== -->
            <!-- INTERFAZ ESTRELLA: LÍNEA DE PROGRESIÓN ARMÓNICA EN VIVO    -->
            <!-- ========================================================== -->
            <div class="progression-stage-box">
              <div class="prog-stage-head">
                <div>
                  <h3>🎶 Progresión de Acordes Interactiva</h3>
                  <small>Cada color representa la nota raíz y su función armónica dentro de <b>${currentKey}</b></small>
                </div>
                <div class="prog-cta-btns">
                  <button id="ss-btn-play-prog" class="duo-btn ${this.isPlayingProg ? 'btn-orange' : 'btn-green'} btn-sm">
                    ${this.isPlayingProg ? '⏹ Detener Acompañamiento' : '▶ Tocar Progresión con Ritmo'}
                  </button>
                  <button id="ss-btn-mic-prog" class="duo-btn ${this.isMicChordPractice ? 'btn-purple pulse-border' : 'btn-blue'} btn-sm">
                    ${this.isMicChordPractice ? '🎙️ Escuchando tus Acordes...' : '🎸 Practicar Cambios con Mic/Línea'}
                  </button>
                </div>
              </div>

              <div class="prog-cards-timeline">
                ${progLoop.map((ch, idx) => {
                  const col = getNoteColor(ch);
                  const fn = analyzeHarmonicFunction(ch, currentKey);
                  const isCurrent = idx === (this.activeProgIdx % progLoop.length);
                  return `
                    <button
                      class="prog-3d-card ${isCurrent ? 'prog-card-active' : ''}"
                      data-progidx="${idx}"
                      data-chord="${ch}"
                      style="--p-bg:${col.bg}; --p-border:${col.border}; --p-txt:${col.text};"
                    >
                      <span class="prog-roman-pill" style="background:${fn.badgeColor}">${fn.roman}</span>
                      <strong class="prog-chord-main">${this.notationMode === 'keyner' ? formatChordLabel(ch, 'keyner') : ch}</strong>
                      <span class="prog-chord-es">${this.notationMode === 'keyner' ? ch : formatChordLabel(ch, 'latin')}</span>
                      <small class="prog-role-txt">${fn.role.split('(')[0].trim()}</small>
                    </button>
                  `;
                }).join('')}
              </div>

              ${song.theoryNote ? `
                <div class="harmonic-insight-banner">
                  <span>🧠 <strong>Análisis Teórico-Práctico:</strong> ${song.theoryNote}</span>
                </div>
              ` : ''}

              ${song.keynerIntro ? `
                <div class="harmonic-insight-banner" style="background:#EEF2FF;border-color:#C7D2FE;color:#3730A3;">
                  <span>📕 <strong>Intro Numérica Libro Keyner:</strong> <code>${song.keynerIntro}</code></span>
                </div>
              ` : ''}

              ${capoSuggestions.length > 0 && capoSuggestions[0].capo > 0 ? `
                <div class="capo-smart-banner">
                  💡 <strong>Atajo con Capotraste:</strong> Si colocas el Capo en el <b>Traste ${capoSuggestions[0].capo}</b>, puedes tocarla con figuras abiertas fáciles:
                  <code>${capoSuggestions[0].shapes.join(' · ')}</code>.
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Área Inferior en 2 Columnas: Letra con Acordes Vivos + Inspector de Acorde y Rasgueo -->
          <div class="song-body-split">
            <!-- Letra Interactiva -->
            <div class="duo-card song-lyrics-card" id="ss-lyrics-box">
              <div class="lyrics-top-bar">
                <h3>📜 Letra y Posición Exacta de Cambios</h3>
                <button id="ss-btn-autoscroll" class="duo-btn btn-outline btn-xs">
                  ${this.isAutoScrolling ? '⏸ Parar Auto-Scroll' : '📜 Auto-Scroll Suave'}
                </button>
              </div>

              <div class="lyrics-sheet">
                ${parsedLines.map(line => {
                  if (line.type === 'empty') return `<div class="lyric-spacer"></div>`;
                  if (line.type === 'header') return `<div class="lyric-section-tag">${line.text}</div>`;
                  return `
                    <div class="lyric-line-row ${line.type === 'chords_only' ? 'chords-only-row' : ''}">
                      ${line.segments.map(seg => {
                        const ch = seg.chord;
                        const col = ch ? getNoteColor(ch) : null;
                        const isHighlighted = ch && ch === activeChord;
                        return `
                          <span class="lyric-seg">
                            ${ch ? `
                              <button
                                class="inline-chord-btn ${isHighlighted ? 'chord-lit' : ''}"
                                data-inlinechord="${ch}"
                                style="--c-bg:${col.bg}; --c-border:${col.border}; --c-txt:${col.text};"
                              >${formatChordLabel(ch, this.notationMode === 'dual' ? 'american' : this.notationMode)}</button>
                            ` : `<span class="chord-empty-slot"></span>`}
                            <span class="lyric-text-span">${seg.lyric || '&nbsp;'}</span>
                          </span>
                        `;
                      }).join('')}
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Panel Derecho Fijo: Diagrama del Acorde Activo + Todos los Acordes del Canto -->
            <div class="song-inspector-col">
              <div class="duo-card inspector-chord-card">
                <div class="insp-head">
                  <h4>🖐️ Posición en Guitarra</h4>
                  ${activeChordData.voicings.length > 1 ? `
                    <button id="ss-next-voicing" class="mini-pill">
                      Posición ${(this.voicingIdx % activeChordData.voicings.length) + 1}/${activeChordData.voicings.length} (CAGED) ↻
                    </button>
                  ` : ''}
                </div>
                <div id="ss-active-chord-svg" class="insp-svg-holder">
                  ${renderChordSVG(activeChord, { voicingIndex: this.voicingIdx, width: 185, height: 225, showBasses: true })}
                </div>
                <p class="insp-voicing-lbl">
                  <strong>${activeChordData.nameEs}</strong> — ${activeChordData.voicings[this.voicingIdx % activeChordData.voicings.length].label}
                </p>
                <p class="insp-tip-txt">${activeChordData.tip}</p>
                <div class="insp-play-btns">
                  <button id="ss-strum-down" class="duo-btn btn-green btn-xs">🔊 Rasguear</button>
                  <button id="ss-strum-arp" class="duo-btn btn-blue btn-xs">🎶 Arpegiar</button>
                </div>
              </div>

              <div class="duo-card song-all-chords-card">
                <h4>🎨 Todos los Acordes de esta Canción (${uniqueChords.length})</h4>
                <div class="unique-chords-palette">
                  ${uniqueChords.map(ch => {
                    const col = getNoteColor(ch);
                    return `
                      <button
                        class="palette-chord-btn ${ch === activeChord ? 'active' : ''}"
                        data-palchord="${ch}"
                        style="--c-bg:${col.bg}; --c-border:${col.border}; --c-txt:${col.text};"
                      >
                        ${formatChordLabel(ch, 'dual')}
                      </button>
                    `;
                  }).join('')}
                </div>

                <h4 style="margin-top:14px;">🥁 Patrón de Mano Derecha Sugerido</h4>
                <div class="mini-strum-preview">
                  ${pat.steps.map(st => `<span class="mini-st-box">${st === 'D' ? '↓' : (st === 'U' ? '↑' : (st === 'X' ? '✕' : st))}</span>`).join('')}
                </div>
                <small class="muted-hint">${pat.usage}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    const searchInput = this.container.querySelector('#ss-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        this.searchQuery = searchInput.value;
        const pos = searchInput.selectionStart;
        this.render();
        const again = this.container.querySelector('#ss-search-input');
        if (again) {
          again.focus();
          again.setSelectionRange(pos, pos);
        }
      });
    }

    this.container.querySelectorAll('[data-sgrp]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterGroup = btn.dataset.sgrp;
        this.render();
      });
    });

    const litSel = this.container.querySelector('#ss-liturgical-select');
    if (litSel) {
      litSel.addEventListener('change', () => {
        this.liturgicalSubfilter = litSel.value;
        this.render();
      });
    }

    this.container.querySelectorAll('[data-sid]').forEach(btn => {
      btn.addEventListener('click', () => this.selectSong(btn.dataset.sid));
    });

    const openTabBtn = this.container.querySelector('#ss-open-linked-tab');
    if (openTabBtn && this.onOpenTab) {
      openTabBtn.addEventListener('click', () => this.onOpenTab(this.selectedSong.linkedTabId));
    }

    const trDown = this.container.querySelector('#ss-tr-down');
    if (trDown) trDown.addEventListener('click', () => { this.transpose = Math.max(-6, this.transpose - 1); this.focusedChord = null; this.render(); });

    const trUp = this.container.querySelector('#ss-tr-up');
    if (trUp) trUp.addEventListener('click', () => { this.transpose = Math.min(6, this.transpose + 1); this.focusedChord = null; this.render(); });

    const trReset = this.container.querySelector('#ss-tr-reset');
    if (trReset) trReset.addEventListener('click', () => { this.transpose = 0; this.focusedChord = null; this.render(); });

    const notSel = this.container.querySelector('#ss-notation-sel');
    if (notSel) {
      notSel.addEventListener('change', () => {
        this.notationMode = notSel.value;
        this.render();
      });
    }

    const bpmRange = this.container.querySelector('#ss-bpm-range');
    if (bpmRange) {
      bpmRange.addEventListener('change', () => {
        this.bpmOverride = parseInt(bpmRange.value, 10);
        this.render();
      });
    }

    const playProgBtn = this.container.querySelector('#ss-btn-play-prog');
    if (playProgBtn) playProgBtn.addEventListener('click', () => this.togglePlayProgression());

    const micProgBtn = this.container.querySelector('#ss-btn-mic-prog');
    if (micProgBtn) micProgBtn.addEventListener('click', () => this.toggleMicChordPractice());

    this.container.querySelectorAll('[data-progidx]').forEach(card => {
      card.addEventListener('click', () => {
        this.activeProgIdx = parseInt(card.dataset.progidx, 10);
        this.focusedChord = card.dataset.chord;
        this.voicingIdx = 0;
        audioEngine.strumChord(this.focusedChord, 'down');
        this._refreshActiveProgressionUI();
      });
    });

    this.container.querySelectorAll('[data-inlinechord], [data-palchord]').forEach(btn => {
      btn.addEventListener('click', () => {
        const ch = btn.dataset.inlinechord || btn.dataset.palchord;
        this.focusedChord = ch;
        this.voicingIdx = 0;
        audioEngine.strumChord(ch, 'down');
        this.render();
      });
    });

    const nextVoicingBtn = this.container.querySelector('#ss-next-voicing');
    if (nextVoicingBtn) {
      nextVoicingBtn.addEventListener('click', () => {
        this.voicingIdx++;
        const ch = this.focusedChord || 'C';
        audioEngine.strumChord(ch, 'down', this.voicingIdx % getChordData(ch).voicings.length);
        this.render();
      });
    }

    const strumDown = this.container.querySelector('#ss-strum-down');
    if (strumDown) strumDown.addEventListener('click', () => audioEngine.strumChord(this.focusedChord || 'C', 'down', this.voicingIdx));

    const strumArp = this.container.querySelector('#ss-strum-arp');
    if (strumArp) strumArp.addEventListener('click', () => audioEngine.strumChord(this.focusedChord || 'C', 'arpeggio', this.voicingIdx));

    const autoBtn = this.container.querySelector('#ss-btn-autoscroll');
    if (autoBtn) {
      autoBtn.addEventListener('click', () => {
        if (this.isAutoScrolling) {
          clearInterval(this.autoScrollTimer);
          this.isAutoScrolling = false;
          autoBtn.textContent = '📜 Auto-Scroll Suave';
        } else {
          this.isAutoScrolling = true;
          autoBtn.textContent = '⏸ Parar Auto-Scroll';
          const box = this.container.querySelector('.lyrics-sheet');
          this.autoScrollTimer = setInterval(() => {
            if (box) box.scrollTop += 1;
            else window.scrollBy(0, 1);
          }, 80);
        }
      });
    }
  }

  _refreshActiveProgressionUI() {
    if (!this.container) return;
    const loop = this._getCurrentProgressionLoop();
    const activeIdx = this.activeProgIdx % Math.max(1, loop.length);
    const ch = loop[activeIdx] || this.focusedChord || 'C';

    this.container.querySelectorAll('.prog-3d-card').forEach(c => {
      c.classList.toggle('prog-card-active', parseInt(c.dataset.progidx, 10) === activeIdx);
    });

    this.container.querySelectorAll('[data-inlinechord]').forEach(b => {
      b.classList.toggle('chord-lit', b.dataset.inlinechord === ch);
    });

    const svgHolder = this.container.querySelector('#ss-active-chord-svg');
    if (svgHolder) {
      svgHolder.innerHTML = renderChordSVG(ch, { voicingIndex: 0, width: 185, height: 225, showBasses: true });
    }
  }
}

