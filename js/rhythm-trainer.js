// ============================================================================
// js/rhythm-trainer.js
// Laboratorio Visual de Rasgueos, Arpegios y Percusión Folclórica/Litúrgica:
// Integra los patrones de Bono 2 (Cancionero Digital), la taxonomía de mano derecha
// de Carlos Mario Vásquez ("Entre Cuerdas de Guitarra") y los aires del Vallenato y Cumbia.
// ============================================================================

import { audioEngine } from './audio-engine.js';
import { renderChordSVG } from './chords-db.js';
import { formatChordLabel } from './music-theory.js';

export const STEP_META = {
  'D':  { symbol: '↓', label: 'Bajada',    hand: 'i·m·a ↓', color: '#58CC02', border: '#46A302', text: '#FFFFFF', desc: 'Rasguea de grave a aguda moviendo la muñeca suelta.' },
  'U':  { symbol: '↑', label: 'Subida',    hand: 'Pulgar/Índice ↑', color: '#FFC800', border: '#D9A600', text: '#2B2100', desc: 'Sube suave rozando solo las 3 primeras cuerdas agudas.' },
  'B1': { symbol: 'B1', label: 'Bajo 1',   hand: 'Pulgar (Raíz)', color: '#1CB0F6', border: '#148AC2', text: '#FFFFFF', desc: 'Pulgar pulsa la cuerda fundamental del acorde (Bajo Primario).' },
  'B':  { symbol: 'B1', label: 'Bajo 1',   hand: 'Pulgar (Raíz)', color: '#1CB0F6', border: '#148AC2', text: '#FFFFFF', desc: 'Pulgar pulsa la cuerda fundamental del acorde.' },
  'B2': { symbol: 'B2', label: 'Bajo 2',   hand: 'Pulgar (5ª)', color: '#00CD9C', border: '#00A37B', text: '#FFFFFF', desc: 'Pulgar alterna al Bajo Secundario (quinta del acorde): ¡clave del Vallenato y Vals!' },
  'X':  { symbol: '✕', label: 'Apagado',   hand: 'Chasquido/Palma', color: '#FF4B4B', border: '#D33131', text: '#FFFFFF', desc: 'Apoya el borde de la palma mientras las uñas rozan las primas (imita la caja/redoblante).' },
  'p':  { symbol: 'p', label: 'Pulgar',    hand: 'Bajo acorde', color: '#1CB0F6', border: '#148AC2', text: '#FFFFFF', desc: 'Pulgar en el bajo principal del acorde.' },
  'p2': { symbol: 'p2', label: 'Pulgar 2', hand: 'Bajo alterno', color: '#00CD9C', border: '#00A37B', text: '#FFFFFF', desc: 'Pulgar en el bajo secundario.' },
  'i':  { symbol: 'i', label: 'Índice',    hand: '3ª cuerda (Sol)', color: '#CE82FF', border: '#A55EEA', text: '#FFFFFF', desc: 'Dedo índice pulsa la 3ª cuerda hacia la palma.' },
  'm':  { symbol: 'm', label: 'Medio',     hand: '2ª cuerda (Si)', color: '#FF9600', border: '#D67B00', text: '#FFFFFF', desc: 'Dedo medio pulsa la 2ª cuerda.' },
  'a':  { symbol: 'a', label: 'Anular',    hand: '1ª cuerda (Mi)', color: '#FF78C4', border: '#E052A0', text: '#FFFFFF', desc: 'Dedo anular pulsa la 1ª cuerda aguda.' },
  '-':  { symbol: '·', label: 'Aire',      hand: 'Mano sigue', color: '#E2E8F0', border: '#CBD5E1', text: '#64748B', desc: 'No tocas las cuerdas, pero tu mano sigue el vaivén constante.' }
};

