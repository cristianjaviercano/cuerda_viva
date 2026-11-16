// ============================================================================
// js/practice-metrics.js
// Métricas objetivas de ejecución (funciones puras, sin DOM ni Web Audio):
//  - Detección de ataques (onsets) a partir de la envolvente RMS.
//  - Precisión rítmica frente a una rejilla de pulsos (ms de desviación).
//  - Conteo de cambios de acorde estables en una ventana de tiempo.
//  - Generación de rondas de entrenamiento auditivo (Mayor vs. menor).
// ============================================================================

/**
 * Detector de ataques por envolvente: un ataque es una subida brusca de RMS
 * sobre el nivel de fondo adaptativo, con un periodo refractario.
 */
export class OnsetDetector {
  constructor({ ratio = 1.8, minRms = 0.01, refractoryMs = 120, riseFactor = 1.25 } = {}) {
    this.ratio = ratio;
    this.minRms = minRms;
    this.refractoryMs = refractoryMs;
    this.riseFactor = riseFactor;
    this.floor = 0;
    this.prev = 0;
    this.lastOnset = -Infinity;
  }

  /** @returns {boolean} true si en el instante tMs comienza un ataque */
  push(rms, tMs) {
    const isOnset =
      rms >= this.minRms &&
      rms >= this.floor * this.ratio &&
      rms >= this.prev * this.riseFactor &&
      tMs - this.lastOnset >= this.refractoryMs;
    if (isOnset) this.lastOnset = tMs;
    // El fondo sigue lentamente a la señal (también durante el decaimiento).
    this.floor = this.floor === 0 ? rms : this.floor * 0.85 + rms * 0.15;
    this.prev = rms;
    return isOnset;
  }
}

/** Tiempos (ms) de los pulsos a evaluar. */
export function beatGrid(startMs, bpm, count) {
  const interval = 60000 / bpm;
  return Array.from({ length: count }, (_, i) => startMs + i * interval);
}

/**
 * Compara ataques con la rejilla de pulsos.
 * Cada pulso se empareja con el ataque más cercano dentro de ±medio intervalo.
 * @returns {{ hits:number, total:number, hitRate:number, meanAbsMs:number,
 *            meanSignedMs:number, missed:number, extra:number, deviations:(number|null)[] }}
 *   meanSignedMs > 0 = tarde (arrastra), < 0 = adelantado (acelera).
 */
export function scoreTiming(onsetsMs, beatsMs, toleranceMs = 90) {
  const total = beatsMs.length;
  if (!total) {
    return { hits: 0, total: 0, hitRate: 0, meanAbsMs: 0, meanSignedMs: 0, missed: 0, extra: onsetsMs.length, deviations: [] };
  }
  const half = total > 1 ? (beatsMs[1] - beatsMs[0]) / 2 : 500;
  const used = new Set();
  const deviations = beatsMs.map(b => {
    let best = -1;
    let bestAbs = Infinity;
    onsetsMs.forEach((o, i) => {
      const d = Math.abs(o - b);
      if (!used.has(i) && d <= half && d < bestAbs) { best = i; bestAbs = d; }
    });
    if (best < 0) return null;
    used.add(best);
    return onsetsMs[best] - b;
  });
  const matched = deviations.filter(d => d !== null);
  const hits = matched.filter(d => Math.abs(d) <= toleranceMs).length;
  const mean = arr => (arr.length ? arr.reduce((a, v) => a + v, 0) / arr.length : 0);
  return {
    hits,
    total,
    hitRate: hits / total,
    meanAbsMs: Math.round(mean(matched.map(Math.abs))),
    meanSignedMs: Math.round(mean(matched)),
    missed: total - matched.length,
    extra: onsetsMs.length - used.size,
    deviations
  };
}

/** Frase diagnóstica sobre la tendencia del pulso. */
export function describeTimingTendency(meanSignedMs, thresholdMs = 25) {
  if (meanSignedMs > thresholdMs) return `Tiendes a ir tarde (+${meanSignedMs} ms): anticipa el movimiento de la mano.`;
  if (meanSignedMs < -thresholdMs) return `Tiendes a adelantarte (${meanSignedMs} ms): relaja y espera el pulso.`;
  return 'Pulso centrado: sin tendencia a adelantarte ni atrasarte.';
}

/**
 * Cuenta cambios entre dos acordes a partir de detecciones por cuadro.
 * Un acorde se considera "establecido" cuando su detección se sostiene
 * durante minHoldMs; se cuenta un cambio cada vez que el acorde establecido
 * pasa de A a B o de B a A. Los cuadros sin detección (null) no rompen el estado.
 * @param {{t:number, label:('A'|'B'|null)}[]} frames
 */
export function countChordChanges(frames, { minHoldMs = 200 } = {}) {
  let stable = null;
  let candidate = null;
  let candidateSince = 0;
  let changes = 0;
  for (const { t, label } of frames) {
    if (!label) continue;
    if (label !== candidate) {
      candidate = label;
      candidateSince = t;
    }
    if (candidate !== stable && t - candidateSince >= minHoldMs) {
      if (stable !== null) changes++;
      stable = candidate;
    }
  }
  return changes;
}

/** Versión incremental de countChordChanges para uso en tiempo real. */
export class ChordChangeCounter {
  constructor({ minHoldMs = 200 } = {}) {
    this.minHoldMs = minHoldMs;
    this.stable = null;
    this.candidate = null;
    this.candidateSince = 0;
    this.changes = 0;
  }

  /** @returns {boolean} true si este cuadro completó un cambio */
  push(label, tMs) {
    if (!label) return false;
    if (label !== this.candidate) {
      this.candidate = label;
      this.candidateSince = tMs;
    }
    if (this.candidate !== this.stable && tMs - this.candidateSince >= this.minHoldMs) {
      const counted = this.stable !== null;
      if (counted) this.changes++;
      this.stable = this.candidate;
      return counted;
    }
    return false;
  }
}

export const EAR_MAJOR_POOL = ['C', 'D', 'E', 'F', 'G', 'A'];
export const EAR_MINOR_POOL = ['Am', 'Dm', 'Em', 'Bm', 'F#m', 'Cm'];

/**
 * Rondas de discriminación auditiva Mayor/menor con raíz aleatoria:
 * cada intento (también en la remediación) presenta ítems nuevos.
 */
export function makeEarRounds(n, rng = Math.random) {
  return Array.from({ length: n }, () => {
    const quality = rng() < 0.5 ? 'major' : 'minor';
    const pool = quality === 'major' ? EAR_MAJOR_POOL : EAR_MINOR_POOL;
    return { chord: pool[Math.floor(rng() * pool.length)], quality };
  });
}
