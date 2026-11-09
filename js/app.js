// ============================================================================
// js/app.js
// Controlador Maestro de CuerdaViva! (Estilo Gamificado Duolingo):
// - Registro Multi-Usuario y Bitácora Persistente de Aciertos / No Aciertos
// - Ciclo Obligatorio de Remediación Teórica (Fase 2) ante respuestas erradas
// - Ruta de Habilidades (9 Unidades · 36 Lecciones · Método Keyner Ramírez)
// - Orquestación de TabPlayer, SongStudio, RhythmTrainer, FretboardStudio & Guitar3DStudio
// - Reto Interactivo de 30 Días + Entrada de Audio (Mic / Línea USB Canal 1/2)
// ============================================================================

import {
  NOTES_ES,
  NOTE_COLORS,
  STRING_LABELS_6_TO_1,
  getFretMidi,
  midiToNoteInfo,
  parseChord,
  formatChordLabel,
  toKeynerFretCode
} from './music-theory.js';
import { getChordData, renderChordSVG } from './chords-db.js';
import { audioEngine } from './audio-engine.js';
import { pitchDetector } from './pitch-detector.js';
import { TabPlayer } from './tab-player.js';
import { SongStudio } from './song-studio.js';
import { RhythmTrainer } from './rhythm-trainer.js';
import { FretboardStudio } from './fretboard.js';
import { Guitar3DStudio } from './guitar-3d.js';
import { SKILL_UNITS, RETO_30_DIAS, THEORY_LIBRARY } from './curriculum-db.js';
import { userStore, createDefaultUserState } from './user-store.js';

const LEVEL_TITLES = [
  { minXp: 0,    level: 1, title: 'Semilla Musical 🌱' },
  { minXp: 150,  level: 2, title: 'Cuerda Alegre 🎵' },
  { minXp: 350,  level: 3, title: 'Cantor del Altar 🕯️' },
  { minXp: 650,  level: 4, title: 'Guitarrista Vallenato 🪗' },
  { minXp: 1050, level: 5, title: 'Juglar del Caribe 🌴' },
  { minXp: 1550, level: 6, title: 'Maestro CAGED & Keyner 🏆' }
];

function escapeHTML(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatRichText(raw) {
  return escapeHTML(raw || '')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="duo-code">$1</code>')
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => `<p>${line}</p>`)
    .join('');
}