export const RHYTHM_PATTERNS = {
  // ======================== LITÚRGICOS Y ALABANZA ========================
  pop_folk: {
    id: 'pop_folk',
    name: 'Balada Básica / Pop Litúrgico',
    category: 'liturgico',
    meter: '4/4',
    subdivision: 2,
    bpm: 84,
    steps: ['D', '-', 'D', 'U', '-', 'U', 'D', 'U'],
    counts: ['1', 'y', '2', 'y', '3', 'y', '4', 'y'],
    syllables: ['VOY', '(', 'PIE', 'DRA', ')', 'TA', 'PIE', 'DRA'],
    percussion: ['bombo', null, 'shaker', 'shaker', 'bombo', 'shaker', 'caja_slap', 'shaker'],
    usage: 'El rasgueo #1 más usado en Misa y Alabanza: Dios Está Aquí, Alma Misionera, Nadie Te Ama Como Yo.',
    exampleChords: ['G', 'D', 'Em', 'C']
  },
  balada_pop: {
    id: 'balada_pop',
    name: 'Balada de Adoración Fluida',
    category: 'liturgico',
    meter: '4/4',
    subdivision: 2,
    bpm: 74,
    steps: ['B1', '-', 'D', 'U', '-', 'U', 'D', 'U'],
    counts: ['1', 'y', '2', 'y', '3', 'y', '4', 'y'],
    syllables: ['BA-JO', '·', 'BA', 'JA', '·', 'SU', 'BA', 'SU'],
    percussion: ['bombo', null, 'shaker', null, 'bombo', 'shaker', 'caja_slap', 'shaker'],
    usage: 'Combina el peso del Bajo Primario en el tiempo 1 con el vaivén de balada: Cinco Panes, Tan Cerca de Mí.',
    exampleChords: ['D', 'A', 'Bm', 'G']
  },
  balada_bajo: {
    id: 'balada_bajo',
    name: 'Balada Suave con Bajo Alterno',
    category: 'liturgico',
    meter: '4/4',
    subdivision: 2,
    bpm: 68,
    steps: ['B1', '-', 'D', 'U', 'B2', '-', 'D', 'U'],
    counts: ['1', 'y', '2', 'y', '3', 'y', '4', 'y'],
    syllables: ['B1', '·', 'PIE', 'DRA', 'B2', '·', 'PIE', 'DRA'],
    percussion: ['bombo', null, 'shaker', null, 'bombo', null, 'shaker', null],
    usage: 'Comunión, Ofertorio y Meditación íntima (Pescador de Hombres en 4/4, Hambre de Dios).',
    exampleChords: ['C', 'Am', 'F', 'G7']
  },
  pop_apagado: {
    id: 'pop_apagado',
    name: 'Alabanza Alegre con Apagado (Chasquido)',
    category: 'liturgico',
    meter: '4/4',
    subdivision: 2,
    bpm: 104,
    steps: ['D', '-', 'X', 'U', '-', 'U', 'X', 'U'],
    counts: ['1', 'y', '2', 'y', '3', 'y', '4', 'y'],
    syllables: ['VOY', '·', 'CHAS', 'Y', '·', 'Y', 'CHAS', 'Y'],
    percussion: ['bombo', 'shaker', 'caja_slap', 'shaker', 'bombo', 'shaker', 'caja_slap', 'shaker'],
    usage: 'Cantos juveniles, Entrada festiva, Pascua y Gloria ("El Dios de la Vida", "Somos un pueblo que camina").',
    exampleChords: ['D', 'A', 'Bm', 'G']
  },
  marcha: {
    id: 'marcha',
    name: 'Corito de Alabanza / Marcha (2/4)',
    category: 'liturgico',
    meter: '2/4',
    subdivision: 2,
    bpm: 112,
    steps: ['B1', 'U', 'X', 'U', 'B2', 'U', 'D', 'U'],
    counts: ['1', 'y', '2', 'y', '1', 'y', '2', 'y'],
    syllables: ['B1', 'Y', 'CHAS', 'Y', 'B2', 'Y', 'RA', 'Y'],
    percussion: ['bombo', 'shaker', 'caja_slap', 'shaker', 'bombo', 'shaker', 'caja_slap', 'shaker'],
    usage: 'Coritos avivados: "A edificar la iglesia", "Alabaré", "Den gloria a Dios", "Yo tengo un amigo".',
    exampleChords: ['E', 'F#m', 'B7', 'E']
  },
  vals: {
    id: 'vals',
    name: 'Vals Litúrgico y Mariano (3/4)',
    category: 'liturgico',
    meter: '3/4',
    subdivision: 2,
    bpm: 98,
    steps: ['B1', '-', 'D', 'U', 'D', '-'],
    counts: ['1', 'y', '2', 'y', '3', 'y'],
    syllables: ['UN (Bajo)', '·', 'DOS', 'Y', 'TRES', '·'],
    percussion: ['bombo', null, 'shaker', null, 'shaker', null],
    usage: 'Cantos a la Virgen María, Villancicos y "Cien Ovejas", "María de Nazaret".',
    exampleChords: ['D', 'A7', 'G', 'D']
  },
  seis_ocho: {
    id: 'seis_ocho',
    name: 'Adoración en 6/8 (Seis por Ocho)',
    category: 'liturgico',
    meter: '6/8',
    subdivision: 3,
    bpm: 58,
    steps: ['B1', 'D', 'U', 'D', 'D', 'U'],
    counts: ['1', '2', '3', '4', '5', '6'],
    syllables: ['RÁ', 'PI', 'DO', 'RÁ', 'PI', 'DO'],
    percussion: ['bombo', 'shaker', 'shaker', 'caja_slap', 'shaker', 'shaker'],
    usage: 'Mecido solemne de comunión: "Pescador de Hombres", "Milagro de Amor". Acentúa el 1 y el 4.',
    exampleChords: ['C', 'G', 'Am', 'F']
  },
  negras: {
    id: 'negras',
    name: 'Pulso Estable en Negras (Nivel Día 1)',
    category: 'liturgico',
    meter: '4/4',
    subdivision: 2,
    bpm: 72,
    steps: ['D', '-', 'D', '-', 'D', '-', 'D', '-'],
    counts: ['1', 'y', '2', 'y', '3', 'y', '4', 'y'],
    syllables: ['VOY', '·', 'VOY', '·', 'VOY', '·', 'VOY', '·'],
    percussion: ['click_hi', null, 'click_lo', null, 'click_lo', null, 'click_lo', null],
    usage: 'Del Reto de 30 Días (Semana 1 y 2): ideal para practicar cambios de acordes a tiempo sin perder el pulso.',
    exampleChords: ['C', 'G', 'Am', 'Em']
  },

  // ======================== VALLENATO Y FOLCLOR COLOMBIANO ========================
  paseo_vallenato: {
    id: 'paseo_vallenato',
    name: 'Paseo Vallenato Clásico (Guitarra + Caja + Guacharaca)',
    category: 'vallenato',
    meter: '4/4',
    subdivision: 2,
    bpm: 92,
    steps: ['B1', 'U', 'X', 'D', 'B2', '-', 'D', 'U'],
    counts: ['1', 'y', '2', 'y', '3', 'y', '4', 'y'],
    syllables: ['B1', 'GUA', 'CA-JA', 'RA', 'B2', '·', 'PA', 'SEO'],
    percussion: ['caja_bajo', 'guacharaca', 'caja_slap', 'guacharaca_long', 'caja_bajo', 'guacharaca', 'caja_slap', 'guacharaca'],
    usage: '¡El rey del Vallenato! Los Caminos de la Vida, Ausencia Sentimental, Sin Medir Distancias, Matilde Lina, Alicia Adorada.',
    exampleChords: ['C', 'G7', 'F', 'C']
  },
  merengue_vallenato: {
    id: 'merengue_vallenato',
    name: 'Merengue Vallenato Fiestero (6/8)',
    category: 'vallenato',
    meter: '6/8',
    subdivision: 3,
    bpm: 112,
    steps: ['B1', 'D', 'U', 'X', 'U', 'B2'],
    counts: ['1', '2', '3', '4', '5', '6'],
    syllables: ['UN', 'DOS', 'TRES', 'CA-JA', 'Y', 'BA-JO'],
    percussion: ['caja_bajo', 'guacharaca', 'guacharaca', 'caja_slap', 'guacharaca_long', 'caja_bajo'],
    usage: 'Aire rápido y sabroso de parranda vallenata (La Gota Fría en vivo, cantos de Rafael Escalona y Alejo Durán).',
    exampleChords: ['Am', 'E7', 'Am', 'E7']
  },
  son_vallenato: {
    id: 'son_vallenato',
    name: 'Son Vallenato Cadencioso',
    category: 'vallenato',
    meter: '4/4',
    subdivision: 2,
    bpm: 78,
    steps: ['B1', '-', 'X', 'D', 'B2', '-', 'B1', 'D'],
    counts: ['1', 'y', '2', 'y', '3', 'y', '4', 'y'],
    syllables: ['BÓN', '·', 'CHAS', 'RA', 'BÓN', '·', 'BÓN', 'RA'],
    percussion: ['caja_bajo', null, 'caja_slap', 'guacharaca_long', 'caja_bajo', null, 'caja_bajo', 'guacharaca'],
    usage: 'Aire lento y nostálgico donde el bajo de la guitarra es el protagonista absoluto (estilo Pacho Rada / Alejo Durán).',
    exampleChords: ['G', 'D7', 'C', 'G']
  },
  cumbia: {
    id: 'cumbia',
    name: 'Cumbia Colombiana Tradicional',
    category: 'vallenato',
    meter: '4/4',
    subdivision: 2,
    bpm: 94,
    steps: ['B1', 'U', 'X', 'U', 'B2', 'U', 'X', 'U'],
    counts: ['1', 'y', '2', 'y', '3', 'y', '4', 'y'],
    syllables: ['TUM', 'PA', 'CHAS', 'CA', 'TUM', 'PA', 'CHAS', 'CA'],
    percussion: ['alegre', 'llamador', 'maracon', 'llamador', 'alegre', 'llamador', 'maracon', 'llamador'],
    usage: 'La Piragua, Yo Me Llamo Cumbia y cantos litúrgicos de fiesta patronal ("El llamador entra siempre en el contratiempo y").',
    exampleChords: ['Am', 'G', 'F', 'E7']
  },
  porro_colombiano: {
    id: 'porro_colombiano',
    name: 'Porro Sabanero / Pelayero',
    category: 'vallenato',
    meter: '4/4',
    subdivision: 2,
    bpm: 108,
    steps: ['B1', '-', 'D', 'U', 'X', 'U', 'B2', 'D'],
    counts: ['1', 'y', '2', 'y', '3', 'y', '4', 'y'],
    syllables: ['BOM', '·', 'PO', 'RRO', 'CHAS', 'PA', 'B2', 'RA'],
    percussion: ['bombo', 'maracon', 'alegre', 'llamador', 'caja_slap', 'maracon', 'bombo', 'alegre'],
    usage: 'Carmen de Bolívar, Colombia Tierra Querida, Fiesta en Corraleja. ¡Alegre, brillante y sincopado!',
    exampleChords: ['Dm', 'A7', 'Dm', 'D']
  },
  pasillo_colombiano: {
    id: 'pasillo_colombiano',
    name: 'Pasillo Andino Colombiano (3/4)',
    category: 'vallenato',
    meter: '3/4',
    subdivision: 2,
    bpm: 126,
    steps: ['B1', 'U', 'X', 'U', 'B2', 'D'],
    counts: ['1', 'y', '2', 'y', '3', 'y'],
    syllables: ['PA', 'SI', 'LLO', 'Y', 'BA-JO', 'CA-E'],
    percussion: ['caja_bajo', 'shaker', 'caja_slap', 'shaker', 'caja_bajo', 'guacharaca'],
    usage: 'Ritmo estrella del libro "Haga Música con la Guitarra" (Keyner Ramírez): Espumas, Oropel, Pescador Lucero y Río, Las Acacias.',
    exampleChords: ['Em', 'B7', 'Am', 'Em']
  },
  bambuco_colombiano: {
    id: 'bambuco_colombiano',
    name: 'Bambuco Tradicional (Síncopa 6/8)',
    category: 'vallenato',
    meter: '6/8',
    subdivision: 3,
    bpm: 114,
    steps: ['B1', 'D', 'X', 'B2', 'D', 'X'],
    counts: ['1', '2', '3', '4', '5', '6'],
    syllables: ['BAM', 'BU', 'CO', 'BA-JO', 'Y', 'CHAS'],
    percussion: ['bombo', 'shaker', 'caja_slap', 'bombo', 'shaker', 'caja_slap'],
    usage: 'El aire andino nacional de Colombia: acento en el apagado 3 y 6 con alternancia constante de bajos.',
    exampleChords: ['Am', 'E7', 'Dm', 'Am']
  },
  guabina_andina: {
    id: 'guabina_andina',
    name: 'Guabina & Torbellino Suave (3/4)',
    category: 'vallenato',
    meter: '3/4',
    subdivision: 2,
    bpm: 98,
    steps: ['B1', '-', 'D', 'U', 'B2', 'D'],
    counts: ['1', 'y', '2', 'y', '3', 'y'],
    syllables: ['GUA', '·', 'BI', 'NA', 'B2', 'SUA'],
    percussion: ['bombo', null, 'shaker', 'shaker', 'caja_bajo', 'shaker'],
    usage: 'Cadencia dulce de Santander, Boyacá y Tolima; puente perfecto para dominar el Bajo Alterno en 3/4.',
    exampleChords: ['D', 'A7', 'G', 'D']
  },
  bolero_clasico: {
    id: 'bolero_clasico',
    name: 'Bolero Clásico de Serenata (4/4)',
    category: 'liturgico',
    meter: '4/4',
    subdivision: 2,
    bpm: 78,
    steps: ['B1', '-', 'D', 'U', 'X', 'U', 'B2', 'D'],
    counts: ['1', 'y', '2', 'y', '3', 'y', '4', 'y'],
    syllables: ['BO', '·', 'LE', 'RO', 'CHAS', 'Y', 'B2', 'RA'],
    percussion: ['bombo', null, 'maracon', 'maracon', 'caja_slap', 'maracon', 'bombo', 'maracon'],
    usage: 'Muy presente en serenatas románticas y alabanzas meditativas suaves.',
    exampleChords: ['Am', 'Dm', 'G7', 'C']
  },

  // ======================== ARPEGIOS CLÁSICOS ========================
  arp_44_pima: {
    id: 'arp_44_pima',
    name: 'Arpegio Clásico p-i-m-a-m-i (Carulli / Comunión)',
    category: 'arpegio',
    meter: '4/4',
    subdivision: 2,
    bpm: 70,
    steps: ['p', 'i', 'm', 'a', 'p2', 'i', 'm', 'a'],
    counts: ['1', 'y', '2', 'y', '3', 'y', '4', 'y'],
    syllables: ['Pulgar', 'Índ.', 'Med.', 'Anul.', 'Bajo 2', 'Índ.', 'Med.', 'Anul.'],
    percussion: ['click_hi', null, null, null, 'click_lo', null, null, null],
    usage: 'Hora Santa, Comunión, introducciones de baladas vallenatas y "Nadie te ama como yo".',
    exampleChords: ['C', 'G/B', 'Am', 'Fmaj7']
  }
};

