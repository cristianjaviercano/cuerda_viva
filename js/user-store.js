// ============================================================================
// js/user-store.js
// Registro Multi-Usuario + Bitácora Persistente de Aciertos / No Aciertos
// y Seguimiento de Teoría Pendiente de Repaso (con respaldo LocalStorage + API).
// ============================================================================

const REGISTRY_LOCAL_KEY = 'cuerdaviva_users_registry_v3';
const LEGACY_PROFILE_KEY = 'cuerdaviva_profile_v2';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function createDefaultUserState() {
  return {
    xp: 0,
    dailyXp: 0,
    dailyGoal: 50,
    streak: 1,
    lastDate: todayStr(),
    hearts: 5,
    instrument: 'nylon',
    completedLessons: [],
    completedDays: []
  };
}

function normalizeStreakForToday(state) {
  const today = todayStr();
  const merged = { ...createDefaultUserState(), ...(state || {}) };
  if (merged.lastDate && merged.lastDate !== today) {
    const prev = new Date(merged.lastDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr - prev) / 86400000);
    if (diffDays === 1) {
      merged.streak = (merged.streak || 1) + 1;
    } else if (diffDays > 1) {
      merged.streak = 1;
    }
    merged.dailyXp = 0;
    merged.hearts = 5;
    merged.lastDate = today;
  }
  return merged;
}

