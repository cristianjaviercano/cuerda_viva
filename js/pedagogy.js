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