const EDIT_CYCLE = ['D', 'U', 'B1', 'B2', 'X', 'p', 'i', 'm', 'a', '-'];

export class RhythmTrainer {
  constructor(containerEl, onAwardXP = null) {
    this.container = containerEl;
    this.onAwardXP = onAwardXP;

    this.currentCategory = 'all';
    this.currentPatternId = 'paseo_vallenato';
    this.customSteps = [...RHYTHM_PATTERNS.paseo_vallenato.steps];
    this.bpm = RHYTHM_PATTERNS.paseo_vallenato.bpm;
    this.chordProgression = [...RHYTHM_PATTERNS.paseo_vallenato.exampleChords];
    this.enablePercussion = true;
    this.enableGuitar = true;

    this.isPlaying = false;
    this.activeStep = -1;
    this.activeBar = 0;
    this.barsPlayed = 0;
    this.timerId = null;
  }

  init() {
    this.selectPattern('paseo_vallenato');
  }

  selectPattern(id) {
    this.stop();
    const pat = RHYTHM_PATTERNS[id] || RHYTHM_PATTERNS.pop_folk;
    this.currentPatternId = pat.id;
    this.customSteps = [...pat.steps];
    this.bpm = pat.bpm;
    this.chordProgression = [...pat.exampleChords];
    this.activeStep = -1;
    this.activeBar = 0;
    this.render();
  }