function makeLocalId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function escapeCsvCell(val) {
  const s = String(val ?? '').replace(/\r?\n/g, ' ');
  if (/[",;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export class UserStore {
  constructor() {
    this.registry = {
      activeUserId: null,
      users: []
    };
    this.serverAvailable = false;
    this.listeners = new Set();
  }

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  _notify() {
    for (const fn of this.listeners) {
      try {
        fn(this);
      } catch (_) {}
    }
  }

  _loadLocalRegistry() {
    try {
      const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(REGISTRY_LOCAL_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && parsed.users.length) {
          return parsed;
        }
      }
    } catch (_) {}

    // Migrar perfil legado si existía en localStorage
    let legacyState = createDefaultUserState();
    try {
      const legRaw = typeof localStorage !== 'undefined' ? localStorage.getItem(LEGACY_PROFILE_KEY) : null;
      if (legRaw) {
        legacyState = normalizeStreakForToday(JSON.parse(legRaw));
      }
    } catch (_) {}

    const now = new Date().toISOString();
    return {
      activeUserId: 'usr_estudiante_1',
      users: [
        {
          id: 'usr_estudiante_1',
          name: 'Estudiante Principal',
          avatar: '🎸',
          levelLabel: 'Intermedio',
          createdAt: now,
          updatedAt: now,
          state: legacyState,
          reviewedTheories: {},
          logs: []
        }
      ]
    };
  }

  _saveLocalRegistry() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(REGISTRY_LOCAL_KEY, JSON.stringify(this.registry));
        const active = this.getActiveUser();
        if (active?.state) {
          localStorage.setItem(LEGACY_PROFILE_KEY, JSON.stringify(active.state));
        }
      }
    } catch (_) {}
  }

  async init() {
    this.registry = this._loadLocalRegistry();

    // Intentar sincronizar con server.js (/api/users)
    if (typeof fetch === 'function' && typeof window !== 'undefined' && /^https?:/.test(window.location?.protocol || '')) {
      try {
        const res = await fetch('/api/users', { cache: 'no-store' });
        if (res.ok) {
          this.serverAvailable = true;
          const data = await res.json();
          const serverUsers = data.users || [];
          const targetId = this.registry.activeUserId || data.activeUserId || serverUsers[0]?.id;

          if (targetId) {
            const detailRes = await fetch(`/api/users/${encodeURIComponent(targetId)}`, { cache: 'no-store' });
            if (detailRes.ok) {
              const { user } = await detailRes.json();
              user.state = normalizeStreakForToday(user.state);
              this._mergeServerUsers(serverUsers, user);
              this._saveLocalRegistry();
              this._notify();
              return this.getActiveUser();
            }
          }
        }
      } catch (_) {
        this.serverAvailable = false;
      }
    }

    const active = this.getActiveUser();
    if (active) {
      active.state = normalizeStreakForToday(active.state);
    }
    this._saveLocalRegistry();
    this._notify();
    return this.getActiveUser();
  }

  _mergeServerUsers(summaries, detailedUser) {
    const existingMap = new Map(this.registry.users.map(u => [u.id, u]));
    const nextUsers = [];

    for (const s of summaries) {
      if (detailedUser && s.id === detailedUser.id) {
        nextUsers.push(detailedUser);
      } else {
        const local = existingMap.get(s.id);
        nextUsers.push(local ? {
          ...local,
          name: s.name,
          avatar: s.avatar || local.avatar,
          levelLabel: s.levelLabel || local.levelLabel,
          updatedAt: s.updatedAt || local.updatedAt
        } : {
          id: s.id,
          name: s.name,
          avatar: s.avatar || '🎸',
          levelLabel: s.levelLabel || 'Estudiante',
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          state: { ...createDefaultUserState(), xp: s.xp || 0, streak: s.streak || 1 },
          reviewedTheories: {},
          logs: []
        });
      }
    }

    if (detailedUser && !nextUsers.some(u => u.id === detailedUser.id)) {
      nextUsers.push(detailedUser);
    }

    this.registry.users = nextUsers;
    if (detailedUser) {
      this.registry.activeUserId = detailedUser.id;
    } else if (!this.registry.activeUserId && nextUsers[0]) {
      this.registry.activeUserId = nextUsers[0].id;
    }
  }

  getActiveUser() {
    if (!this.registry.users.length) return null;
    const found = this.registry.users.find(u => u.id === this.registry.activeUserId);
    return found || this.registry.users[0];
  }

  getUsersSummary() {
    return this.registry.users.map(user => {
      const stats = this.computeStatsForUser(user);
      const weak = this.computeWeakTheoriesForUser(user);
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar || '🎸',
        levelLabel: user.levelLabel || 'Estudiante',
        xp: user.state?.xp || 0,
        streak: user.state?.streak || 1,
        completedLessonsCount: user.state?.completedLessons?.length || 0,
        totalAttempts: stats.totalAttempts,
        hits: stats.hits,
        misses: stats.misses,
        weakPendingCount: weak.filter(w => w.needsReview).length,
        updatedAt: user.updatedAt
      };
    });
  }

  async registerUser({ name, avatar = '🎸', levelLabel = 'Intermedio', inheritCurrentState = false } = {}) {
    const cleanName = String(name || '').trim().slice(0, 60);
    if (!cleanName) throw new Error('Ingresa un nombre para registrar al estudiante.');

    const existing = this.registry.users.find(
      u => u.name.trim().toLowerCase() === cleanName.toLowerCase()
    );
    if (existing) {
      return this.selectUser(existing.id, { avatar, levelLabel });
    }

    const current = this.getActiveUser();
    const initialState = inheritCurrentState && current?.state
      ? JSON.parse(JSON.stringify(current.state))
      : createDefaultUserState();

    const now = new Date().toISOString();
    let newUser = {
      id: makeLocalId('usr'),
      name: cleanName,
      avatar,
      levelLabel,
      createdAt: now,
      updatedAt: now,
      state: initialState,
      reviewedTheories: {},
      logs: []
    };

    if (this.serverAvailable) {
      try {
        const res = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: newUser.id, name: cleanName, avatar, levelLabel, initialState })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) newUser = data.user;
        }
      } catch (_) {}
    }

    this.registry.users.push(newUser);
    this.registry.activeUserId = newUser.id;
    this._saveLocalRegistry();
    this._notify();
    return newUser;
  }

  async selectUser(userId, metaUpdate = {}) {
    let target = this.registry.users.find(u => u.id === userId);

    if (this.serverAvailable) {
      try {
        const res = await fetch('/api/users/select', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            data.user.state = normalizeStreakForToday(data.user.state);
            const idx = this.registry.users.findIndex(u => u.id === userId);
            if (idx >= 0) this.registry.users[idx] = data.user;
            else this.registry.users.push(data.user);
            target = data.user;
          }
        }
      } catch (_) {}
    }

    if (!target) return null;
    if (metaUpdate.avatar) target.avatar = metaUpdate.avatar;
    if (metaUpdate.levelLabel) target.levelLabel = metaUpdate.levelLabel;
    target.state = normalizeStreakForToday(target.state);
    this.registry.activeUserId = target.id;
    this._saveLocalRegistry();
    this._notify();
    return target;
  }

  saveState(statePatch) {
    const active = this.getActiveUser();
    if (!active) return;
    active.state = {
      ...createDefaultUserState(),
      ...(active.state || {}),
      ...(statePatch || {})
    };
    active.updatedAt = new Date().toISOString();
    this._saveLocalRegistry();

    if (this.serverAvailable) {
      fetch(`/api/users/${encodeURIComponent(active.id)}/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: active.state })
      }).catch(() => {});
    }
    this._notify();
  }

  recordAttempt(attempt) {
    const active = this.getActiveUser();
    if (!active) return null;

    const now = attempt.timestamp || new Date().toISOString();
    const entry = {
      id: makeLocalId('log'),
      timestamp: now,
      lessonId: String(attempt.lessonId || 'free_practice'),
      lessonTitle: String(attempt.lessonTitle || ''),
      unitId: String(attempt.unitId || ''),
      questionId: String(attempt.questionId || ''),
      questionText: String(attempt.questionText || ''),
      questionType: String(attempt.questionType || 'quiz'),
      theoryId: String(attempt.theoryId || 'general_music'),
      theoryTitle: String(attempt.theoryTitle || 'Teoría Musical'),
      outcome: attempt.outcome === 'no_acierto' ? 'no_acierto' : 'acierto',
      phase: attempt.phase === 'remediation' ? 'remediation' : 'initial',
      userAnswer: String(attempt.userAnswer || ''),
      expectedAnswer: String(attempt.expectedAnswer || '')
    };

    if (!Array.isArray(active.logs)) active.logs = [];
    active.logs.push(entry);
    if (active.logs.length > 2000) {
      active.logs = active.logs.slice(-2000);
    }

    if (entry.outcome === 'acierto' && entry.phase === 'remediation' && entry.theoryId) {
      if (!active.reviewedTheories) active.reviewedTheories = {};
      const prev = active.reviewedTheories[entry.theoryId] || {};
      active.reviewedTheories[entry.theoryId] = {
        ...prev,
        masteredAt: now,
        reviewCount: prev.reviewCount || 1
      };
    }

    active.updatedAt = now;
    this._saveLocalRegistry();

    if (this.serverAvailable) {
      fetch(`/api/users/${encodeURIComponent(active.id)}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      }).catch(() => {});
    }

    this._notify();
    return entry;
  }

  markTheoryReviewed(theoryId, mastered = false) {
    const active = this.getActiveUser();
    if (!active || !theoryId) return;
    if (!active.reviewedTheories) active.reviewedTheories = {};
    const now = new Date().toISOString();
    const prev = active.reviewedTheories[theoryId] || { reviewCount: 0 };
    active.reviewedTheories[theoryId] = {
      ...prev,
      reviewedAt: now,
      masteredAt: mastered ? now : prev.masteredAt,
      reviewCount: (prev.reviewCount || 0) + 1
    };
    active.updatedAt = now;
    this._saveLocalRegistry();

    if (this.serverAvailable) {
      fetch(`/api/users/${encodeURIComponent(active.id)}/remediation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theoryId, reviewed: true, mastered })
      }).catch(() => {});
    }
    this._notify();
  }

  async clearActiveUserLogs() {
    const active = this.getActiveUser();
    if (!active) return;
    active.logs = [];
    active.reviewedTheories = {};
    active.updatedAt = new Date().toISOString();
    this._saveLocalRegistry();

    if (this.serverAvailable) {
      try {
        await fetch(`/api/users/${encodeURIComponent(active.id)}/logs`, { method: 'DELETE' });
      } catch (_) {}
    }
    this._notify();
  }

  computeStatsForUser(user = this.getActiveUser()) {
    const logs = Array.isArray(user?.logs) ? user.logs : [];
    let hits = 0;
    let misses = 0;
    let initialHits = 0;
    let initialMisses = 0;
    let remediationWins = 0;

    for (const log of logs) {
      if (log.outcome === 'acierto') {
        hits++;
        if (log.phase === 'remediation') remediationWins++;
        else initialHits++;
      } else {
        misses++;
        if (log.phase !== 'remediation') initialMisses++;
      }
    }

    const totalAttempts = logs.length;
    const accuracyPct = totalAttempts > 0 ? Math.round((hits / totalAttempts) * 100) : 100;
    const initialTotal = initialHits + initialMisses;
    const initialAccuracyPct = initialTotal > 0 ? Math.round((initialHits / initialTotal) * 100) : 100;

    return {
      totalAttempts,
      hits,
      misses,
      initialHits,
      initialMisses,
      remediationWins,
      accuracyPct,
      initialAccuracyPct
    };
  }

  computeWeakTheoriesForUser(user = this.getActiveUser()) {
    const logs = Array.isArray(user?.logs) ? user.logs : [];
    const byTheory = new Map();

    for (const log of logs) {
      const tid = log.theoryId || 'general_music';
      if (!byTheory.has(tid)) {
        byTheory.set(tid, {
          theoryId: tid,
          theoryTitle: log.theoryTitle || tid,
          hits: 0,
          misses: 0,
          remediatedHits: 0,
          lastMissedAt: '',
          lastHitAt: '',
          lastRemediationHitAt: '',
          lastOutcome: 'acierto'
        });
      }
      const rec = byTheory.get(tid);
      if (log.theoryTitle) rec.theoryTitle = log.theoryTitle;
      const ts = String(log.timestamp || '');

      if (log.outcome === 'no_acierto') {
        rec.misses++;
        rec.lastOutcome = 'no_acierto';
        if (!rec.lastMissedAt || ts > rec.lastMissedAt) rec.lastMissedAt = ts;
      } else {
        rec.hits++;
        rec.lastOutcome = 'acierto';
        if (!rec.lastHitAt || ts > rec.lastHitAt) rec.lastHitAt = ts;
        if (log.phase === 'remediation') {
          rec.remediatedHits++;
          if (!rec.lastRemediationHitAt || ts > rec.lastRemediationHitAt) {
            rec.lastRemediationHitAt = ts;
          }
        }
      }
    }

    const reviewed = user?.reviewedTheories || {};
    const result = [];
    for (const rec of byTheory.values()) {
      if (rec.misses === 0) continue;
      const revInfo = reviewed[rec.theoryId] || {};
      const latestMaster = [rec.lastRemediationHitAt, revInfo.masteredAt || '']
        .filter(Boolean)
        .sort()
        .pop() || '';
      const needsReview = !latestMaster || rec.lastMissedAt > latestMaster;
      const total = rec.hits + rec.misses;
      result.push({
        ...rec,
        reviewedAt: revInfo.reviewedAt || '',
        masteredAt: latestMaster,
        reviewCount: revInfo.reviewCount || 0,
        needsReview,
        accuracyPct: total > 0 ? Math.round((rec.hits / total) * 100) : 0
      });
    }

    result.sort((a, b) => {
      if (a.needsReview !== b.needsReview) return a.needsReview ? -1 : 1;
      return b.misses - a.misses;
    });
    return result;
  }

  getStats() {
    return this.computeStatsForUser(this.getActiveUser());
  }

  getWeakTheories() {
    return this.computeWeakTheoriesForUser(this.getActiveUser());
  }

  getRecentLogs(limit = 150, filterOutcome = 'all') {
    const active = this.getActiveUser();
    const logs = Array.isArray(active?.logs) ? active.logs : [];
    const filtered = logs.filter(l => {
      if (filterOutcome === 'acierto') return l.outcome === 'acierto';
      if (filterOutcome === 'no_acierto') return l.outcome === 'no_acierto';
      if (filterOutcome === 'remediation') return l.phase === 'remediation';
      return true;
    });
    return filtered.slice(-limit).reverse();
  }

  exportLogsCSV() {
    const active = this.getActiveUser();
    const logs = active?.logs || [];
    const headers = [
      'Fecha_ISO',
      'Estudiante',
      'Resultado',
      'Fase',
      'Unidad',
      'Leccion',
      'Tipo',
      'Pregunta_o_Reto',
      'Teoria_ID',
      'Teoria_Asociada',
      'Respuesta_Usuario',
      'Respuesta_Esperada'
    ];
    const rows = [headers.map(escapeCsvCell).join(',')];
    for (const l of logs) {
      rows.push([
        l.timestamp,
        active?.name || '',
        l.outcome === 'acierto' ? 'ACIERTO' : 'NO_ACIERTO',
        l.phase === 'remediation' ? 'REPASO_OBLIGATORIO' : 'INICIAL',
        l.unitId,
        l.lessonTitle || l.lessonId,
        l.questionType,
        l.questionText,
        l.theoryId,
        l.theoryTitle,
        l.userAnswer,
        l.expectedAnswer
      ].map(escapeCsvCell).join(','));
    }
    return '\uFEFF' + rows.join('\n');
  }

  exportLogsJSON() {
    const active = this.getActiveUser();
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      user: {
        id: active?.id,
        name: active?.name,
        levelLabel: active?.levelLabel,
        xp: active?.state?.xp || 0,
        streak: active?.state?.streak || 1,
        completedLessons: active?.state?.completedLessons || []
      },
      stats: this.getStats(),
      weakTheories: this.getWeakTheories(),
      logs: active?.logs || []
    }, null, 2);
  }
}

export const userStore = new UserStore();

