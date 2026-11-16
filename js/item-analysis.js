// ============================================================================
// js/item-analysis.js
// Análisis de ítems (Teoría Clásica de los Tests) a partir de la bitácora.
// Funciones puras: se usan en el navegador (todos los perfiles locales) y en
// el servidor (/api/analytics/items).
//
// Por ítem (questionId), con la PRIMERA respuesta de cada estudiante en ronda
// inicial (no la remediación inmediata):
//  - p      : dificultad = proporción de aciertos.
//  - rpb    : discriminación punto-biserial corregida (ítem vs. % de acierto
//             del estudiante en el RESTO de ítems; controla el avance desigual).
//  - D      : índice superior − inferior (27% extremos según el resto).
//  - distractores: frecuencia de cada opción en las preguntas de opción múltiple.
//  - tiempo : mediana de durationMs.
//  - abandono: sesiones abandonadas justo en este ítem.
// ============================================================================

export const MIN_N_FLAGS = 10;        // respuestas mínimas para marcar un ítem
export const MIN_N_DISTRACTORS = 20;  // respuestas mínimas para juzgar distractores
export const THRESHOLDS = {
  tooEasy: 0.95,
  tooHard: 0.40,
  lowDiscrimination: 0.20,
  distractorMinShare: 0.05,
  highAbandon: 0.20
};

const FLAG_LABELS = {
  muy_facil: 'Muy fácil (p > 0,95): revisar distractores o subir el reto',
  muy_dificil: 'Muy difícil (p < 0,40): revisar redacción, ubicación o prerrequisitos',
  baja_discriminacion: 'Baja discriminación (rpb < 0,20): no separa a quien domina de quien no',
  discriminacion_negativa: 'Discriminación negativa: quienes más saben fallan más (¿clave errónea?)',
  distractor_no_funcional: 'Distractor no funcional (< 5% lo elige)',
  abandono_alto: 'Abandono alto (> 20%) en este reto'
};
export function flagLabel(flag) {
  return FLAG_LABELS[flag] || flag;
}

export function median(values) {
  const v = values.filter(x => Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const mid = v.length >> 1;
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

export function pearson(xs, ys) {
  const n = xs.length;
  if (n < 2) return null;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0; let sxx = 0; let syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx; const dy = ys[i] - my;
    sxy += dx * dy; sxx += dx * dx; syy += dy * dy;
  }
  if (sxx === 0 || syy === 0) return null;
  return sxy / Math.sqrt(sxx * syy);
}

/** Primera respuesta (ronda no remedial) de cada estudiante a cada ítem. */
export function collectFirstAttempts(users) {
  const byItem = new Map();
  const byUser = new Map();
  for (const user of users || []) {
    const logs = [...(user.logs || [])]
      .filter(l => l.questionId && l.phase !== 'remediation')
      .sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));
    const seen = new Map();
    for (const l of logs) {
      if (seen.has(l.questionId)) continue;
      const rec = {
        userId: user.id,
        questionId: l.questionId,
        correct: l.outcome === 'acierto' ? 1 : 0,
        durationMs: Number.isFinite(Number(l.durationMs)) && l.durationMs !== null ? Number(l.durationMs) : null,
        optionIndex: Number.isInteger(l.optionIndex) ? l.optionIndex : null,
        userAnswer: l.userAnswer || '',
        questionType: l.questionType || 'quiz',
        questionText: l.questionText || '',
        theoryId: l.theoryId || ''
      };
      seen.set(l.questionId, rec);
      if (!byItem.has(l.questionId)) byItem.set(l.questionId, []);
      byItem.get(l.questionId).push(rec);
    }
    byUser.set(user.id, seen);
  }
  return { byItem, byUser };
}

/** Banco de ítems { questionId: step } a partir del currículo. */
export function buildItemBank(units) {
  const bank = {};
  for (const u of units || []) {
    for (const l of u.lessons || []) {
      (l.steps || []).forEach((step, idx) => {
        if (step.type !== 'theory') bank[`${l.id}_s${idx}`] = { ...step, lessonId: l.id, unitId: u.id };
      });
    }
  }
  return bank;
}

/** Abandonos por ítem y finalización por lección a partir de state.sessions. */
export function collectSessions(users) {
  const abandonsAt = {};
  const lessons = {};
  for (const user of users || []) {
    for (const s of user.state?.sessions || []) {
      if (s.mode !== 'lesson') continue;
      const L = (lessons[s.lessonId] = lessons[s.lessonId] || { started: 0, completed: 0 });
      L.started++;
      const outcome = s.outcome || (s.completed ? 'victoria' : 'abandono');
      if (outcome === 'victoria') L.completed++;
      if (outcome === 'abandono') {
        L.abandoned = (L.abandoned || 0) + 1;
        if (s.lastQuestionId) abandonsAt[s.lastQuestionId] = (abandonsAt[s.lastQuestionId] || 0) + 1;
      }
    }
  }
  return { abandonsAt, lessons };
}

/**
 * Estadísticas por ítem.
 * @param {object[]} users  perfiles con logs y state.sessions
 * @param {object} itemBank { questionId: step } (para distractores y metadatos)
 */