  stop() {
    this.isPlaying = false;
    this.activeStep = -1;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this._refreshHighlight();
    const btn = this.container?.querySelector('#rt-btn-play');
    if (btn) {
      btn.textContent = '▶ ¡Sonar Rasgueo y Percusión!';
      btn.className = 'duo-btn btn-green btn-lg';
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stop();
      return;
    }
    this.isPlaying = true;
    this.activeStep = 0;
    this.activeBar = 0;
    this.barsPlayed = 0;
    audioEngine.init();

    const btn = this.container?.querySelector('#rt-btn-play');
    if (btn) {
      btn.textContent = '⏹ Detener Ritmo';
      btn.className = 'duo-btn btn-orange btn-lg';
    }
    this._tick();
  }

  _tick() {
    if (!this.isPlaying) return;
    const pat = RHYTHM_PATTERNS[this.currentPatternId];
    const stepDurSec = 60 / this.bpm / (pat.subdivision || 2);
    const currentChord = this.chordProgression[this.activeBar % this.chordProgression.length] || 'C';
    const stepCode = this.customSteps[this.activeStep];

    if (this.enableGuitar) {
      audioEngine.playPatternStep(stepCode, currentChord, stepDurSec);
    }
    if (this.enablePercussion && pat.percussion) {
      const perc = pat.percussion[this.activeStep % pat.percussion.length];
      if (perc) audioEngine.playPercussion(perc);
    }

    this._refreshHighlight();

    this.timerId = setTimeout(() => {
      if (!this.isPlaying) return;
      this.activeStep++;
      if (this.activeStep >= this.customSteps.length) {
        this.activeStep = 0;
        this.activeBar = (this.activeBar + 1) % this.chordProgression.length;
        this.barsPlayed++;
        if (this.barsPlayed > 0 && this.barsPlayed % 4 === 0 && this.onAwardXP) {
          this.onAwardXP(5, 'Práctica constante de rasgueo');
        }
      }
      this._tick();
    }, stepDurSec * 1000);
  }

