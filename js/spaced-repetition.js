// ============================================================================
// js/spaced-repetition.js
// Repaso espaciado (sistema Leitner) por teoría. Funciones puras, sin DOM.
//
// Cada teoría evaluada tiene una tarjeta { box, due, lastReviewed, reps, lapses }.
//  - Acierto  → sube una caja y el próximo repaso se aleja (INTERVALS_DAYS[box]).
//  - Fallo    → vuelve a la caja 0 y se repasa al día siguiente.
//  - Solo cuenta la práctica ESPACIADA: un segundo acierto el mismo día no sube
//    de caja (evita "dominar" una teoría repitiéndola en una sola sesión).
// Una teoría se considera dominada en la caja MASTERY_BOX (aciertos en ≥ 3 días distintos).
// ============================================================================

export const INTERVALS_DAYS = [1, 1, 3, 7, 14, 30];
export const MAX_BOX = INTERVALS_DAYS.length - 1;
export const MASTERY_BOX = 3;
export const REVIEW_SESSION_SIZE = 6;
export const WARMUP_SIZE = 2;

// Retos que no aportan evidencia en un repaso: se validan con la guitarra virtual sin tocar.
const REVIEW_EXCLUDED_TYPES = new Set(['theory', 'play_guitar_chord', 'play_guitar_note']);
// Retos largos (≥ 20 s): como máximo uno por sesión de repaso.
const LONG_DRILL_TYPES = new Set(['chord_change', 'strum_timing']);

/** Fecha local en formato YYYY-MM-DD. */
export function todayISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return todayISO(new Date(y, m - 1, d + days));
}

export function newCard() {
  return { box: 0, due: null, lastReviewed: null, reps: 0, lapses: 0 };
}

/** Devuelve una tarjeta nueva tras un intento (no muta la original). */
export function reviewCard(card, correct, today = todayISO()) {
  const c = { ...newCard(), ...(card || {}) };
  if (correct) {
    const spaced = c.lastReviewed !== today || c.reps === 0;
    if (spaced) c.box = Math.min(MAX_BOX, c.box + 1);
    c.reps += 1;
  } else {
    c.box = 0;
    c.lapses += 1;
    c.reps += 1;
  }
  c.lastReviewed = today;
  c.due = addDays(today, INTERVALS_DAYS[c.box]);
  return c;
}

/** Registra un intento en el mapa de tarjetas { theoryId: card } (inmutable). */
export function recordReview(srs, theoryId, correct, today = todayISO()) {
  if (!theoryId) return srs || {};
  const next = { ...(srs || {}) };
  next[theoryId] = reviewCard(next[theoryId], correct, today);
  return next;
}

export function isDue(card, today = todayISO()) {
  return Boolean(card && card.due && card.due <= today);
}

/** IDs de teoría pendientes hoy, primero las más atrasadas y de caja más baja. */
export function dueTheoryIds(srs, today = todayISO()) {
  return Object.entries(srs || {})
    .filter(([, c]) => isDue(c, today))
    .sort(([, a], [, b]) => (a.due < b.due ? -1 : a.due > b.due ? 1 : a.box - b.box))
    .map(([id]) => id);
}

/** Resumen para el panel: pendientes, en aprendizaje, dominadas y próximo repaso. */
export function srsSummary(srs, today = todayISO()) {
  const cards = Object.values(srs || {});
  const upcoming = cards.filter(c => c.due && c.due > today).map(c => c.due).sort();
  return {
    total: cards.length,
    due: cards.filter(c => isDue(c, today)).length,
    learning: cards.filter(c => c.box < MASTERY_BOX).length,
    mastered: cards.filter(c => c.box >= MASTERY_BOX).length,
    nextDue: upcoming[0] || null
  };
}

/** Todos los retos evaluables del currículo para una teoría. */
function candidatesFor(theoryId, units) {
  const out = [];
  for (const u of units || []) {
    for (const l of u.lessons || []) {
      (l.steps || []).forEach((step, idx) => {
        if (step.theoryId === theoryId && !REVIEW_EXCLUDED_TYPES.has(step.type)) {
          out.push({ questionId: `${l.id}_s${idx}`, lessonId: l.id, step, theoryId });
        }
      });
    }
  }
  return out;
}

/**
 * Selecciona los ítems de una sesión de repaso.
 *  - Una pregunta por teoría pendiente (intercalado entre temas).
 *  - Rota el ítem según las repeticiones de la tarjeta: no siempre la misma pregunta.
 *  - Como máximo un reto largo (cambios de acorde / pulso) por sesión.
 * @param {string[]} theoryIds teorías a repasar, en orden de prioridad
 * @param {object} options { max, excludeLessonId, srs }
 */
export function pickReviewItems(theoryIds, units, { max = REVIEW_SESSION_SIZE, excludeLessonId = null, srs = {} } = {}) {
  const items = [];
  let longUsed = false;
  for (const theoryId of theoryIds) {
    if (items.length >= max) break;
    let cands = candidatesFor(theoryId, units).filter(c => c.lessonId !== excludeLessonId);
    if (longUsed) cands = cands.filter(c => !LONG_DRILL_TYPES.has(c.step.type));
    if (!cands.length) continue;
    const reps = srs[theoryId]?.reps || 0;
    const pick = cands[reps % cands.length];
    if (LONG_DRILL_TYPES.has(pick.step.type)) longUsed = true;
    items.push(pick);
  }
  return items;
}