export function analyzeItems(users, itemBank = {}) {
  const { byItem, byUser } = collectFirstAttempts(users);
  const { abandonsAt, lessons } = collectSessions(users);

  // % de acierto de cada estudiante en el resto de ítems (para rpb y D).
  const restShare = (userId, questionId) => {
    const seen = byUser.get(userId);
    let n = 0; let c = 0;
    for (const [qid, rec] of seen) {
      if (qid === questionId) continue;
      n++; c += rec.correct;
    }
    return n >= 3 ? c / n : null;
  };

  const items = [];
  const allIds = new Set([...byItem.keys(), ...Object.keys(abandonsAt)]);
  for (const qid of allIds) {
    const recs = byItem.get(qid) || [];
    const n = recs.length;
    const step = itemBank[qid] || {};
    const p = n ? recs.reduce((a, r) => a + r.correct, 0) / n : null;

    const pairs = recs.map(r => [r.correct, restShare(r.userId, qid)]).filter(([, y]) => y !== null);
    const rpb = pairs.length >= 3 ? pearson(pairs.map(x => x[0]), pairs.map(x => x[1])) : null;

    let D = null;
    if (pairs.length >= 4) {
      const sorted = [...pairs].sort((a, b) => a[1] - b[1]);
      const k = Math.max(1, Math.round(sorted.length * 0.27));
      const lower = sorted.slice(0, k); const upper = sorted.slice(-k);
      D = upper.reduce((a, x) => a + x[0], 0) / k - lower.reduce((a, x) => a + x[0], 0) / k;
    }

    // Distractores (opción múltiple)
    let options = null;
    if (step.type === 'quiz' && Array.isArray(step.options)) {
      const counts = step.options.map(() => 0);
      for (const r of recs) {
        let idx = r.optionIndex;
        if (idx === null) idx = step.options.findIndex(o => o === r.userAnswer);
        if (idx >= 0 && idx < counts.length) counts[idx]++;
      }
      options = step.options.map((text, i) => ({
        index: i, text, isKey: i === step.correctIndex, count: counts[i], share: n ? counts[i] / n : 0
      }));
    }

    const ab = abandonsAt[qid] || 0;
    const abandonRate = n + ab > 0 ? ab / (n + ab) : 0;
    const medianSec = median(recs.map(r => r.durationMs)) !== null ? median(recs.map(r => r.durationMs)) / 1000 : null;

    const flags = [];
    if (n >= MIN_N_FLAGS) {
      if (p > THRESHOLDS.tooEasy) flags.push('muy_facil');
      if (p < THRESHOLDS.tooHard) flags.push('muy_dificil');
      if (rpb !== null && rpb < 0) flags.push('discriminacion_negativa');
      else if (rpb !== null && rpb < THRESHOLDS.lowDiscrimination) flags.push('baja_discriminacion');
    }
    if (options && n >= MIN_N_DISTRACTORS && options.some(o => !o.isKey && o.share < THRESHOLDS.distractorMinShare)) {
      flags.push('distractor_no_funcional');
    }
    if (n + ab >= MIN_N_FLAGS && abandonRate > THRESHOLDS.highAbandon) flags.push('abandono_alto');

    items.push({
      questionId: qid,
      lessonId: step.lessonId || qid.replace(/_s\d+$/, ''),
      type: step.type || recs[0]?.questionType || 'quiz',
      theoryId: step.theoryId || recs[0]?.theoryId || '',
      text: step.question || step.title || recs[0]?.questionText || qid,
      n,
      p,
      rpb,
      D,
      medianSec,
      abandons: ab,
      abandonRate,
      options,
      flags
    });
  }

  items.sort((a, b) => b.flags.length - a.flags.length || (a.p ?? 1) - (b.p ?? 1));
  const lessonStats = Object.entries(lessons).map(([lessonId, L]) => ({
    lessonId, started: L.started, completed: L.completed, abandoned: L.abandoned || 0, completionRate: L.started ? L.completed / L.started : 0
  }));
  return {
    respondents: (users || []).filter(u => (u.logs || []).length).length,
    items,
    lessons: lessonStats,
    flagged: items.filter(i => i.flags.length).length
  };
}

/**
 * Calibración de tiempos: mediana observada por tipo de reto (en segundos),
 * solo con tipos que tengan al menos minN respuestas cronometradas.
 */
export function observedSecondsByType(users, minN = 15) {
  const { byItem } = collectFirstAttempts(users);
  const byType = {};
  for (const recs of byItem.values()) {
    for (const r of recs) {
      if (r.durationMs === null) continue;
      (byType[r.questionType] = byType[r.questionType] || []).push(r.durationMs / 1000);
    }
  }
  const out = {};
  for (const [type, secs] of Object.entries(byType)) {
    if (secs.length >= minN) out[type] = Math.round(median(secs));
  }
  return out;
}

/** CSV (UTF-8 con BOM, separador ;) para revisar ítems en una hoja de cálculo. */
export function itemsToCSV(analysis) {
  const head = ['questionId', 'leccion', 'tipo', 'teoria', 'n', 'p', 'rpb', 'D', 'mediana_s', 'abandonos', 'tasa_abandono', 'alertas', 'opciones (% elegida)', 'texto'];
  const fmt = v => (v === null || v === undefined ? '' : typeof v === 'number' ? String(Math.round(v * 1000) / 1000).replace('.', ',') : String(v));
  const cell = v => {
    const s = fmt(v).replace(/\r?\n/g, ' ');
    return /[";]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = analysis.items.map(i => [
    i.questionId, i.lessonId, i.type, i.theoryId, i.n, i.p, i.rpb, i.D, i.medianSec, i.abandons, i.abandonRate,
    i.flags.join(' | '),
    i.options ? i.options.map(o => `${o.isKey ? '*' : ''}${o.index + 1}:${Math.round(o.share * 100)}%`).join(' ') : '',
    i.text
  ].map(cell).join(';'));
  return '﻿' + [head.join(';'), ...rows].join('\n');
}