  render() {
    if (!this.container) return;
    const pat = RHYTHM_PATTERNS[this.currentPatternId];
    const allPatterns = Object.values(RHYTHM_PATTERNS);
    const filtered = this.currentCategory === 'all'
      ? allPatterns
      : allPatterns.filter(p => p.category === this.currentCategory);

    const activeChord = this.chordProgression[this.activeBar % this.chordProgression.length] || 'C';

    this.container.innerHTML = `
      <div class="rhythm-studio-layout">
        <!-- Selector de Ritmos -->
        <div class="duo-card">
          <div class="tab-cat-pills">
            <button class="duo-pill ${this.currentCategory === 'all' ? 'active' : ''}" data-rcat="all">🌟 Todos los Ritmos (${allPatterns.length})</button>
            <button class="duo-pill pill-orange ${this.currentCategory === 'vallenato' ? 'active' : ''}" data-rcat="vallenato">🪗 Vallenato, Pasillo, Cumbia y Porro</button>
            <button class="duo-pill pill-blue ${this.currentCategory === 'liturgico' ? 'active' : ''}" data-rcat="liturgico">🕊️ Alabanza, Misa y Adoración</button>
            <button class="duo-pill pill-purple ${this.currentCategory === 'arpegio' ? 'active' : ''}" data-rcat="arpegio">🎶 Arpegios Clásicos</button>
          </div>

          <div class="rhythm-cards-strip">
            ${filtered.map(p => `
              <button class="rhythm-pick-card ${p.id === pat.id ? 'selected' : ''}" data-rpat="${p.id}">
                <span class="rp-meter">${p.meter}</span>
                <strong>${p.name}</strong>
                <small>${p.bpm} BPM</small>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Panel Principal Animado de Rasgueo -->
        <div class="duo-card rhythm-stage-card">
          <div class="rhythm-stage-header">
            <div>
              <div class="tab-badges-line">
                <span class="badge-vivid badge-purple">Compás ${pat.meter}</span>
                <span class="badge-vivid badge-green" id="rt-bpm-badge">♩ = ${this.bpm} BPM</span>
              </div>
              <h2>${pat.name}</h2>
              <p class="tab-subtitle">${pat.usage}</p>
            </div>

            <div class="rhythm-main-cta">
              <button id="rt-btn-play" class="duo-btn ${this.isPlaying ? 'btn-orange' : 'btn-green'} btn-lg">
                ${this.isPlaying ? '⏹ Detener Ritmo' : '▶ ¡Sonar Rasgueo y Percusión!'}
              </button>
            </div>
          </div>

          <!-- Fila de Casillas 3D de Rasgueo (Clickeables para personalizar) -->
          <div class="strum-tiles-grid" style="grid-template-columns: repeat(${this.customSteps.length}, minmax(74px, 1fr));">
            ${this.customSteps.map((code, idx) => {
              const meta = STEP_META[code] || STEP_META['-'];
              const countLbl = pat.counts[idx] || '';
              const sylLbl = pat.syllables[idx] || '';
              return `
                <div class="strum-step-col ${idx === this.activeStep ? 'step-active' : ''}" data-sidx="${idx}">
                  <span class="strum-count-top ${/^\d+$/.test(countLbl) ? 'strong-beat' : ''}">${countLbl}</span>
                  <button
                    class="strum-3d-tile"
                    style="--tile-bg:${meta.color}; --tile-border:${meta.border}; --tile-txt:${meta.text};"
                    title="${meta.desc} (Haz clic para editar este golpe)"
                  >
                    <span class="strum-big-arrow">${meta.symbol}</span>
                    <span class="strum-tile-lbl">${meta.label}</span>
                    <span class="strum-hand-hint">${meta.hand}</span>
                  </button>
                  <span class="strum-syllable-chip">${sylLbl}</span>
                </div>
              `;
            }).join('')}
          </div>

          <p class="edit-pattern-hint">
            ✨ <strong>Laboratorio Interactivo:</strong> Haz clic encima de cualquier casilla de color para cambiar su golpe (<code>↓</code>, <code>↑</code>, <code>B1</code>, <code>B2</code>, <code>✕ Apagado</code>, <code>p-i-m-a</code>) y crear tus propias variaciones.
            <button id="rt-reset-steps" class="link-reset-btn">Restaurar patrón original</button>
          </p>

          <!-- Controles de Tempo, Mezcla y Progresión en Vivo -->
          <div class="rhythm-bottom-panels">
            <div class="rhythm-controls-panel">
              <h4>🎛️ Velocidad y Mezcla de Estudio</h4>
              <div class="slider-row">
                <label for="rt-bpm-slider">Velocidad (BPM): <strong id="rt-bpm-val">${this.bpm}</strong></label>
                <input type="range" id="rt-bpm-slider" min="45" max="145" value="${this.bpm}" class="duo-range" />
              </div>
              <div class="preset-tempos">
                <button class="mini-pill" data-setbpm="60">🐢 60 Lento</button>
                <button class="mini-pill" data-setbpm="80">🚶 80 Cómodo</button>
                <button class="mini-pill" data-setbpm="96">💃 96 Real</button>
                <button class="mini-pill" data-setbpm="116">🔥 116 Fiesta</button>
              </div>
              <div class="toggle-checks-row">
                <label class="duo-checkbox">
                  <input type="checkbox" id="rt-chk-guitar" ${this.enableGuitar ? 'checked' : ''} />
                  <span>🎸 Guitarra Acústica</span>
                </label>
                <label class="duo-checkbox">
                  <input type="checkbox" id="rt-chk-perc" ${this.enablePercussion ? 'checked' : ''} />
                  <span>🥁 Caja Vallenata / Guacharaca / Cajón</span>
                </label>
              </div>

              <h4 style="margin-top:14px;">🔄 Progresión de Práctica (1 compás por acorde)</h4>
              <div class="prog-preset-btns">
                <button class="mini-pill" data-prog="G,D,Em,C">Alabanza: G-D-Em-C</button>
                <button class="mini-pill" data-prog="C,G7,F,C">Vallenato: C-G7-F-C</button>
                <button class="mini-pill" data-prog="Am,E7,Am,E7">Gota Fría: Am-E7</button>
                <button class="mini-pill" data-prog="D,A,Bm,G">Dios Está Aquí: D-A-Bm-G</button>
                <button class="mini-pill" data-prog="C,Am,Dm,G7">Círculo de Do</button>
              </div>
              <div class="active-prog-strip">
                ${this.chordProgression.map((ch, bIdx) => `
                  <button class="prog-chord-pill ${bIdx === this.activeBar ? 'bar-active' : ''}" data-baridx="${bIdx}">
                    ${formatChordLabel(ch, 'dual')}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="rhythm-live-chord-panel">
              <h4>🎸 Acorde Sonando Ahora</h4>
              <div id="rt-live-chord-svg" class="rt-chord-svg-wrap">
                ${renderChordSVG(activeChord, { width: 175, height: 215, showBasses: true })}
              </div>
              <span class="bass-legend-mini">
                <b style="color:#1CB0F6">B1</b> = Bajo Primario &nbsp;|&nbsp; <b style="color:#00CD9C">B2</b> = Bajo Secundario
              </span>
            </div>
          </div>

          <!-- Leyenda Visual del Método Entre Cuerdas & Bono 2 -->
          <div class="stroke-legend-strip">
            ${['B1', 'B2', 'D', 'U', 'X', 'p'].map(k => {
              const m = STEP_META[k];
              return `
                <div class="legend-item-pill">
                  <span class="leg-dot" style="background:${m.color};color:${m.text}">${m.symbol}</span>
                  <div><strong>${m.label}:</strong> ${m.desc}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
  }

  _bindEvents() {
    this.container.querySelectorAll('[data-rcat]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCategory = btn.dataset.rcat;
        this.render();
      });
    });

