// ============================================================================
// js/pedagogy.js
// Reglas pedagógicas puras (sin DOM) para la evaluación de lecciones:
//  - Barajado de opciones (elimina el sesgo de posición de la respuesta).
//  - Retroalimentación neutra cuando la respuesta es incorrecta.
//  - Economía de vidas: se pierden en la ronda inicial y se recuperan repasando.
// ============================================================================

export const MAX_HEARTS = 5;
export const HEARTS_RESTORED_AFTER_FAILED_LESSON = 2;
export const HEARTS_PER_REVIEW = 2;

/**
 * Devuelve una permutación aleatoria de [0..n-1] (Fisher–Yates).
 * @param {number} n
 * @param {() => number} rng generador uniforme en [0,1)
 */
export function shuffledOrder(n, rng = Math.random) {
  const order = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

/**
 * Elimina la interjección de elogio inicial ("¡Correcto!", "¡Exacto!"...)
 * para poder mostrar la explicación tras una respuesta incorrecta.
 */
export function neutralFeedback(text) {
  return String(text || '').replace(/^\s*¡[^!¡]{1,60}!\s*/, '');
}

/**
 * Descuenta una vida. Las vidas solo se pierden en la ronda inicial:
 * los errores durante la remediación forman parte del ciclo de aprendizaje.
 * @returns {{ hearts: number, depleted: boolean }}
 */
export function loseHeart(hearts, { isRemediation = false } = {}) {
  const current = Math.max(0, Math.min(MAX_HEARTS, Number(hearts) || 0));
  if (isRemediation) return { hearts: current, depleted: current <= 0 };
  const next = Math.max(0, current - 1);
  return { hearts: next, depleted: next === 0 };
}

/** Suma vidas sin superar el máximo. */
export function gainHearts(hearts, amount) {
  return Math.max(0, Math.min(MAX_HEARTS, (Number(hearts) || 0) + amount));
}

/**
 * Selecciona la teoría que debe repasarse para recuperar vidas:
 * 1) pendientes de la bitácora; 2) teorías falladas antes (ya consolidadas);
 * 3) una teoría de una lección completada. Sin historial devuelve null.
 */
export function pickReviewTheory(weakTheories, units, completedLessons, rng = Math.random) {
  const weak = weakTheories || [];
  const pending = weak.filter(w => w.needsReview);
  if (pending.length) return pending[0].theoryId;
  // Teorías falladas antes y ya consolidadas: práctica de recuperación espaciada.
  if (weak.length) return weak[Math.floor(rng() * weak.length)].theoryId;

  const done = new Set(completedLessons || []);
  const pool = [];
  for (const u of units || []) {
    for (const l of u.lessons || []) {
      if (!done.has(l.id)) continue;
      for (const s of l.steps || []) {
        if (s.type !== 'theory' && s.theoryId && !pool.includes(s.theoryId)) pool.push(s.theoryId);
      }
    }
  }
  if (!pool.length) return null;
  return pool[Math.floor(rng() * pool.length)];
}

// ============================================================================
// DISEÑO INSTRUCCIONAL (Parte E)
// ============================================================================

export const MAX_CHUNK_WORDS = 60;

export function countWords(text) {
  return String(text || '').replace(/[*`•]/g, ' ').split(/\s+/).filter(Boolean).length;
}

function splitLongLine(line, maxWords) {
  const sentences = line.match(/[^.!?]+[.!?]*\s*/g) || [line];
  const out = [];
  let cur = '';
  for (const sen of sentences) {
    if (cur && countWords(cur + sen) > maxWords) { out.push(cur.trim()); cur = ''; }
    cur += sen;
  }
  if (cur.trim()) out.push(cur.trim());
  // Último recurso: cortar por palabras si una oración sigue siendo demasiado larga.
  return out.flatMap(piece => {
    if (countWords(piece) <= maxWords) return [piece];
    const words = piece.split(/\s+/);
    const parts = [];
    for (let i = 0; i < words.length; i += maxWords) parts.push(words.slice(i, i + maxWords).join(' '));
    return parts;
  });
}

/**
 * Divide un texto teórico en "tarjetas" de una idea cada una (≤ maxWords):
 * cada viñeta (•) inicia una tarjeta nueva y una línea de introducción
 * acompaña a la primera viñeta si cabe.
 */
export function chunkTheory(body, maxWords = MAX_CHUNK_WORDS) {
  const lines = String(body || '').split('\n').map(l => l.trim()).filter(Boolean)
    .flatMap(l => (countWords(l) > maxWords ? splitLongLine(l, maxWords) : [l]));
  const chunks = [];
  let cur = [];
  let curHasBullet = false;
  for (const line of lines) {
    const isBullet = line.startsWith('•');
    const wouldOverflow = countWords([...cur, line].join(' ')) > maxWords;
    if (cur.length && (wouldOverflow || (isBullet && curHasBullet))) {
      chunks.push(cur.join('\n'));
      cur = [];
      curHasBullet = false;
    }
    cur.push(line);
    if (isBullet) curHasBullet = true;
  }
  if (cur.length) chunks.push(cur.join('\n'));
  return chunks.length ? chunks : [''];
}

/** Segundos modelados de un paso (supuestos iniciales, antes de tener datos). */
export function modelStepSeconds(st) {
  if (st.type === 'theory') return 40 * chunkTheory(st.body).length;
  if (st.type === 'quiz' || st.type === 'fretboard_find') return 30;
  if (st.type === 'play_guitar_chord' || st.type === 'play_guitar_note') return 60;
  if (st.type === 'ear_quality') return 15 * (st.rounds || 4) + 15;
  if (st.type === 'chord_change') return (st.durationSec || 30) + 45;
  if (st.type === 'strum_timing') return ((st.bars || 4) * (st.beatsPerBar || 4) + (st.beatsPerBar || 4)) * (60 / (st.bpm || 70)) + 40;
  return 30;
}

/**
 * Minutos estimados de una lección. Si se pasan medianas observadas por tipo
 * de reto ({ quiz: 22, ... } en segundos, ver item-analysis.observedSecondsByType),
 * reemplazan al modelo: la duración se calibra con datos reales.
 */
export function estimateLessonMinutes(lesson, observedSeconds = null) {
  let sec = 0;
  for (const st of lesson.steps || []) {
    const obs = observedSeconds && st.type !== 'theory' ? observedSeconds[st.type] : undefined;
    sec += Number.isFinite(obs) ? obs : modelStepSeconds(st);
  }
  return Math.max(1, Math.round(sec / 60));
}

/** Rúbrica de autoevaluación de cierre de unidad (niveles 1–3). */
export const SELF_ASSESSMENT_RUBRIC = [
  {
    id: 'limpieza', label: 'Limpieza', theoryId: 'minor_open_chords',
    levels: ['Varias cuerdas apagadas o trasteando', 'Alguna cuerda falla en los cambios', 'Todas las cuerdas suenan claras']
  },
  {
    id: 'pulso', label: 'Pulso', theoryId: 'strumming_44_engine',
    levels: ['Me detengo o acelero en los cambios', 'Pulso estable con alguna duda', 'Pulso constante de principio a fin']
  },
  {
    id: 'transiciones', label: 'Cambios de acorde', theoryId: 'major_open_chords',
    levels: ['Los cambios cortan el ritmo', 'Llego a tiempo pero con tensión', 'Cambios fluidos y anticipados']
  },
  {
    id: 'postura', label: 'Postura', theoryId: 'guitar_posture',
    levels: ['Tensión en hombros, muñeca o espalda', 'Postura correcta con algo de tensión', 'Relajado, con la tapa vertical']
  }
];

/**
 * Puntúa una autoevaluación { criterioId: 1|2|3 }.
 * Devuelve total, máximo y las teorías a repasar (criterios en nivel 1).
 */
export function scoreSelfAssessment(scores) {
  const max = SELF_ASSESSMENT_RUBRIC.length * 3;
  let total = 0;
  const reviewTheories = [];
  for (const c of SELF_ASSESSMENT_RUBRIC) {
    const v = Math.max(1, Math.min(3, Number(scores?.[c.id]) || 1));
    total += v;
    if (v === 1) reviewTheories.push(c.theoryId);
  }
  const level = total >= max - 1 ? 'Dominado' : total >= Math.ceil(max * 0.66) ? 'En progreso' : 'Necesita práctica';
  return { total, max, level, reviewTheories };
}