function formatDateTimeShort(isoStr) {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    return d.toLocaleString('es-CO', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (_) {
    return String(isoStr).slice(0, 16);
  }
}

class CuerdaVivaApp {
  constructor() {
    this.state = createDefaultUserState();
    this.activeView = 'learn';
    this.challengeWeekFilter = 'all'; // 'all' | 1 | 2 | 3 | 4

    // Estado del ejecutor de lecciones y remediación teórica
    this.lessonSession = null;

    // Filtros e historial del modal de perfil/bitácora
    this.userLogFilter = 'all'; // 'all' | 'acierto' | 'no_acierto' | 'remediation'
    this.confirmClearPending = false;

    // Acorde abierto en modal de detalle
    this.modalChordName = null;

    // Instancias de estudios interactivos
    this.tabPlayer = null;
    this.songStudio = null;
    this.rhythmTrainer = null;
    this.fretboardStudio = null;
    this.guitar3dStudio = null;
  }

  _syncStateFromStore() {
    const active = userStore.getActiveUser();
    const s = active?.state || createDefaultUserState();
    this.state = {
      ...createDefaultUserState(),
      ...s,
      completedLessons: Array.isArray(s.completedLessons) ? [...s.completedLessons] : [],
      completedDays: Array.isArray(s.completedDays) ? [...s.completedDays] : []
    };
  }

  _saveState() {
    userStore.saveState(this.state);
  }

  _getLevelInfo() {
    let current = LEVEL_TITLES[0];
    let next = LEVEL_TITLES[1] || null;
    for (let i = 0; i < LEVEL_TITLES.length; i++) {
      if (this.state.xp >= LEVEL_TITLES[i].minXp) {
        current = LEVEL_TITLES[i];
        next = LEVEL_TITLES[i + 1] || null;
      }
    }
    return { current, next };
  }

  async init() {
    await userStore.init();
    this._syncStateFromStore();
    audioEngine.setInstrument(this.state.instrument || 'nylon');

    // Instanciar los 5 estudios interactivos
    this.tabPlayer = new TabPlayer(
      document.getElementById('view-tabs'),
      (pts, reason) => this.awardXP(pts, reason),
      (ch) => this.openChordDetailModal(ch)
    );
    this.tabPlayer.init();

    this.songStudio = new SongStudio(
      document.getElementById('view-songs'),
      {
        onAwardXP: (pts, reason) => this.awardXP(pts, reason),
        onOpenTab: (tabId) => {
          this.switchView('tabs');
          if (tabId) this.tabPlayer.selectTab(tabId);
        },
        onOpenChordModal: (ch) => this.openChordDetailModal(ch)
      }
    );
    await this.songStudio.init();

    this.rhythmTrainer = new RhythmTrainer(
      document.getElementById('view-rhythms'),
      (pts, reason) => this.awardXP(pts, reason)
    );
    this.rhythmTrainer.init();

    this.fretboardStudio = new FretboardStudio(
      document.getElementById('view-fretboard'),
      {
        onAwardXP: (pts, reason) => this.awardXP(pts, reason),
        onAttempt: (entry) => userStore.recordAttempt(entry),
        onOpenChordModal: (ch) => this.openChordDetailModal(ch),
        onRequestMicSetup: () => this.openAudioTunerModal()
      }
    );
    this.fretboardStudio.init();

    this.guitar3dStudio = new Guitar3DStudio(
      document.getElementById('view-guitar3d'),
      {
        onAwardXP: (pts, reason) => this.awardXP(pts, reason),
        onOpenChordModal: (ch) => this.openChordDetailModal(ch)
      }
    );
    this.guitar3dStudio.init();
    this.guitar3dStudio.stop(); // Pausar animación 3D hasta abrir la pestaña

    userStore.onChange(() => {
      this._refreshUserTopbarPill();
      if (this._isUserModalOpen()) {
        this.renderUserModal();
      }
    });

    this._bindTopbarEvents();
    this._bindGlobalAudioEvents();
    this._bindAudioModalEvents();
    this._renderTunerRefButtons();

    this.updateTopbarStats();
    this._refreshUserTopbarPill();
    this.renderLearnView();
    this.renderChallengeView();
  }

  // ==================== GAMIFICACIÓN Y TOASTS ====================
  awardXP(points, reason = '') {
    if (!points || points <= 0) return;
    const prevLvl = this._getLevelInfo().current.level;
    this.state.xp += points;
    this.state.dailyXp += points;
    this._saveState();
    this.updateTopbarStats();

    const newLvl = this._getLevelInfo().current;
    this._showXPToast(`+${points} XP ⚡`, reason);

    if (newLvl.level > prevLvl) {
      audioEngine.playLessonFanfare();
      this._showXPToast(`🎉 ¡Subiste a Nivel ${newLvl.level}!`, newLvl.title, true);
    }

    if (this.activeView === 'learn') {
      this._refreshLearnSidebarCounters();
    }
  }

  _showXPToast(headline, subtext = '', isLevelUp = false) {
    const stack = document.getElementById('xp-toast-container');
    if (!stack) return;
    const el = document.createElement('div');
    el.className = `xp-toast-pill ${isLevelUp ? 'toast-lvlup' : ''}`;
    el.innerHTML = `<strong>${escapeHTML(headline)}</strong>${subtext ? `<span>${escapeHTML(subtext)}</span>` : ''}`;
    stack.appendChild(el);
    setTimeout(() => {
      el.classList.add('fade-out');
      setTimeout(() => el.remove(), 350);
    }, 2600);
  }

  updateTopbarStats() {
    const { current } = this._getLevelInfo();
    const sStreak = document.getElementById('stat-streak');
    const sHearts = document.getElementById('stat-hearts');
    const sXp = document.getElementById('stat-xp');
    const sLvl = document.getElementById('stat-level');

    if (sStreak) sStreak.textContent = String(this.state.streak);
    if (sHearts) sHearts.textContent = String(this.state.hearts);
    if (sXp) sXp.textContent = String(this.state.xp);
    if (sLvl) sLvl.textContent = `Nvl ${current.level}`;
  }

  _refreshUserTopbarPill() {
    const active = userStore.getActiveUser();
    const avatarEl = document.getElementById('nav-user-avatar');
    const nameEl = document.getElementById('nav-user-name');
    const alertsEl = document.getElementById('nav-user-alerts');

    if (avatarEl && active) avatarEl.textContent = active.avatar || '🎸';
    if (nameEl && active) nameEl.textContent = active.name || 'Estudiante';

    if (alertsEl) {
      const pending = userStore.getWeakTheories().filter(w => w.needsReview).length;
      if (pending > 0) {
        alertsEl.textContent = String(pending);
        alertsEl.classList.remove('hidden');
      } else {
        alertsEl.textContent = '0';
        alertsEl.classList.add('hidden');
      }
    }
  }

  // ==================== NAVEGACIÓN ENTRE VISTAS ====================
  _bindTopbarEvents() {
    document.getElementById('btn-home-logo')?.addEventListener('click', () => {
      this.switchView('learn');
    });

    document.querySelectorAll('#main-nav [data-nav]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchView(btn.dataset.nav);
      });
    });

    document.getElementById('btn-open-user-modal')?.addEventListener('click', () => {
      this.openUserModal();
    });

    document.getElementById('btn-open-audio-modal')?.addEventListener('click', () => {
      this.openAudioTunerModal();
    });

    document.getElementById('btn-refill-hearts')?.addEventListener('click', () => {
      if (this.state.hearts < 5) {
        this.state.hearts = 5;
        this._saveState();
        this.updateTopbarStats();
        audioEngine.playSuccess();
        this._showXPToast('❤️❤️❤️❤️❤️ ¡Vidas recargadas!', 'Sigue practicando sin límites');
      } else {
        this._showXPToast('❤️ Tienes 5/5 vidas completas', '¡Listo para cualquier lección!');
      }
    });

    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById(btn.dataset.closeModal)?.classList.add('hidden');
      });
    });

    document.querySelectorAll('.duo-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop && backdrop.id !== 'modal-lesson') {
          backdrop.classList.add('hidden');
        }
      });
    });
  }

  switchView(viewId) {
    if (viewId !== 'tabs' && this.tabPlayer) this.tabPlayer.stop();
    if (viewId !== 'songs' && this.songStudio) this.songStudio.stopPlayback();
    if (viewId !== 'rhythms' && this.rhythmTrainer) this.rhythmTrainer.stop();
    if (viewId !== 'guitar3d' && this.guitar3dStudio) this.guitar3dStudio.stop();

    this.activeView = viewId;
    document.querySelectorAll('#main-nav [data-nav]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.nav === viewId);
    });
    document.querySelectorAll('.app-view').forEach(sec => {
      sec.classList.toggle('active', sec.id === `view-${viewId}`);
    });

    if (viewId === 'learn') this.renderLearnView();
    if (viewId === 'guitar3d' && this.guitar3dStudio) this.guitar3dStudio.render();
    if (viewId === 'challenge') this.renderChallengeView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  _navigateFromActionTarget(tab, itemId) {
    document.getElementById('modal-lesson')?.classList.add('hidden');
    pitchDetector.offPitch('lesson-runner');
    this.lessonSession = null;
    this.switchView(tab);
    if (tab === 'tabs' && this.tabPlayer && itemId) this.tabPlayer.selectTab(itemId);
    if (tab === 'songs' && this.songStudio && itemId) this.songStudio.selectSong(itemId);
    if (tab === 'rhythms' && this.rhythmTrainer && itemId) this.rhythmTrainer.selectPattern(itemId);
    if (tab === 'fretboard' && this.fretboardStudio && itemId) this.fretboardStudio.setMode(itemId);
    if (tab === 'guitar3d' && this.guitar3dStudio && itemId) this.guitar3dStudio.setMode(itemId);
  }

  // ==================== VISTA 1: RUTA GAMIFICADA DUOLINGO ====================
  _refreshLearnSidebarCounters() {
    const pct = Math.min(100, Math.round((this.state.dailyXp / this.state.dailyGoal) * 100));
    const fill = document.getElementById('daily-goal-fill');
    const txt = document.getElementById('daily-goal-txt');
    if (fill) fill.style.width = `${pct}%`;
    if (txt) txt.textContent = `${this.state.dailyXp} / ${this.state.dailyGoal} XP hoy`;
  }

  renderLearnView() {
    const container = document.getElementById('view-learn');
    if (!container) return;

    const doneSet = new Set(this.state.completedLessons);
    const totalLessons = SKILL_UNITS.reduce((acc, u) => acc + u.lessons.length, 0);
    const doneCount = doneSet.size;
    const { current, next } = this._getLevelInfo();
    const dailyPct = Math.min(100, Math.round((this.state.dailyXp / this.state.dailyGoal) * 100));

    const activeUser = userStore.getActiveUser();
    const userStats = userStore.getStats();
    const pendingWeak = userStore.getWeakTheories().filter(w => w.needsReview);

    let nextSuggestedId = null;
    for (const u of SKILL_UNITS) {
      for (const l of u.lessons) {
        if (!doneSet.has(l.id)) {
          nextSuggestedId = l.id;
          break;
        }
      }
      if (nextSuggestedId) break;
    }

    const curveOffsets = ['offset-center', 'offset-left', 'offset-right'];

    container.innerHTML = `
      <div class="learn-dashboard-grid">
        <!-- COLUMNA PRINCIPAL: ÁRBOL DE HABILIDADES ESTILO DUOLINGO -->
        <div class="skill-tree-column">
          <div class="duo-card welcome-hero-banner">
            <div class="welcome-hero-left">
              <span class="badge-vivid badge-green">✨ 9 Unidades · 36 Lecciones · Repaso Teórico Obligatorio · Método Keyner 10-60</span>
              <h1>¡Hola ${escapeHTML(activeUser?.name || 'Guitarrista')}! Tu Ruta de Guitarra Viva</h1>
              <p>Acompaña <strong>Alabanzas Católicas</strong>, <strong>Vallenatos</strong>, <strong>Pasillos</strong>, <strong>Cumbias y Porros</strong> con micrófono o línea directa, modelos <strong>3D</strong> y registro completo de tu avance.</p>
              <div class="hero-quick-ctas">
                <button class="duo-btn btn-green" id="hero-btn-continue">
                  ▶ Continuar Lección (${doneCount}/${totalLessons})
                </button>
                <button class="duo-btn btn-purple" id="hero-btn-3d">
                  📐 Anatomía 3D &amp; Keyner
                </button>
                <button class="duo-btn btn-blue" id="hero-btn-connect">
                  🎙️ Afinar Guitarra
                </button>
              </div>
            </div>
            <div class="welcome-hero-badge">
              <div class="big-rank-medallion">
                <span class="med-num">Nvl ${current.level}</span>
                <strong>${current.title}</strong>
                <small>${next ? `Próximo nivel a ${next.minXp} XP` : '¡Nivel Máximo Alcanzado!'}</small>
              </div>
            </div>
          </div>

          ${pendingWeak.length > 0 ? `
            <div class="duo-card weak-alert-banner">
              <div>
                <strong>🔄 Tienes ${pendingWeak.length} tema(s) teórico(s) marcado(s) para repasar</strong>
                <p>Refuerza tus puntos débiles con el material visual del método y valida preguntas clave en menos de 2 minutos.</p>
              </div>
              <button class="duo-btn btn-orange btn-sm" id="btn-hero-remediate-first">
                📖 Repasar "${escapeHTML(pendingWeak[0].theoryTitle)}"
              </button>
            </div>
          ` : ''}

          <!-- UNIDADES DEL ÁRBOL DUOLINGO -->
          <div class="units-path-stack">
            ${SKILL_UNITS.map((unit) => {
              const unitDone = unit.lessons.filter(l => doneSet.has(l.id)).length;
              return `
                <div class="duo-unit-block">
                  <div class="unit-vivid-banner" style="background:${unit.color};border-bottom-color:${unit.borderColor}">
                    <div class="unit-banner-texts">
                      <span class="unit-kicker">UNIDAD ${unit.number} · ${unit.sourceBook}</span>
                      <h2>${unit.icon} ${unit.title}</h2>
                      <p>${unit.subtitle}</p>
                    </div>
                    <div class="unit-progress-pill">
                      <strong>${unitDone}/${unit.lessons.length}</strong>
                      <span>Completadas</span>
                    </div>
                  </div>

                  <div class="unit-nodes-winding">
                    ${unit.lessons.map((lesson, idx) => {
                      const isDone = doneSet.has(lesson.id);
                      const isNext = lesson.id === nextSuggestedId;
                      const offsetCls = curveOffsets[idx % curveOffsets.length];
                      const btnBg = isDone ? '#FFC800' : unit.color;
                      const btnBorder = isDone ? '#D9A600' : unit.borderColor;

                      return `
                        <div class="skill-node-row ${offsetCls}">
                          ${isNext ? `<div class="start-floating-bubble">¡EMPEZAR AQUÍ! 👇</div>` : ''}
                          <button
                            class="skill-circle-3d ${isDone ? 'node-completed' : ''} ${isNext ? 'node-pulse' : ''}"
                            style="background:${btnBg};border-bottom-color:${btnBorder}"
                            data-unit="${unit.id}"
                            data-lesson="${lesson.id}"
                          >
                            <span class="node-big-icon">${isDone ? '⭐' : lesson.icon}</span>
                          </button>
                          <div class="skill-node-caption">
                            <strong>${lesson.title}</strong>
                            <span>${lesson.summary}</span>
                            <em class="node-xp-chip">${isDone ? '✓ Completada · Repasar' : `+${lesson.xp} XP · ${lesson.steps.filter(s => s.type !== 'theory').length} retos`}</em>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- BARRA LATERAL DERECHA: BITÁCORA KPI, META DIARIA, TIMBRE Y ATAJOS -->
        <aside class="learn-coach-sidebar">
          <!-- Resumen rápido de Registro & Bitácora -->
          <div class="duo-card coach-widget">
            <div class="widget-title-row">
              <h3>📓 Bitácora de ${escapeHTML(activeUser?.name || 'Estudiante')}</h3>
              <span class="badge-vivid ${pendingWeak.length ? 'badge-orange' : 'badge-green'}">
                ${pendingWeak.length ? `${pendingWeak.length} a repasar` : 'Al día ✓'}
              </span>
            </div>
            <div class="sidebar-kpi-mini-row">
              <div class="skpi-pill skpi-ok"><strong>${userStats.hits}</strong><span>Aciertos</span></div>
              <div class="skpi-pill skpi-miss"><strong>${userStats.misses}</strong><span>No aciertos</span></div>
              <div class="skpi-pill skpi-acc"><strong>${userStats.accuracyPct}%</strong><span>Precisión</span></div>
            </div>
            <button class="duo-btn btn-outline btn-sm" id="btn-sidebar-open-log" style="width:100%;margin-top:10px;">
              👤 Cambiar Usuario / Ver Historial Completo
            </button>
          </div>

          <!-- Meta Diaria -->
          <div class="duo-card coach-widget">
            <div class="widget-title-row">
              <h3>🎯 Meta Diaria de Práctica</h3>
              <span class="badge-vivid badge-orange">🔥 ${this.state.streak} día${this.state.streak === 1 ? '' : 's'}</span>
            </div>
            <div class="daily-progress-bar">
              <div class="daily-progress-fill" id="daily-goal-fill" style="width:${dailyPct}%"></div>
            </div>
            <div class="daily-goal-caption">
              <strong id="daily-goal-txt">${this.state.dailyXp} / ${this.state.dailyGoal} XP hoy</strong>
              <span>${dailyPct >= 100 ? '🎉 ¡Meta cumplida!' : '¡15 min al día hacen al maestro!'}</span>
            </div>
          </div>

          <!-- Selector Rápido de Sonido -->
          <div class="duo-card coach-widget">
            <h3>🔊 Sonido de tu Instrumento</h3>
            <p class="muted-hint">Elige cómo suena la plataforma en tablaturas, acordes y canciones:</p>
            <div class="timbre-selector-stack">
              ${[
                ['nylon', '🎸 Guitarra Clásica Nylon', 'Cálida para Misa y Adoración'],
                ['requinto', '✨ Requinto / Acústica', 'Brillante para punteos costeños'],
                ['accordion', '🪗 Acordeón Vallenato', 'Tono diatónico festivo en TABs']
              ].map(([id, title, desc]) => `
                <button class="timbre-option-btn ${this.state.instrument === id ? 'selected' : ''}" data-inst="${id}">
                  <strong>${title}</strong>
                  <small>${desc}</small>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Atajos Directos al Repertorio Estrella -->
          <div class="duo-card coach-widget">
            <h3>⚡ Práctica Rápida Favorita</h3>
            <div class="quick-launch-list">
              <button class="quick-launch-item" data-qjump="guitar3d" data-qid="keyner_map">
                <span class="ql-emo">📐</span>
                <div><strong>Guitarra 3D &amp; Keyner 10-60</strong><small>Partes, postura y diapasón táctil</small></div>
              </button>
              <button class="quick-launch-item" data-qjump="songs" data-qid="col_pueblito_viejo">
                <span class="ql-emo">📕</span>
                <div><strong>Pueblito Viejo (Keyner)</strong><small>Vals con intro numérica + TAB</small></div>
              </button>
              <button class="quick-launch-item" data-qjump="songs" data-qid="ms_dios_esta_aqui">
                <span class="ql-emo">🙌</span>
                <div><strong>Dios Está Aquí</strong><small>Progresión D - A - Bm - G</small></div>
              </button>
              <button class="quick-launch-item" data-qjump="songs" data-qid="val_caminos_vida">
                <span class="ql-emo">🪗</span>
                <div><strong>Los Caminos de la Vida</strong><small>Paseo Vallenato + TAB</small></div>
              </button>
              <button class="quick-launch-item" data-qjump="rhythms" data-qid="pasillo_colombiano">
                <span class="ql-emo">🥁</span>
                <div><strong>Pasillo, Bambuco y Paseo</strong><small>Rasgueos + percusión en vivo</small></div>
              </button>
            </div>
          </div>

          <!-- Biblioteca Técnica Integrada -->
          <div class="duo-card coach-widget methods-biblio-card">
            <h3>📚 Métodos Integrados</h3>
            <ul class="biblio-clean-list">
              <li>📕 <strong>Keyner Ramírez Mojica</strong> — <em>Haga Música con la Guitarra</em> (Método 10–60, láminas, intros &amp; tablas armónicas)</li>
              <li>📘 <strong>Camavaro</strong> — <em>Entre Cuerdas de Guitarra</em> (Postura, bajos y mapas)</li>
              <li>📙 <strong>Fran Cordón</strong> — <em>Curso de Guitarra</em> (Cejillas, escalas y armonía)</li>
              <li>📗 <strong>V. Cordantonopulos</strong> + <strong>Iván Becerra</strong> — <em>Teoría y Técnica 1-2-3-4</em></li>
              <li>📓 <strong>Medina &amp; Caliva</strong> + <strong>Bonos 1, 2 y 4 Cancionero Digital</strong></li>
            </ul>
          </div>
        </aside>
      </div>
    `;

    container.querySelector('#hero-btn-continue')?.addEventListener('click', () => {
      const targetId = nextSuggestedId || SKILL_UNITS[0].lessons[0].id;
      this._openLessonById(targetId);
    });

    container.querySelector('#hero-btn-3d')?.addEventListener('click', () => {
      this.switchView('guitar3d');
    });

    container.querySelector('#hero-btn-connect')?.addEventListener('click', () => {
      this.openAudioTunerModal();
    });

    container.querySelector('#btn-hero-remediate-first')?.addEventListener('click', () => {
      if (pendingWeak[0]) this.openStandaloneRemediation(pendingWeak[0].theoryId);
    });

    container.querySelector('#btn-sidebar-open-log')?.addEventListener('click', () => {
      this.openUserModal();
    });

    container.querySelectorAll('[data-lesson]').forEach(btn => {
      btn.addEventListener('click', () => {
        this._openLessonById(btn.dataset.lesson);
      });
    });

    container.querySelectorAll('[data-inst]').forEach(btn => {
      btn.addEventListener('click', () => {
        const inst = btn.dataset.inst;
        this.state.instrument = inst;
        this._saveState();
        audioEngine.setInstrument(inst);
        audioEngine.strumChord('G', 'down', 0);
        this.renderLearnView();
      });
    });

    container.querySelectorAll('[data-qjump]').forEach(btn => {
      btn.addEventListener('click', () => {
        const dest = btn.dataset.qjump;
        const id = btn.dataset.qid;
        this.switchView(dest);
        if (dest === 'songs') this.songStudio.selectSong(id);
        if (dest === 'tabs') this.tabPlayer.selectTab(id);
        if (dest === 'rhythms') this.rhythmTrainer.selectPattern(id);
        if (dest === 'fretboard') this.fretboardStudio.setMode(id);
        if (dest === 'guitar3d') this.guitar3dStudio.setMode(id);
      });
    });
  }

  // ==================== EJECUTOR INTERACTIVO DE LECCIONES + REMEDIACIÓN ====================
  _openLessonById(lessonId) {
    for (const unit of SKILL_UNITS) {
      const found = unit.lessons.find(l => l.id === lessonId);
      if (found) {
        this.openLessonModal(unit, found);
        return;
      }
    }
  }

  openLessonModal(unit, lesson) {
    if (this.state.hearts <= 0) {
      this.state.hearts = 5;
      this._saveState();
      this.updateTopbarStats();
    }

    const questionSteps = lesson.steps.filter(s => s.type !== 'theory');
    this.lessonSession = {
      mode: 'lesson',
      unit,
      lesson,
      stepIdx: 0,
      selectedOption: null,
      stepResolved: false,
      mistakes: 0,
      initialQuestionsTotal: questionSteps.length,
      initialHits: 0,
      remediationQueue: [],
      phase: 'initial', // 'initial' | 'remediation_theory' | 'remediation_retry'
      remediationItem: null,
      remediationCompleted: 0,
      remediationTotalQueued: 0
    };

    const modal = document.getElementById('modal-lesson');
    modal.classList.remove('hidden');

    document.getElementById('btn-quit-lesson').onclick = () => {
      pitchDetector.offPitch('lesson-runner');
      modal.classList.add('hidden');
      this.lessonSession = null;
      this.renderLearnView();
    };

    this._renderCurrentLessonStep();
  }

  openStandaloneRemediation(theoryId) {
    const theory = THEORY_LIBRARY[theoryId] || {
      id: theoryId,
      title: theoryId,
      badge: 'Repaso Teórico Dirigido',
      summary: 'Refuerza los conceptos clave y valida tu comprensión práctica.',
      explanation: 'Repasa las posiciones en el mástil y los diagramas de acordes relacionados.',
      exampleTip: 'Practica despacio escuchando cada cuerda antes de responder.'
    };

    // Buscar hasta 2 preguntas en SKILL_UNITS ligadas a este theoryId
    const matchingQuestions = [];
    for (const u of SKILL_UNITS) {
      for (const l of u.lessons) {
        l.steps.forEach((step, idx) => {
          if (step.type !== 'theory' && step.theoryId === theoryId) {
            matchingQuestions.push({
              questionId: `${l.id}_s${idx}`,
              step,
              theoryId,
              unit: u,
              lesson: l
            });
          }
        });
      }
    }

    const picked = matchingQuestions.slice(0, 2);
    if (!picked.length) {
      picked.push({
        questionId: `rem_${theoryId}_check`,
        theoryId,
        step: {
          type: 'quiz',
          theoryId,
          question: `Luego de repasar "${theory.title}", ¿qué recomendación práctica aplica directamente?`,
          options: [
            theory.exampleTip || 'Aplicar el concepto de forma lenta y consciente antes de acelerar',
            'Ignorar la posición de los dedos y acelerar desde el segundo 1',
            'Desafinar la 6ª cuerda antes de practicar'
          ],
          correctIndex: 0,
          explanation: theory.exampleTip || 'Excelente consolidación del fundamento.'
        }
      });
    }

    document.getElementById('modal-user-profile')?.classList.add('hidden');

    const refUnit = picked[0]?.unit || SKILL_UNITS[0];
    this.lessonSession = {
      mode: 'standalone_remediation',
      unit: refUnit,
      lesson: {
        id: `remediation_${theoryId}`,
        title: `Repaso Teórico: ${theory.title}`,
        xp: 20,
        steps: picked.map(p => p.step)
      },
      stepIdx: 0,
      selectedOption: null,
      stepResolved: false,
      mistakes: 0,
      initialQuestionsTotal: picked.length,
      initialHits: 0,
      remediationQueue: picked.map(p => ({
        questionId: p.questionId,
        step: p.step,
        theoryId: p.theoryId
      })),
      phase: 'remediation_theory',
      remediationItem: null,
      remediationCompleted: 0,
      remediationTotalQueued: picked.length
    };
    this.lessonSession.remediationItem = this.lessonSession.remediationQueue[0];

    const modal = document.getElementById('modal-lesson');
    modal.classList.remove('hidden');

    document.getElementById('btn-quit-lesson').onclick = () => {
      pitchDetector.offPitch('lesson-runner');
      modal.classList.add('hidden');
      this.lessonSession = null;
      this.renderLearnView();
    };

    this._renderRemediationTheoryStep();
  }

  _queueRemediation(sess, step, questionId) {
    if (!sess) return;
    if (sess.remediationQueue.some(item => item.questionId === questionId)) return;
    sess.remediationQueue.push({
      questionId,
      step,
      theoryId: step.theoryId || 'general_music'
    });
    sess.remediationTotalQueued++;
  }

  _getTheoryMeta(theoryId) {
    return THEORY_LIBRARY[theoryId] || {
      id: theoryId || 'general_music',
      title: 'Fundamento Musical Aplicado',
      badge: 'Teoría Musical',
      summary: 'Repasa este concepto clave para consolidar tu técnica y oído.',
      explanation: 'Observa el diagrama e inténtalo despacio manteniendo la mano relajada.',
      exampleTip: 'Escucha el ejemplo de audio y vuelve a comprobar tu respuesta.'
    };
  }

  _updateLessonHeaderChrome(pct, badgeText = '') {
    const fill = document.getElementById('lesson-progress-fill');
    const heartsEl = document.getElementById('lesson-hearts-count');
    const badgeEl = document.getElementById('lesson-phase-badge');

    if (fill) {
      fill.style.width = `${pct}%`;
      fill.classList.toggle('fill-remediation', Boolean(badgeText));
    }
    if (heartsEl) heartsEl.textContent = String(this.state.hearts);
    if (badgeEl) {
      if (badgeText) {
        badgeEl.textContent = badgeText;
        badgeEl.classList.remove('hidden');
      } else {
        badgeEl.classList.add('hidden');
      }
    }
  }

  _renderCurrentLessonStep() {
    const sess = this.lessonSession;
    if (!sess) return;
    pitchDetector.offPitch('lesson-runner');

    if (sess.phase === 'remediation_theory') {
      this._renderRemediationTheoryStep();
      return;
    }

    if (sess.phase === 'remediation_retry' && sess.remediationItem) {
      this._renderInteractiveQuestionStep(sess.remediationItem.step, sess.remediationItem.questionId, true);
      return;
    }

    const total = sess.lesson.steps.length;
    if (sess.stepIdx >= total) {
      if (sess.remediationQueue.length > 0) {
        sess.phase = 'remediation_theory';
        sess.remediationItem = sess.remediationQueue[0];
        this._renderRemediationTheoryStep();
      } else {
        this._renderLessonVictoryScreen();
      }
      return;
    }

    const step = sess.lesson.steps[sess.stepIdx];
    const pct = Math.max(8, Math.round((sess.stepIdx / total) * 100));
    const remNote = sess.remediationQueue.length > 0
      ? `🔄 ${sess.remediationQueue.length} repaso(s) al final`
      : '';
    this._updateLessonHeaderChrome(pct, remNote);

    if (step.type === 'theory') {
      this._renderTheoryStep(step);
    } else {
      const qId = step.id || `${sess.lesson.id}_s${sess.stepIdx}`;
      this._renderInteractiveQuestionStep(step, qId, false);
    }
  }

  _renderTheoryStep(step) {
    const sess = this.lessonSession;
    sess.selectedOption = null;
    sess.stepResolved = true;

    const body = document.getElementById('lesson-step-body');
    const footer = document.getElementById('lesson-footer-bar');
    const feedbackEl = document.getElementById('lesson-feedback-msg');
    const primaryBtn = document.getElementById('btn-lesson-primary');

    footer.className = 'lesson-footer-bar';
    feedbackEl.innerHTML = '';

    body.innerHTML = `
      <div class="lesson-card-step">
        <span class="badge-vivid" style="background:${sess.unit.color};color:#fff">${escapeHTML(step.badge || sess.unit.title)}</span>
        <h2 class="lesson-step-title">${escapeHTML(step.title)}</h2>
        ${step.image ? `
          <div class="lesson-theory-img-box">
            <img src="${step.image}" alt="${escapeHTML(step.title)}" loading="lazy" />
          </div>
        ` : ''}
        <div class="lesson-rich-prose">${formatRichText(step.body)}</div>
        ${step.highlightBox ? `<div class="lesson-tip-callout">💡 <strong>Clave Práctica:</strong> ${escapeHTML(step.highlightBox)}</div>` : ''}
        <div class="lesson-demo-row">
          ${step.demoChord ? `
            <div class="lesson-mini-chord-box">
              ${renderChordSVG(step.demoChord, { width: 150, showBasses: true })}
              <button class="duo-btn btn-blue btn-sm" id="ls-demo-chord-btn">🔊 Escuchar ${escapeHTML(formatChordLabel(step.demoChord, 'dual'))}</button>
            </div>
          ` : ''}
          ${step.demoNotes ? `
            <button class="duo-btn btn-purple btn-sm" id="ls-demo-notes-btn">🔊 Escuchar Secuencia de Cuerdas</button>
          ` : ''}
          ${step.actionTarget ? `
            <button class="duo-btn btn-outline btn-sm" id="ls-jump-studio-btn">🚀 ${escapeHTML(step.actionTarget.label)}</button>
          ` : ''}
        </div>
      </div>
    `;

    body.querySelector('#ls-demo-chord-btn')?.addEventListener('click', () => {
      audioEngine.strumChord(step.demoChord, 'down', 0);
    });
    body.querySelector('#ls-demo-notes-btn')?.addEventListener('click', () => {
      step.demoNotes.forEach((m, idx) => {
        setTimeout(() => audioEngine.playMidi(m, 0.9, 0.8), idx * 330);
      });
    });
    body.querySelector('#ls-jump-studio-btn')?.addEventListener('click', () => {
      const { tab, itemId } = step.actionTarget;
      this._navigateFromActionTarget(tab, itemId);
    });

    primaryBtn.textContent = '¡ENTENDIDO, CONTINUAR!';
    primaryBtn.className = 'duo-btn btn-green btn-lg';
    primaryBtn.disabled = false;
    primaryBtn.onclick = () => {
      audioEngine.playSuccess();
      sess.stepIdx++;
      this._renderCurrentLessonStep();
    };
  }

  _renderRemediationTheoryStep() {
    const sess = this.lessonSession;
    if (!sess || !sess.remediationItem) return;
    pitchDetector.offPitch('lesson-runner');

    const item = sess.remediationItem;
    const theory = this._getTheoryMeta(item.theoryId);
    const totalQ = Math.max(1, sess.remediationTotalQueued);
    const remPct = Math.min(96, 82 + Math.round((sess.remediationCompleted / totalQ) * 14));
    this._updateLessonHeaderChrome(
      remPct,
      `🔄 Repaso Obligatorio (${sess.remediationCompleted + 1} de ${totalQ})`
    );

    const body = document.getElementById('lesson-step-body');
    const footer = document.getElementById('lesson-footer-bar');
    const feedbackEl = document.getElementById('lesson-feedback-msg');
    const primaryBtn = document.getElementById('btn-lesson-primary');

    footer.className = 'lesson-footer-bar state-remediation';
    feedbackEl.innerHTML = '<strong>📖 Paso obligatorio del ciclo de aprendizaje:</strong> <span>Revisa el fundamento antes de volver a intentar el desafío.</span>';

    body.innerHTML = `
      <div class="lesson-card-step remediation-theory-panel">
        <div class="remediation-alert-banner">
          <span class="rem-ico">🔄</span>
          <div>
            <strong>Ciclo de Refuerzo Teórico Obligatorio</strong>
            <p>${sess.mode === 'standalone_remediation'
              ? 'Repasa esta teoría registrada en tu bitácora y responde bien el reto práctico para marcarla como dominada.'
              : `Para poder finalizar el módulo "${escapeHTML(sess.lesson.title)}", primero repasemos la teoría del punto donde hubo dificultad:`}</p>
          </div>
        </div>

        <span class="badge-vivid badge-orange">${escapeHTML(theory.badge)}</span>
        <h2 class="lesson-step-title">${escapeHTML(theory.title)}</h2>
        ${theory.summary ? `<p class="rem-summary-line">${escapeHTML(theory.summary)}</p>` : ''}

        ${theory.image ? `
          <div class="lesson-theory-img-box">
            <img src="${theory.image}" alt="${escapeHTML(theory.title)}" />
          </div>
        ` : ''}

        <div class="lesson-rich-prose">${formatRichText(theory.explanation)}</div>

        ${theory.exampleTip ? `
          <div class="lesson-tip-callout">💡 <strong>Regla Clave para el Reintento:</strong> ${escapeHTML(theory.exampleTip)}</div>
        ` : ''}

        <div class="lesson-demo-row">
          ${theory.demoChord ? `
            <div class="lesson-mini-chord-box">
              ${renderChordSVG(theory.demoChord, { width: 145, showBasses: true })}
              <button class="duo-btn btn-blue btn-sm" id="rem-demo-chord">🔊 Escuchar ${escapeHTML(formatChordLabel(theory.demoChord, 'dual'))}</button>
            </div>
          ` : ''}
          ${theory.demoNotes ? `
            <button class="duo-btn btn-purple btn-sm" id="rem-demo-notes">🔊 Escuchar Ejemplo Sonoro</button>
          ` : ''}
        </div>
      </div>
    `;

    body.querySelector('#rem-demo-chord')?.addEventListener('click', () => {
      audioEngine.strumChord(theory.demoChord, 'down', 0);
    });
    body.querySelector('#rem-demo-notes')?.addEventListener('click', () => {
      theory.demoNotes.forEach((m, idx) => {
        setTimeout(() => audioEngine.playMidi(m, 0.9, 0.8), idx * 320);
      });
    });

    primaryBtn.textContent = '✅ TEORÍA REPASADA — RESOLVER PREGUNTA';
    primaryBtn.className = 'duo-btn btn-orange btn-lg';
    primaryBtn.disabled = false;
    primaryBtn.onclick = () => {
      userStore.markTheoryReviewed(item.theoryId, false);
      sess.phase = 'remediation_retry';
      this._renderInteractiveQuestionStep(item.step, item.questionId, true);
    };
  }

  _finishQuestionAndProceed(wasCorrectInRemediation) {
    const sess = this.lessonSession;
    if (!sess) return;

    if (sess.phase === 'remediation_retry') {
      if (wasCorrectInRemediation) {
        sess.remediationQueue.shift();
        sess.remediationCompleted++;
        if (sess.remediationQueue.length > 0) {
          sess.phase = 'remediation_theory';
          sess.remediationItem = sess.remediationQueue[0];
          this._renderRemediationTheoryStep();
        } else if (sess.mode === 'standalone_remediation') {
          this._renderStandaloneRemediationComplete();
        } else {
          this._renderLessonVictoryScreen();
        }
      } else {
        // No superó en remediación -> regresa al repaso de esa misma teoría
        sess.phase = 'remediation_theory';
        this._renderRemediationTheoryStep();
      }
      return;
    }

    // Fase inicial
    sess.stepIdx++;
    this._renderCurrentLessonStep();
  }

  _logChallengeOutcome({ step, questionId, outcome, isRemediation, userAnswer, expectedAnswer }) {
    const sess = this.lessonSession;
    const theory = this._getTheoryMeta(step.theoryId);
    const qText = step.question || step.title || step.instruction || questionId;
    return userStore.recordAttempt({
      lessonId: sess?.lesson?.id || 'lesson',
      lessonTitle: sess?.lesson?.title || '',
      unitId: sess?.unit?.id || '',
      questionId,
      questionText: qText,
      questionType: step.type,
      theoryId: step.theoryId || 'general_music',
      theoryTitle: theory.title,
      outcome,
      phase: isRemediation ? 'remediation' : 'initial',
      userAnswer,
      expectedAnswer
    });
  }

  _renderInteractiveQuestionStep(step, questionId, isRemediation) {
    const sess = this.lessonSession;
    sess.selectedOption = null;
    sess.stepResolved = false;

    const total = Math.max(1, sess.lesson.steps.length);
    if (isRemediation) {
      const totalQ = Math.max(1, sess.remediationTotalQueued);
      const remPct = Math.min(98, 84 + Math.round((sess.remediationCompleted / totalQ) * 14));
      this._updateLessonHeaderChrome(
        remPct,
        `🔄 Validando Repaso (${sess.remediationCompleted + 1} de ${totalQ})`
      );
    } else {
      const pct = Math.max(8, Math.round((sess.stepIdx / total) * 100));
      const badgeTxt = sess.remediationQueue.length > 0 ? `🔄 ${sess.remediationQueue.length} repaso(s) al final` : '';
      this._updateLessonHeaderChrome(pct, badgeTxt);
    }

    const body = document.getElementById('lesson-step-body');
    const footer = document.getElementById('lesson-footer-bar');
    const feedbackEl = document.getElementById('lesson-feedback-msg');
    const primaryBtn = document.getElementById('btn-lesson-primary');
    const theory = this._getTheoryMeta(step.theoryId);

    footer.className = 'lesson-footer-bar';
    feedbackEl.innerHTML = '';

    const remediationBannerHtml = isRemediation
      ? `<div class="rem-retry-strip">🔄 <strong>Validación tras Repaso (${escapeHTML(theory.title)}):</strong> Responde correctamente para consolidar este aprendizaje.</div>`
      : '';

    // ---- TIPO A: QUIZ OPCIÓN MÚLTIPLE ----
    if (step.type === 'quiz') {
      let lastOutcome = false;
      body.innerHTML = `
        <div class="lesson-card-step">
          ${remediationBannerHtml}
          <div class="step-meta-line">
            <span class="badge-vivid badge-blue">🧠 Pregunta Teórico-Práctica</span>
            <span class="badge-vivid badge-purple">📖 ${escapeHTML(theory.title)}</span>
          </div>
          <h2 class="lesson-step-title">${escapeHTML(step.question)}</h2>
          <div class="quiz-options-grid">
            ${step.options.map((opt, idx) => `
              <button class="quiz-3d-option" data-optidx="${idx}">
                <span class="opt-num-badge">${idx + 1}</span>
                <span class="opt-label-txt">${escapeHTML(opt)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      `;

      primaryBtn.textContent = 'COMPROBAR';
      primaryBtn.className = 'duo-btn btn-green btn-lg';
      primaryBtn.disabled = true;

      body.querySelectorAll('.quiz-3d-option').forEach(btn => {
        btn.addEventListener('click', () => {
          if (sess.stepResolved) return;
          sess.selectedOption = Number(btn.dataset.optidx);
          body.querySelectorAll('.quiz-3d-option').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          primaryBtn.disabled = false;
          audioEngine.playMidi(60 + sess.selectedOption * 2, 0.2, 0.28);
        });
      });

      primaryBtn.onclick = () => {
        if (!sess.stepResolved) {
          if (sess.selectedOption === null) return;
          sess.stepResolved = true;
          const isCorrect = sess.selectedOption === step.correctIndex;
          lastOutcome = isCorrect;
          const allOpts = body.querySelectorAll('.quiz-3d-option');
          allOpts[step.correctIndex]?.classList.add('correct');

          this._logChallengeOutcome({
            step,
            questionId,
            outcome: isCorrect ? 'acierto' : 'no_acierto',
            isRemediation,
            userAnswer: step.options[sess.selectedOption] || '',
            expectedAnswer: step.options[step.correctIndex] || ''
          });

          if (isCorrect) {
            if (!isRemediation) sess.initialHits++;
            audioEngine.playSuccess();
            footer.className = 'lesson-footer-bar state-correct';
            feedbackEl.innerHTML = `<strong>✅ ¡Excelente!</strong> <span>${escapeHTML(step.explanation)}</span>`;
            primaryBtn.textContent = 'CONTINUAR';
            primaryBtn.className = 'duo-btn btn-green btn-lg';
          } else {
            allOpts[sess.selectedOption]?.classList.add('wrong');
            audioEngine.playError();
            sess.mistakes++;
            this.state.hearts = Math.max(1, this.state.hearts - 1);
            this._saveState();
            this.updateTopbarStats();
            document.getElementById('lesson-hearts-count').textContent = String(this.state.hearts);

            if (!isRemediation) {
              this._queueRemediation(sess, step, questionId);
            }

            footer.className = 'lesson-footer-bar state-wrong';
            feedbackEl.innerHTML = isRemediation
              ? `<strong>⚠️ Aún requiere refuerzo:</strong> <span>${escapeHTML(step.explanation)}</span>`
              : `<strong>💡 Queda anotado para repasar la teoría antes de cerrar el módulo:</strong> <span>${escapeHTML(step.explanation)}</span>`;
            primaryBtn.textContent = isRemediation ? '📖 VOLVER A REPASAR TEORÍA' : 'CONTINUAR';
            primaryBtn.className = 'duo-btn btn-orange btn-lg';
          }
        } else {
          this._finishQuestionAndProceed(lastOutcome);
        }
      };
      return;
    }

    // ---- TIPO B: ENCONTRAR NOTA EN MINI-MÁSTIL INTERACTIVO ----
    if (step.type === 'fretboard_find') {
      const targetMidi = getFretMidi(step.targetString, step.targetFret);
      const targetInfo = midiToNoteInfo(targetMidi);
      const expectedStr = `${step.targetString}ª tr.${step.targetFret} (Cód. ${toKeynerFretCode(step.targetString, step.targetFret)} · ${targetInfo.note})`;
      let missedThisAttempt = false;
      let passedOnFirstTry = false;

      body.innerHTML = `
        <div class="lesson-card-step">
          ${remediationBannerHtml}
          <div class="step-meta-line">
            <span class="badge-vivid badge-purple">🎯 Desafío en el Diapasón</span>
            <span class="badge-vivid badge-blue">📖 ${escapeHTML(theory.title)}</span>
          </div>
          <h2 class="lesson-step-title">${escapeHTML(step.question)}</h2>
          <p class="muted-hint">💡 Pista: ${escapeHTML(step.hint)}</p>

          <div class="lesson-mini-fretboard">
            <div class="lmf-header">
              <span>Cuerda</span>
              ${Array.from({ length: 10 }, (_, f) => `<span>${f === 0 ? 'Aire(0)' : 'Tr.' + f}</span>`).join('')}
            </div>
            ${[1, 2, 3, 4, 5, 6].map(s => `
              <div class="lmf-row ${s === step.targetString ? 'lmf-row-focus' : ''}">
                <span class="lmf-str-lbl">${s}ª</span>
                ${Array.from({ length: 10 }, (_, f) => `
                  <button class="lmf-cell-btn" data-s="${s}" data-f="${f}" title="${s}ª cuerda espacio ${f} (Keyner ${toKeynerFretCode(s, f)})">●</button>
                `).join('')}
              </div>
            `).join('')}
          </div>
        </div>
      `;

      // Ajustar columnas dinámicas si son 10 trastes (0..9)
      body.querySelectorAll('.lmf-header, .lmf-row').forEach(row => {
        row.style.gridTemplateColumns = '52px repeat(10, minmax(38px, 1fr))';
      });

      primaryBtn.textContent = 'TOCA EL TRASTE CORRECTO';
      primaryBtn.className = 'duo-btn btn-green btn-lg';
      primaryBtn.disabled = true;

      const markSuccess = (btnEl, viaMic = false) => {
        if (sess.stepResolved) return;
        sess.stepResolved = true;
        if (btnEl) {
          btnEl.classList.add('hit-ok');
          btnEl.textContent = targetInfo.note;
        }
        audioEngine.playStringFret(step.targetString, step.targetFret, 1.3);
        audioEngine.playSuccess();

        if (!missedThisAttempt) {
          passedOnFirstTry = true;
          if (!isRemediation) sess.initialHits++;
          this._logChallengeOutcome({
            step,
            questionId,
            outcome: 'acierto',
            isRemediation,
            userAnswer: `${expectedStr}${viaMic ? ' [Guitarra Real]' : ''}`,
            expectedAnswer: expectedStr
          });
        }

        footer.className = 'lesson-footer-bar state-correct';
        feedbackEl.innerHTML = `<strong>🎯 ¡Diana perfecta!</strong> <span>${step.targetString}ª cuerda traste ${step.targetFret} (Cód. Keyner ${toKeynerFretCode(step.targetString, step.targetFret)}) = ${targetInfo.note} (${NOTES_ES[targetInfo.note]}).</span>`;
        primaryBtn.disabled = false;
        primaryBtn.textContent = 'CONTINUAR';
        primaryBtn.className = 'duo-btn btn-green btn-lg';
      };

      body.querySelectorAll('.lmf-cell-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (sess.stepResolved) return;
          const s = Number(btn.dataset.s);
          const f = Number(btn.dataset.f);
          audioEngine.playStringFret(s, f, 1.0);
          const clickedInfo = midiToNoteInfo(getFretMidi(s, f));

          if (s === step.targetString && f === step.targetFret) {
            markSuccess(btn, false);
          } else {
            btn.classList.add('hit-wrong');
            audioEngine.playError();

            if (!missedThisAttempt) {
              missedThisAttempt = true;
              sess.mistakes++;
              this.state.hearts = Math.max(1, this.state.hearts - 1);
              this._saveState();
              this.updateTopbarStats();
              document.getElementById('lesson-hearts-count').textContent = String(this.state.hearts);

              this._logChallengeOutcome({
                step,
                questionId,
                outcome: 'no_acierto',
                isRemediation,
                userAnswer: `${s}ª tr.${f} (Cód. ${toKeynerFretCode(s, f)} · ${clickedInfo.note})`,
                expectedAnswer: expectedStr
              });

              if (!isRemediation) {
                this._queueRemediation(sess, step, questionId);
              } else {
                // En remediación, si falla vuelve al repaso teórico
                sess.stepResolved = true;
                passedOnFirstTry = false;
                footer.className = 'lesson-footer-bar state-wrong';
                feedbackEl.innerHTML = `<strong>⚠️ Pulsaste ${clickedInfo.note} (Cód. ${toKeynerFretCode(s, f)}).</strong> <span>Repasemos nuevamente "${escapeHTML(theory.title)}" antes de reintentar.</span>`;
                primaryBtn.disabled = false;
                primaryBtn.textContent = '📖 VOLVER A REPASAR TEORÍA';
                primaryBtn.className = 'duo-btn btn-orange btn-lg';
                return;
              }
            }

            feedbackEl.innerHTML = `<strong>Intenta ubicarla:</strong> <span>Esa fue ${clickedInfo.note}. Pista: ${escapeHTML(step.hint)} (Se agregará repaso teórico al final).</span>`;
          }
        });
      });

      pitchDetector.onPitch('lesson-runner', (pitch) => {
        if (!sess.stepResolved && pitch.midi === targetMidi) {
          const targetBtn = body.querySelector(`.lmf-cell-btn[data-s="${step.targetString}"][data-f="${step.targetFret}"]`);
          markSuccess(targetBtn, true);
        }
      });

      primaryBtn.onclick = () => {
        if (!sess.stepResolved) return;
        this._finishQuestionAndProceed(passedOnFirstTry);
      };
      return;
    }

    // ---- TIPO C: CHECKPOINT SONORO (NOTA O ACORDE EN VIVO / VIRTUAL) ----
    if (step.type === 'play_guitar_note' || step.type === 'play_guitar_chord') {
      const isChord = step.type === 'play_guitar_chord';
      const targetInfo = !isChord ? midiToNoteInfo(step.targetMidi) : null;
      const col = isChord
        ? (NOTE_COLORS[parseChord(step.chord).root] || NOTE_COLORS.G)
        : (NOTE_COLORS[targetInfo.note] || NOTE_COLORS.E);
      const expectedStr = isChord ? `Acorde ${step.chord}` : `Nota ${step.targetLabel}`;
      let playSuccessResult = false;

      body.innerHTML = `
        <div class="lesson-card-step center-step">
          ${remediationBannerHtml}
          <div class="step-meta-line" style="justify-content:center;">
            <span class="badge-vivid badge-green">🎙️🔌 Práctica Sonora en Vivo</span>
            <span class="badge-vivid badge-purple">📖 ${escapeHTML(theory.title)}</span>
          </div>
          <h2 class="lesson-step-title">${escapeHTML(step.title)}</h2>
          <p class="lesson-instruction-p">${escapeHTML(step.instruction)}</p>

          <div class="live-checkpoint-stage">
            ${isChord ? `
              <div class="checkpoint-svg-box">
                ${renderChordSVG(step.chord, { width: 190, showBasses: true })}
              </div>
            ` : `
              <div class="checkpoint-big-note-pill" style="background:${col.bg};border-bottom-color:${col.border};color:${col.text}">
                ${escapeHTML(step.targetLabel)}
              </div>
            `}

            <div class="checkpoint-mic-panel">
              <div id="ls-live-mic-status" class="ls-mic-status">
                ${pitchDetector.isListening
                  ? '🟢 Escuchando tu guitarra... ¡Tócala ahora!'
                  : '🔌 ¿Tienes tu guitarra a mano? Enciende el micrófono/línea o valida con la guitarra virtual:'}
              </div>
              <div class="checkpoint-action-btns">
                ${!pitchDetector.isListening ? `
                  <button class="duo-btn btn-blue" id="ls-enable-mic-btn">🎙️ Encender Micrófono / Línea</button>
                ` : ''}
                <button class="duo-btn btn-purple" id="ls-virtual-strum-btn">
                  🔊 ${isChord ? `Rasguear ${escapeHTML(step.chord)} y Validar` : 'Escuchar Nota y Validar'}
                </button>
                <button class="duo-btn btn-outline btn-sm" id="ls-need-review-btn">
                  💡 Aún me cuesta (Repasar técnica/teoría)
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      primaryBtn.textContent = 'ESPERANDO TU GUITARRA...';
      primaryBtn.className = 'duo-btn btn-green btn-lg';
      primaryBtn.disabled = true;

      const completePlayStep = (sourceLabel) => {
        if (sess.stepResolved) return;
        sess.stepResolved = true;
        playSuccessResult = true;
        if (!isRemediation) sess.initialHits++;

        this._logChallengeOutcome({
          step,
          questionId,
          outcome: 'acierto',
          isRemediation,
          userAnswer: sourceLabel,
          expectedAnswer: expectedStr
        });

        audioEngine.playSuccess();
        footer.className = 'lesson-footer-bar state-correct';
        feedbackEl.innerHTML = `<strong>🎶 ¡Sonó genial (${escapeHTML(sourceLabel)})!</strong> <span>Excelente control limpio de tu guitarra.</span>`;
        primaryBtn.disabled = false;
        primaryBtn.textContent = 'CONTINUAR';
        primaryBtn.className = 'duo-btn btn-green btn-lg';
      };

      const flagPlayNeedHelp = () => {
        if (sess.stepResolved) return;
        sess.stepResolved = true;
        playSuccessResult = false;
        sess.mistakes++;

        this._logChallengeOutcome({
          step,
          questionId,
          outcome: 'no_acierto',
          isRemediation,
          userAnswer: 'Solicitó repaso de postura/teoría',
          expectedAnswer: expectedStr
        });

        if (!isRemediation) {
          this._queueRemediation(sess, step, questionId);
        }

        audioEngine.playError();
        footer.className = 'lesson-footer-bar state-wrong';
        feedbackEl.innerHTML = `<strong>📖 ¡Buena decisión!</strong> <span>Reforzaremos la teoría "${escapeHTML(theory.title)}" antes de completar el módulo.</span>`;
        primaryBtn.disabled = false;
        primaryBtn.textContent = isRemediation ? '📖 VOLVER A REPASAR TEORÍA' : 'CONTINUAR';
        primaryBtn.className = 'duo-btn btn-orange btn-lg';
      };

      body.querySelector('#ls-enable-mic-btn')?.addEventListener('click', async () => {
        try {
          await pitchDetector.start();
          const st = body.querySelector('#ls-live-mic-status');
          if (st) st.textContent = '🟢 ¡Entrada activa! Toca tu guitarra ahora...';
        } catch (_) {
          this.openAudioTunerModal();
        }
      });

      body.querySelector('#ls-virtual-strum-btn')?.addEventListener('click', () => {
        if (isChord) {
          audioEngine.strumChord(step.chord, 'down', 0);
        } else {
          audioEngine.playMidi(step.targetMidi, 1.3, 0.85);
        }
        setTimeout(() => completePlayStep('Guitarra Virtual'), 380);
      });

      body.querySelector('#ls-need-review-btn')?.addEventListener('click', flagPlayNeedHelp);

      pitchDetector.onPitch('lesson-runner', (pitch) => {
        if (sess.stepResolved) return;
        const st = body.querySelector('#ls-live-mic-status');
        if (st) {
          st.textContent = `🎵 Detectando: ${pitch.note}${pitch.octave} (${NOTES_ES[pitch.note]}) · ${pitch.freq.toFixed(1)} Hz`;
        }
        if (isChord) {
          const poly = pitchDetector.checkChordMatch(step.chord);
          const { root } = parseChord(step.chord);
          if (poly.matched || (pitch.note === root && pitch.clarity > 0.82)) {
            completePlayStep('Guitarra Conectada en Vivo 🎸');
          }
        } else {
          const exact = pitch.midi === step.targetMidi;
          const oct = (pitch.midi % 12 === step.targetMidi % 12) && pitch.clarity > 0.86;
          if (exact || oct) {
            completePlayStep('Guitarra Conectada en Vivo 🎸');
          }
        }
      });

      primaryBtn.onclick = () => {
        if (!sess.stepResolved) return;
        this._finishQuestionAndProceed(playSuccessResult);
      };
    }
  }

  _renderLessonVictoryScreen() {
    const sess = this.lessonSession;
    if (!sess) return;
    pitchDetector.offPitch('lesson-runner');

    this._updateLessonHeaderChrome(100, '');
    audioEngine.playLessonFanfare();

    const alreadyDone = this.state.completedLessons.includes(sess.lesson.id);
    const earnedXp = alreadyDone ? Math.round(sess.lesson.xp / 2) : sess.lesson.xp;
    if (!alreadyDone) {
      this.state.completedLessons.push(sess.lesson.id);
      this._saveState();
    }
    this.awardXP(earnedXp, `Lección "${sess.lesson.title}"`);

    const body = document.getElementById('lesson-step-body');
    const footer = document.getElementById('lesson-footer-bar');
    const feedbackEl = document.getElementById('lesson-feedback-msg');
    const primaryBtn = document.getElementById('btn-lesson-primary');

    const totalQ = Math.max(1, sess.initialQuestionsTotal || 1);
    const initialAcc = Math.round((sess.initialHits / totalQ) * 100);
    const remDone = sess.remediationCompleted;

    body.innerHTML = `
      <div class="lesson-victory-box">
        <div class="victory-trophy-bounce">🏆</div>
        <h2>¡Módulo Completado al 100%!</h2>
        <p class="victory-sub">${escapeHTML(sess.lesson.title)}</p>
        ${remDone > 0 ? `
          <div class="rem-victory-chip">
            ✅ Ciclo completo superado: repasaste y validaste <strong>${remDone}</strong> teoría(s) de refuerzo.
          </div>
        ` : ''}
        <div class="victory-stats-cards">
          <div class="v-stat-card card-gold">
            <span>EXPERIENCIA</span>
            <strong>+${earnedXp} XP ⚡</strong>
          </div>
          <div class="v-stat-card card-green">
            <span>1ª RONDA · FINAL</span>
            <strong>${initialAcc}% → 100% 🎯</strong>
          </div>
          <div class="v-stat-card card-orange">
            <span>RACHA ACTIVA</span>
            <strong>${this.state.streak} 🔥</strong>
          </div>
        </div>
      </div>
    `;

    footer.className = 'lesson-footer-bar state-correct';
    feedbackEl.innerHTML = '<strong>🎉 ¡Gran constancia!</strong> <span>Todos los aciertos y repasos quedaron guardados en tu Bitácora.</span>';
    primaryBtn.textContent = 'VOLVER A LA RUTA';
    primaryBtn.className = 'duo-btn btn-green btn-lg';
    primaryBtn.disabled = false;
    primaryBtn.onclick = () => {
      document.getElementById('modal-lesson').classList.add('hidden');
      this.lessonSession = null;
      this.renderLearnView();
    };
  }

  _renderStandaloneRemediationComplete() {
    const sess = this.lessonSession;
    if (!sess) return;
    pitchDetector.offPitch('lesson-runner');

    this._updateLessonHeaderChrome(100, '✅ Consolidado');
    audioEngine.playLessonFanfare();
    this.awardXP(sess.lesson.xp || 20, sess.lesson.title);

    const body = document.getElementById('lesson-step-body');
    const footer = document.getElementById('lesson-footer-bar');
    const feedbackEl = document.getElementById('lesson-feedback-msg');
    const primaryBtn = document.getElementById('btn-lesson-primary');

    body.innerHTML = `
      <div class="lesson-victory-box">
        <div class="victory-trophy-bounce">🎓</div>
        <h2>¡Teoría Consolidada y Validada!</h2>
        <p class="victory-sub">${escapeHTML(sess.lesson.title)}</p>
        <div class="rem-victory-chip">
          ✅ Tu brecha teórica fue marcada como <strong>Dominada</strong> en tu Bitácora.
        </div>
        <div class="victory-stats-cards">
          <div class="v-stat-card card-gold"><span>BONO REPASO</span><strong>+20 XP ⚡</strong></div>
          <div class="v-stat-card card-green"><span>DOMINIO</span><strong>100% ✓</strong></div>
          <div class="v-stat-card card-orange"><span>BITÁCORA</span><strong>Actualizada</strong></div>
        </div>
      </div>
    `;

    footer.className = 'lesson-footer-bar state-correct';
    feedbackEl.innerHTML = '<strong>👏 ¡Excelente refuerzo!</strong> <span>Así se construye un oído y técnica sólidos.</span>';
    primaryBtn.textContent = 'VER MI BITÁCORA';
    primaryBtn.className = 'duo-btn btn-green btn-lg';
    primaryBtn.disabled = false;
    primaryBtn.onclick = () => {
      document.getElementById('modal-lesson').classList.add('hidden');
      this.lessonSession = null;
      this.renderLearnView();
      this.openUserModal();
    };
  }

  // ==================== MODAL 4: REGISTRO DE USUARIOS Y BITÁCORA ====================
  _isUserModalOpen() {
    const m = document.getElementById('modal-user-profile');
    return Boolean(m && !m.classList.contains('hidden'));
  }

  openUserModal() {
    this.confirmClearPending = false;
    const modal = document.getElementById('modal-user-profile');
    modal.classList.remove('hidden');
    this.renderUserModal();
  }

  renderUserModal() {
    const body = document.getElementById('user-modal-body');
    if (!body) return;

    const active = userStore.getActiveUser();
    const usersSummary = userStore.getUsersSummary();
    const stats = userStore.getStats();
    const weakList = userStore.getWeakTheories();
    const recentLogs = userStore.getRecentLogs(120, this.userLogFilter);

    body.innerHTML = `
      <!-- A. SELECTOR Y REGISTRO DE ESTUDIANTES -->
      <div class="user-section-card">
        <div class="us-head-row">
          <div>
            <h4>👥 Estudiantes Registrados (${usersSummary.length})</h4>
            <p class="muted-hint">Cada perfil conserva sus propios XP, lecciones, bitácora de aciertos/no aciertos y teorías por repasar (${userStore.serverAvailable ? 'Sincronizado con Servidor JSON + Navegador' : 'Guardado en Navegador LocalStorage'}).</p>
          </div>
        </div>

        <div class="user-cards-grid">
          ${usersSummary.map(u => {
            const isActive = active && u.id === active.id;
            return `
              <button class="user-switch-card ${isActive ? 'active' : ''}" data-select-user="${escapeHTML(u.id)}">
                <span class="usc-avatar">${escapeHTML(u.avatar)}</span>
                <div class="usc-meta">
                  <strong>${escapeHTML(u.name)} ${isActive ? '<em class="usc-now-tag">Activo</em>' : ''}</strong>
                  <small>${escapeHTML(u.levelLabel)} · ⚡ ${u.xp} XP · ✅ ${u.hits} / ❌ ${u.misses}</small>
                </div>
                ${u.weakPendingCount > 0 ? `<span class="badge-vivid badge-orange">${u.weakPendingCount} rep.</span>` : ''}
              </button>
            `;
          }).join('')}
        </div>

        <form class="user-register-form" id="form-register-user">
          <div class="urf-row">
            <input type="text" id="reg-user-name" class="duo-input" placeholder="Nombre del estudiante (ej. María Camila)" maxlength="50" required />
            <select id="reg-user-avatar" class="duo-select" title="Avatar">
              <option value="🎸">🎸 Guitarrista</option>
              <option value="🕯️">🕯️ Cantor Litúrgico</option>
              <option value="🪗">🪗 Vallenato</option>
              <option value="🎶">🎶 Melómano</option>
              <option value="🏆">🏆 Reto 30D</option>
            </select>
            <select id="reg-user-level" class="duo-select" title="Nivel">
              <option value="Principiante">Principiante</option>
              <option value="Intermedio" selected>Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
            <button type="submit" class="duo-btn btn-green btn-sm">➕ Registrar / Activar</button>
          </div>
          <label class="duo-checkbox" style="margin-top:8px;">
            <input type="checkbox" id="reg-inherit-state" />
            <span>Copiar XP y lecciones actuales a este nuevo perfil (desmarcar para iniciar desde 0 XP)</span>
          </label>
        </form>
      </div>

      <!-- B. RESUMEN KPI DE ACIERTOS Y NO ACIERTOS -->
      <div class="kpi-cards-grid">
        <div class="kpi-box kpi-ok">
          <span>✅ ACIERTOS</span>
          <strong>${stats.hits}</strong>
          <small>1ª ronda: ${stats.initialHits} · En repaso: ${stats.remediationWins}</small>
        </div>
        <div class="kpi-box kpi-miss">
          <span>❌ NO ACIERTOS</span>
          <strong>${stats.misses}</strong>
          <small>Registrados para mejora continua</small>
        </div>
        <div class="kpi-box kpi-acc">
          <span>🎯 PRECISIÓN</span>
          <strong>${stats.accuracyPct}%</strong>
          <small>Global (${stats.totalAttempts} intentos)</small>
        </div>
        <div class="kpi-box ${weakList.some(w => w.needsReview) ? 'kpi-warn' : 'kpi-teal'}">
          <span>🔄 TEORÍAS PENDIENTES</span>
          <strong>${weakList.filter(w => w.needsReview).length}</strong>
          <small>Total históricas: ${weakList.length}</small>
        </div>
      </div>

      <!-- C. CENTRO DE REMEDIACIÓN TEÓRICA -->
      <div class="user-section-card">
        <h4>📖 Teorías Asociadas a Fallos &amp; Repasos Obligatorios</h4>
        ${weakList.length === 0 ? `
          <div class="empty-good-state">
            🌟 ¡Aún no tienes errores registrados! Cada desafío que respondas quedará documentado aquí con su fundamento teórico correspondiente.
          </div>
        ` : `
          <div class="weak-theories-list">
            ${weakList.map(w => `
              <div class="weak-theory-row ${w.needsReview ? 'needs-review' : 'mastered-row'}">
                <div class="wtr-info">
                  <div class="wtr-title-line">
                    <strong>${escapeHTML(w.theoryTitle)}</strong>
                    <span class="badge-vivid ${w.needsReview ? 'badge-orange' : 'badge-green'}">
                      ${w.needsReview ? '⚠️ Pendiente de Repaso' : '✅ Consolidada en Repaso'}
                    </span>
                  </div>
                  <small>Aciertos: <strong>${w.hits}</strong> · No aciertos: <strong>${w.misses}</strong> · Precisión: <strong>${w.accuracyPct}%</strong> · Repasos hechos: ${w.reviewCount}</small>
                </div>
                <button class="duo-btn ${w.needsReview ? 'btn-orange' : 'btn-blue'} btn-xs" data-remediate-tid="${escapeHTML(w.theoryId)}">
                  📖 Repasar Teoría y Validar
                </button>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- D. HISTORIAL DETALLADO (LOG) Y EXPORTACIÓN -->
      <div class="user-section-card">
        <div class="logs-toolbar-row">
          <h4>📋 Bitácora Detallada de Respuestas (${recentLogs.length})</h4>
          <div class="logs-export-actions">
            <button class="duo-btn btn-blue btn-xs" id="btn-export-csv">📥 Descargar CSV</button>
            <button class="duo-btn btn-purple btn-xs" id="btn-export-json">📦 Exportar JSON</button>
            <button class="duo-btn ${this.confirmClearPending ? 'btn-red' : 'btn-outline'} btn-xs" id="btn-clear-logs">
              ${this.confirmClearPending ? '⚠️ Confirmar Borrado' : '🗑️ Limpiar Logs'}
            </button>
          </div>
        </div>

        <div class="log-filter-pills">
          ${[
            ['all', 'Todos'],
            ['acierto', '✅ Aciertos'],
            ['no_acierto', '❌ No Aciertos'],
            ['remediation', '🔄 Repasos Teóricos']
          ].map(([id, lbl]) => `
            <button class="mini-pill ${this.userLogFilter === id ? 'active' : ''}" data-logfilter="${id}">${lbl}</button>
          `).join('')}
        </div>

        ${recentLogs.length === 0 ? `
          <p class="muted-hint" style="padding:12px 0;">No hay registros para este filtro todavía. Completa preguntas en las lecciones o juega "Caza-Notas 60s" en el Mástil.</p>
        ` : `
          <div class="attempt-log-scroll">
            <table class="attempt-log-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Resultado</th>
                  <th>Fase</th>
                  <th>Lección</th>
                  <th>Pregunta / Desafío</th>
                  <th>Tu Respuesta</th>
                  <th>Teoría</th>
                </tr>
              </thead>
              <tbody>
                ${recentLogs.map(log => `
                  <tr>
                    <td class="col-date">${escapeHTML(formatDateTimeShort(log.timestamp))}</td>
                    <td>
                      <span class="${log.outcome === 'acierto' ? 'outcome-pill-ok' : 'outcome-pill-miss'}">
                        ${log.outcome === 'acierto' ? '✅ Acierto' : '❌ No acierto'}
                      </span>
                    </td>
                    <td>${log.phase === 'remediation' ? '<span class="badge-vivid badge-purple">🔄 Repaso</span>' : '<span class="badge-vivid badge-blue">Inicial</span>'}</td>
                    <td>${escapeHTML(log.lessonTitle || log.lessonId)}</td>
                    <td class="col-q">${escapeHTML(log.questionText)}</td>
                    <td>${escapeHTML(log.userAnswer || '—')}</td>
                    <td>${escapeHTML(log.theoryTitle)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    // Eventos del modal de perfil
    body.querySelectorAll('[data-select-user]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const uid = btn.dataset.selectUser;
        await userStore.selectUser(uid);
        this._syncStateFromStore();
        audioEngine.setInstrument(this.state.instrument || 'nylon');
        this.updateTopbarStats();
        this._refreshUserTopbarPill();
        this.renderLearnView();
        this.renderChallengeView();
        this.renderUserModal();
        this._showXPToast('👤 Perfil cambiado', `Bienvenido(a) ${userStore.getActiveUser()?.name}`);
      });
    });

    body.querySelector('#form-register-user')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = body.querySelector('#reg-user-name');
      const avatarSel = body.querySelector('#reg-user-avatar');
      const levelSel = body.querySelector('#reg-user-level');
      const inheritChk = body.querySelector('#reg-inherit-state');
      const cleanName = (nameInput?.value || '').trim();
      if (!cleanName) return;

      await userStore.registerUser({
        name: cleanName,
        avatar: avatarSel?.value || '🎸',
        levelLabel: levelSel?.value || 'Intermedio',
        inheritCurrentState: Boolean(inheritChk?.checked)
      });
      this._syncStateFromStore();
      this.updateTopbarStats();
      this._refreshUserTopbarPill();
      this.renderLearnView();
      this.renderChallengeView();
      this.renderUserModal();
      this._showXPToast('🎉 ¡Estudiante activado!', cleanName);
    });

    body.querySelectorAll('[data-remediate-tid]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.openStandaloneRemediation(btn.dataset.remediateTid);
      });
    });

    body.querySelectorAll('[data-logfilter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.userLogFilter = btn.dataset.logfilter;
        this.renderUserModal();
      });
    });

    body.querySelector('#btn-export-csv')?.addEventListener('click', () => {
      const csv = userStore.exportLogsCSV();
      this._triggerDownload(csv, `cuerdaviva_bitacora_${(active?.name || 'estudiante').replace(/\s+/g, '_')}.csv`, 'text/csv;charset=utf-8;');
    });

    body.querySelector('#btn-export-json')?.addEventListener('click', () => {
      const json = userStore.exportLogsJSON();
      this._triggerDownload(json, `cuerdaviva_respaldo_${(active?.name || 'estudiante').replace(/\s+/g, '_')}.json`, 'application/json;charset=utf-8;');
    });

    body.querySelector('#btn-clear-logs')?.addEventListener('click', async () => {
      if (!this.confirmClearPending) {
        this.confirmClearPending = true;
        this.renderUserModal();
        return;
      }
      this.confirmClearPending = false;
      await userStore.clearActiveUserLogs();
      this._refreshUserTopbarPill();
      this.renderLearnView();
      this.renderUserModal();
      this._showXPToast('🧹 Bitácora limpiada', 'Listo para nuevos registros');
    });
  }

  _triggerDownload(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ==================== VISTA 6: RETO INTERACTIVO DE 30 DÍAS ====================
  renderChallengeView() {
    const container = document.getElementById('view-challenge');
    if (!container) return;

    const doneDays = new Set(this.state.completedDays);
    const doneCount = doneDays.size;
    const pct = Math.round((doneCount / 30) * 100);

    const visibleDays = this.challengeWeekFilter === 'all'
      ? RETO_30_DIAS
      : RETO_30_DIAS.filter(d => d.week === Number(this.challengeWeekFilter));

    container.innerHTML = `
      <div class="challenge-studio-wrap">
        <div class="duo-card challenge-hero-card">
          <div class="ch-hero-top">
            <div>
              <span class="badge-vivid badge-purple">📅 Bono 4 Cancionero Digital + Folclor Colombiano + Keyner</span>
              <h2 class="section-vivid-title">🏆 Reto Guiado de 30 Días de Guitarra</h2>
              <p class="tab-subtitle">15 a 25 minutos diarios estructurados paso a paso: de afinar y dominar la anatomía 3D a tocar alabanzas completas, paseos vallenatos, pasillos, cumbias y porros.</p>
            </div>
            <div class="ch-progress-circle-box">
              <strong>${doneCount} / 30</strong>
              <span>Días Logrados (${pct}%)</span>
              ${doneCount >= 1 ? `<button class="duo-btn btn-orange btn-xs" id="btn-print-certificate">🎓 Ver Diploma</button>` : ''}
            </div>
          </div>

          <div class="ch-big-progress-track">
            <div class="ch-big-progress-fill" style="width:${pct}%"></div>
          </div>

          <div class="ch-week-pills">
            ${[
              ['all', '🗓️ Los 30 Días'],
              [1, '🌱 Semana 1: Despegue, Keyner y Alabanza'],
              [2, '⛪ Semana 2: Círculo de Do, 6/8 y Vals'],
              [3, '🪗 Semana 3: Arpegios, Pasillo y Vallenato'],
              [4, '🚀 Semana 4: Cejilla, Cumbia, Porro y Escalas']
            ].map(([val, lbl]) => `
              <button class="duo-pill ${String(this.challengeWeekFilter) === String(val) ? 'active' : ''}" data-chweek="${val}">${lbl}</button>
            `).join('')}
          </div>
        </div>

        <div class="challenge-days-grid">
          ${visibleDays.map(item => {
            const isDone = doneDays.has(item.day);
            return `
              <div class="duo-card ch-day-card ${isDone ? 'day-completed' : ''}">
                <div class="ch-day-top">
                  <span class="ch-day-num-badge">DÍA ${item.day} · Sem ${item.week}</span>
                  <span class="ch-time-tag">⏱️ ${item.minutes} min · +${item.xp} XP</span>
                </div>
                <h3 class="ch-day-title">${escapeHTML(item.title)}</h3>
                <p class="ch-day-focus">${escapeHTML(item.focus)}</p>

                <div class="ch-day-actions">
                  ${item.songId ? `<button class="duo-btn btn-blue btn-xs" data-ch-song="${item.songId}">🎶 Ir a Canción</button>` : ''}
                  ${item.tabId ? `<button class="duo-btn btn-purple btn-xs" data-ch-tab="${item.tabId}">🎯 Ir a TAB</button>` : ''}
                  ${item.rhythmId ? `<button class="duo-btn btn-orange btn-xs" data-ch-rhythm="${item.rhythmId}">🥁 Ir a Rasgueo</button>` : ''}
                  ${item.actionTab === 'tuner' ? `<button class="duo-btn btn-blue btn-xs" data-ch-tuner="1">🎙️ Abrir Afinador</button>` : ''}
                  ${item.actionTab === 'fretboard' ? `<button class="duo-btn btn-blue btn-xs" data-ch-fret="1">🎸 Ir al Mástil</button>` : ''}
                  ${item.actionTab === 'guitar3d' ? `<button class="duo-btn btn-purple btn-xs" data-ch-3d="1">📐 Ir a Guitarra 3D</button>` : ''}

                  <button class="duo-btn ${isDone ? 'btn-outline' : 'btn-green'} btn-xs ch-toggle-done" data-toggle-day="${item.day}">
                    ${isDone ? '✅ Completado' : '✓ Marcar Hecho'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-chweek]').forEach(btn => {
      btn.addEventListener('click', () => {
        const v = btn.dataset.chweek;
        this.challengeWeekFilter = v === 'all' ? 'all' : Number(v);
        this.renderChallengeView();
      });
    });

    container.querySelectorAll('[data-ch-song]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchView('songs');
        this.songStudio.selectSong(btn.dataset.chSong);
      });
    });

    container.querySelectorAll('[data-ch-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchView('tabs');
        this.tabPlayer.selectTab(btn.dataset.chTab);
      });
    });

    container.querySelectorAll('[data-ch-rhythm]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchView('rhythms');
        this.rhythmTrainer.selectPattern(btn.dataset.chRhythm);
      });
    });

    container.querySelectorAll('[data-ch-tuner]').forEach(btn => {
      btn.addEventListener('click', () => this.openAudioTunerModal());
    });

    container.querySelectorAll('[data-ch-fret]').forEach(btn => {
      btn.addEventListener('click', () => this.switchView('fretboard'));
    });

    container.querySelectorAll('[data-ch-3d]').forEach(btn => {
      btn.addEventListener('click', () => this.switchView('guitar3d'));
    });

    container.querySelectorAll('[data-toggle-day]').forEach(btn => {
      btn.addEventListener('click', () => {
        const dayNum = Number(btn.dataset.toggleDay);
        const dayObj = RETO_30_DIAS.find(d => d.day === dayNum);
        const idx = this.state.completedDays.indexOf(dayNum);
        if (idx === -1) {
          this.state.completedDays.push(dayNum);
          this._saveState();
          audioEngine.playSuccess();
          this.awardXP(dayObj ? dayObj.xp : 25, `Día ${dayNum} del Reto 30 Días`);
        } else {
          this.state.completedDays.splice(idx, 1);
          this._saveState();
        }
        this.renderChallengeView();
      });
    });

    container.querySelector('#btn-print-certificate')?.addEventListener('click', () => {
      this._showDiplomaModal();
    });
  }

  _showDiplomaModal() {
    const { current } = this._getLevelInfo();
    const activeUser = userStore.getActiveUser();
    const doneCount = this.state.completedDays.length;
    const modal = document.getElementById('modal-chord-detail');
    const head = document.getElementById('chord-modal-header');
    const body = document.getElementById('chord-modal-body');

    head.innerHTML = `
      <div>
        <h3>🎓 Certificado de Progreso Musical — CuerdaViva!</h3>
        <p class="tab-subtitle">Reconocimiento a tu constancia en Alabanza Católica y Folclor Colombiano</p>
      </div>
      <button class="modal-close-btn" id="close-diploma-btn">✕</button>
    `;

    body.innerHTML = `
      <div class="diploma-certificate-card">
        <div class="diploma-inner-border">
          <span class="diploma-seal">🎸🏆🪗</span>
          <h2>DIPLOMA DE CONSTANCIA GUITARRERA</h2>
          <p>Se otorga el presente reconocimiento a <strong>${escapeHTML(activeUser?.name || 'Estudiante')}</strong> por alcanzar:</p>
          <div class="diploma-metrics">
            <strong>${doneCount} / 30 Días del Reto</strong> · <strong>${this.state.xp} XP</strong> · <strong>${current.title}</strong>
          </div>
          <p class="diploma-quote">“Cantad a Dios con salmos, himnos y cánticos inspirados, tocando con todo el corazón.”</p>
          <button class="duo-btn btn-green" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    document.getElementById('close-diploma-btn').onclick = () => modal.classList.add('hidden');
  }

  // ==================== MODAL DE DETALLE DE ACORDE Y VARIANTES CAGED ====================
  openChordDetailModal(chordName) {
    this.modalChordName = chordName;
    const data = getChordData(chordName);
    const modal = document.getElementById('modal-chord-detail');
    const head = document.getElementById('chord-modal-header');
    const body = document.getElementById('chord-modal-body');
    const { root } = parseChord(chordName);
    const col = NOTE_COLORS[root] || NOTE_COLORS.C;

    head.innerHTML = `
      <div class="chord-modal-title-wrap">
        <span class="dict-chord-badge" style="background:${col.bg};color:${col.text};font-size:1.3rem">${escapeHTML(chordName)}</span>
        <div>
          <h3>${escapeHTML(data.nameEs)} (${escapeHTML(formatChordLabel(chordName, 'dual'))})</h3>
          <p class="tab-subtitle">${escapeHTML(data.tip || 'Explora sus posiciones abiertas y con cejilla CAGED.')}</p>
        </div>
      </div>
      <button class="modal-close-btn" id="close-chord-modal-btn">✕</button>
    `;

    body.innerHTML = `
      <div class="voicings-modal-grid">
        ${data.voicings.map((v, idx) => `
          <div class="duo-card voicing-showcase-card">
            <h4>Posición ${idx + 1}: ${escapeHTML(v.label)}</h4>
            <div class="voicing-svg-center">
              ${renderChordSVG(chordName, { voicingIndex: idx, width: 175, showBasses: true })}
            </div>
            <div class="voicing-basses-info">
              <span class="mini-pill pill-blue">B1 (Raíz): ${v.bass1}ª cuerda</span>
              <span class="mini-pill pill-purple">B2 (5ª): ${v.bass2}ª cuerda</span>
            </div>
            <div class="voicing-play-row">
              <button class="duo-btn btn-green btn-xs" data-vstrum="${idx}">🔊 Rasgueo ↓</button>
              <button class="duo-btn btn-blue btn-xs" data-varp="${idx}">🎵 Arpegio</button>
              <button class="duo-btn btn-orange btn-xs" data-vbass="${idx}">🔊 B1 → B2</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    modal.classList.remove('hidden');
    document.getElementById('close-chord-modal-btn').onclick = () => modal.classList.add('hidden');

    body.querySelectorAll('[data-vstrum]').forEach(btn => {
      btn.addEventListener('click', () => {
        audioEngine.strumChord(chordName, 'down', Number(btn.dataset.vstrum));
      });
    });
    body.querySelectorAll('[data-varp]').forEach(btn => {
      btn.addEventListener('click', () => {
        audioEngine.strumChord(chordName, 'arpeggio', Number(btn.dataset.varp));
      });
    });
    body.querySelectorAll('[data-vbass]').forEach(btn => {
      btn.addEventListener('click', () => {
        audioEngine.playPatternStep('B1', chordName, 0.4);
        setTimeout(() => audioEngine.playPatternStep('B2', chordName, 0.4), 420);
      });
    });

    audioEngine.strumChord(chordName, 'down', 0);
  }

  // ==================== AUDIO EN VIVO (MIC / LÍNEA USB) + AFINADOR ====================
  _bindGlobalAudioEvents() {
    pitchDetector.onLevel('global-vu', ({ rms }) => {
      const pct = Math.min(100, Math.round(Math.sqrt(rms * 14) * 100));
      const navVu = document.getElementById('nav-vu-fill');
      const modVu = document.getElementById('modal-vu-fill');
      if (navVu) navVu.style.width = `${pct}%`;
      if (modVu) modVu.style.width = `${pct}%`;
    });

    pitchDetector.onStatusChange('global-status', (isListening, label) => {
      const dot = document.getElementById('nav-mic-dot');
      const navTxt = document.getElementById('nav-live-note');
      const statusBadge = document.getElementById('audio-status-label');
      const powerBtn = document.getElementById('btn-toggle-mic-power');

      if (dot) dot.classList.toggle('on', isListening);
      if (!isListening && navTxt) navTxt.textContent = '🔌 Conectar / Afinar';
      if (statusBadge) {
        statusBadge.textContent = isListening ? `Activo: ${label}` : 'Apagado';
        statusBadge.className = `badge-vivid ${isListening ? 'badge-green' : 'badge-orange'}`;
      }
      if (powerBtn) {
        powerBtn.textContent = isListening ? '⏹ Apagar Entrada de Audio' : '🎙️ Encender Escucha en Vivo';
        powerBtn.className = `duo-btn ${isListening ? 'btn-orange' : 'btn-green'} btn-lg`;
      }
    });

    pitchDetector.onPitch('global-tuner', (pitch) => {
      const navTxt = document.getElementById('nav-live-note');
      if (navTxt) {
        const okTune = Math.abs(pitch.cents) <= 7 ? '✓' : (pitch.cents < 0 ? '♭' : '♯');
        navTxt.textContent = `🎸 ${pitch.note}${pitch.octave} (${pitch.noteEs}) ${okTune}`;
      }

      const modal = document.getElementById('modal-audio-tuner');
      if (!modal || modal.classList.contains('hidden')) return;

      const orb = document.getElementById('tuner-big-note');
      const esEl = document.getElementById('tuner-note-es');
      const hzEl = document.getElementById('tuner-hz');
      const needle = document.getElementById('tuner-needle');
      const guide = document.getElementById('tuner-guidance-msg');

      const inTune = Math.abs(pitch.cents) <= 6;
      const col = inTune ? { bg: '#58CC02', text: '#FFFFFF' } : (pitch.color || NOTE_COLORS.C);

      if (orb) {
        orb.textContent = `${pitch.note}${pitch.octave}`;
        orb.style.background = col.bg;
        orb.style.color = col.text;
      }
      if (esEl) {
        esEl.textContent = `${pitch.noteEs} · Cuerda cercana: ${pitch.closestString.num}ª (${pitch.closestString.note})`;
      }
      if (hzEl) {
        const sign = pitch.cents >= 0 ? `+${pitch.cents}` : `${pitch.cents}`;
        hzEl.textContent = `${pitch.freq.toFixed(1)} Hz · ${sign} cents`;
      }
      if (needle) {
        const pct = Math.max(4, Math.min(96, 50 + pitch.cents));
        needle.style.left = `${pct}%`;
        needle.classList.toggle('needle-ok', inTune);
      }
      if (guide) {
        if (inTune) {
          guide.textContent = `✨ ¡${pitch.note}${pitch.octave} (${pitch.noteEs}) PERFECTAMENTE AFINADA!`;
          guide.className = 'tuner-guidance-pill tune-perfect';
        } else if (pitch.cents < -6) {
          guide.textContent = '⬆️ Cuerda algo baja (♭): aprieta suavemente la clavija';
          guide.className = 'tuner-guidance-pill tune-low';
        } else {
          guide.textContent = '⬇️ Cuerda algo alta (♯): afloja suavemente la clavija';
          guide.className = 'tuner-guidance-pill tune-high';
        }
      }
    });
  }

  async openAudioTunerModal() {
    const modal = document.getElementById('modal-audio-tuner');
    modal.classList.remove('hidden');
    await this._populateAudioDevices();
  }

  async _populateAudioDevices() {
    const sel = document.getElementById('audio-device-select');
    if (!sel) return;
    const devices = await pitchDetector.listInputDevices();
    if (devices.length === 0) {
      sel.innerHTML = `<option value="default">Entrada predeterminada (Concede permiso al encender)</option>`;
      return;
    }
    sel.innerHTML = devices.map(d => {
      const icon = d.isLineOrInterface ? '🔌 Interfaz/Línea: ' : '🎙️ ';
      const selected = d.deviceId === pitchDetector.selectedDeviceId ? 'selected' : '';
      return `<option value="${escapeHTML(d.deviceId)}" ${selected}>${icon}${escapeHTML(d.label)}</option>`;
    }).join('');
  }

  _bindAudioModalEvents() {
    const powerBtn = document.getElementById('btn-toggle-mic-power');
    const refreshBtn = document.getElementById('btn-refresh-devices');
    const devSel = document.getElementById('audio-device-select');
    const chSel = document.getElementById('audio-channel-select');
    const gainRange = document.getElementById('audio-gain-range');
    const gainVal = document.getElementById('audio-gain-val');
    const gateRange = document.getElementById('audio-gate-range');
    const gateVal = document.getElementById('audio-gate-val');

    if (chSel) chSel.value = pitchDetector.channelMode;
    if (gainRange) gainRange.value = String(pitchDetector.inputGainValue);
    if (gainVal) gainVal.textContent = `${pitchDetector.inputGainValue.toFixed(2)}x`;
    if (gateRange) gateRange.value = String(pitchDetector.noiseGate);

    powerBtn?.addEventListener('click', async () => {
      if (pitchDetector.isListening) {
        pitchDetector.stop();
      } else {
        try {
          await pitchDetector.start(devSel?.value || 'default');
          await this._populateAudioDevices();
          this.awardXP(10, 'Guitarra / Micrófono conectado');
        } catch (err) {
          const guide = document.getElementById('tuner-guidance-msg');
          if (guide) {
            guide.textContent = '⚠️ Permite el acceso al micrófono/entrada de audio en tu navegador para detectar tu guitarra.';
          }
        }
      }
    });

    refreshBtn?.addEventListener('click', () => this._populateAudioDevices());

    devSel?.addEventListener('change', async () => {
      if (pitchDetector.isListening) {
        await pitchDetector.start(devSel.value);
      } else {
        pitchDetector.selectedDeviceId = devSel.value;
      }
    });

    chSel?.addEventListener('change', () => {
      pitchDetector.setChannelMode(chSel.value);
    });

    gainRange?.addEventListener('input', () => {
      const v = parseFloat(gainRange.value);
      pitchDetector.setInputGain(v);
      if (gainVal) gainVal.textContent = `${v.toFixed(2)}x`;
    });

    gateRange?.addEventListener('input', () => {
      const v = parseFloat(gateRange.value);
      pitchDetector.setNoiseGate(v);
      if (gateVal) {
        gateVal.textContent = v < 0.01 ? 'Muy Sensible' : (v < 0.025 ? 'Equilibrado' : 'Ambiente Ruidoso');
      }
    });
  }

  _renderTunerRefButtons() {
    const wrap = document.getElementById('tuner-ref-buttons');
    if (!wrap) return;
    wrap.innerHTML = STRING_LABELS_6_TO_1.map(st => {
      const col = NOTE_COLORS[st.note] || NOTE_COLORS.E;
      return `
        <button class="ref-str-3d-btn" data-refmidi="${st.midi}" style="background:${col.bg};border-bottom-color:${col.border};color:${col.text}">
          <strong>${st.num}ª · ${st.note}</strong>
          <small>${st.noteEs} (${Math.round(st.freq)}Hz)</small>
        </button>
      `;
    }).join('');

    wrap.querySelectorAll('[data-refmidi]').forEach(btn => {
      btn.addEventListener('click', () => {
        audioEngine.playMidi(Number(btn.dataset.refmidi), 2.2, 0.85);
      });
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new CuerdaVivaApp();
  app.init();
});