    this.container.querySelectorAll('[data-rpat]').forEach(btn => {
      btn.addEventListener('click', () => this.selectPattern(btn.dataset.rpat));
    });

    const playBtn = this.container.querySelector('#rt-btn-play');
    if (playBtn) playBtn.addEventListener('click', () => this.togglePlay());

    // Editar golpe al hacer clic en casilla
    this.container.querySelectorAll('.strum-step-col').forEach(col => {
      col.addEventListener('click', () => {
        const idx = parseInt(col.dataset.sidx, 10);
        const curr = this.customSteps[idx];
        const nextCode = EDIT_CYCLE[(EDIT_CYCLE.indexOf(curr) + 1) % EDIT_CYCLE.length];
        this.customSteps[idx] = nextCode;
        const ch = this.chordProgression[this.activeBar] || 'C';
        audioEngine.playPatternStep(nextCode, ch, 0.3);
        this.render();
      });
    });

    const resetBtn = this.container.querySelector('#rt-reset-steps');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.customSteps = [...RHYTHM_PATTERNS[this.currentPatternId].steps];
        this.render();
      });
    }

    const slider = this.container.querySelector('#rt-bpm-slider');
    if (slider) {
      slider.addEventListener('input', () => {
        this.bpm = parseInt(slider.value, 10);
        const v1 = this.container.querySelector('#rt-bpm-val');
        const v2 = this.container.querySelector('#rt-bpm-badge');
        if (v1) v1.textContent = String(this.bpm);
        if (v2) v2.textContent = `♩ = ${this.bpm} BPM`;
      });
    }

    this.container.querySelectorAll('[data-setbpm]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.bpm = parseInt(btn.dataset.setbpm, 10);
        this.render();
      });
    });

    const chkG = this.container.querySelector('#rt-chk-guitar');
    if (chkG) chkG.addEventListener('change', () => { this.enableGuitar = chkG.checked; });

    const chkP = this.container.querySelector('#rt-chk-perc');
    if (chkP) chkP.addEventListener('change', () => { this.enablePercussion = chkP.checked; });

    this.container.querySelectorAll('[data-prog]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.chordProgression = btn.dataset.prog.split(',');
        this.activeBar = 0;
        this.render();
      });
    });

    this.container.querySelectorAll('[data-baridx]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeBar = parseInt(btn.dataset.baridx, 10);
        const ch = this.chordProgression[this.activeBar];
        audioEngine.strumChord(ch, 'down');
        this._refreshHighlight();
      });
    });
  }

  _refreshHighlight() {
    if (!this.container) return;
    this.container.querySelectorAll('.strum-step-col').forEach(col => {
      const idx = parseInt(col.dataset.sidx, 10);
      col.classList.toggle('step-active', idx === this.activeStep);
    });
    this.container.querySelectorAll('.prog-chord-pill').forEach(pill => {
      const bIdx = parseInt(pill.dataset.baridx, 10);
      pill.classList.toggle('bar-active', bIdx === this.activeBar);
    });
    const svgWrap = this.container.querySelector('#rt-live-chord-svg');
    if (svgWrap) {
      const ch = this.chordProgression[this.activeBar % this.chordProgression.length] || 'C';
      svgWrap.innerHTML = renderChordSVG(ch, { width: 175, height: 215, showBasses: true });
    }
  }
}
