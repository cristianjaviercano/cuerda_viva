import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 8080);
const DEFAULT_DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'users_db.json')
  : path.join(__dirname, 'data', 'users_db.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function createDefaultState() {
  const today = new Date().toISOString().slice(0, 10);
  return {
    xp: 0,
    dailyXp: 0,
    dailyGoal: 50,
    streak: 1,
    lastDate: today,
    hearts: 5,
    instrument: 'nylon',
    completedLessons: [],
    completedDays: []
  };
}

function makeId(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function summarizeUser(user) {
  const logs = Array.isArray(user.logs) ? user.logs : [];
  let hits = 0;
  let misses = 0;
  const theoryMissTime = {};
  const theoryMasterTime = {};

  for (const log of logs) {
    if (log.outcome === 'acierto') hits++;
    else if (log.outcome === 'no_acierto') misses++;
    if (log.theoryId) {
      const ts = String(log.timestamp || '');
      if (log.outcome === 'no_acierto') {
        if (!theoryMissTime[log.theoryId] || ts > theoryMissTime[log.theoryId]) {
          theoryMissTime[log.theoryId] = ts;
        }
      } else if (log.outcome === 'acierto' && log.phase === 'remediation') {
        if (!theoryMasterTime[log.theoryId] || ts > theoryMasterTime[log.theoryId]) {
          theoryMasterTime[log.theoryId] = ts;
        }
      }
    }
  }

  let weakPendingCount = 0;
  for (const [tid, missTs] of Object.entries(theoryMissTime)) {
    const revMasterTs = user.reviewedTheories?.[tid]?.masteredAt || '';
    const masterTs = revMasterTs > (theoryMasterTime[tid] || '') ? revMasterTs : (theoryMasterTime[tid] || '');
    if (!masterTs || missTs > masterTs) {
      weakPendingCount++;
    }
  }

  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar || '🎸',
    levelLabel: user.levelLabel || 'Estudiante',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    xp: user.state?.xp || 0,
    streak: user.state?.streak || 1,
    completedLessonsCount: Array.isArray(user.state?.completedLessons) ? user.state.completedLessons.length : 0,
    totalAttempts: logs.length,
    hits,
    misses,
    weakPendingCount
  };
}

export function createUserDatabase(dbFile = DEFAULT_DB_FILE) {
  let cache = null;

  function load() {
    if (cache) return cache;
    try {
      if (fs.existsSync(dbFile)) {
        const raw = fs.readFileSync(dbFile, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users)) {
          cache = parsed;
          return cache;
        }
      }
    } catch (_) {
      // Fall back to fresh DB if corrupt/missing
    }
    const now = new Date().toISOString();
    const defaultUser = {
      id: 'usr_estudiante_1',
      name: 'Estudiante Principal',
      avatar: '🎸',
      levelLabel: 'Intermedio',
      createdAt: now,
      updatedAt: now,
      state: createDefaultState(),
      reviewedTheories: {},
      logs: []
    };
    cache = {
      activeUserId: defaultUser.id,
      users: [defaultUser]
    };
    save();
    return cache;
  }

  function save() {
    if (!cache) return;
    try {
      const dir = path.dirname(dbFile);
      fs.mkdirSync(dir, { recursive: true });
      const tmp = `${dbFile}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(cache, null, 2), 'utf8');
      fs.renameSync(tmp, dbFile);
    } catch (err) {
      // En entornos serverless de solo lectura, mantener el caché en memoria
    }
  }

  function getUserById(id) {
    const db = load();
    return db.users.find(u => u.id === id) || null;
  }

  return {
    load,
    save,
    getUserById,
    listUsers() {
      const db = load();
      return {
        activeUserId: db.activeUserId || db.users[0]?.id || null,
        users: db.users.map(summarizeUser)
      };
    },
    registerUser(payload = {}) {
      const db = load();
      const cleanName = String(payload.name || '').trim().slice(0, 60);
      if (!cleanName) {
        return { error: 'El nombre de usuario es obligatorio.', status: 400 };
      }

      const existing = db.users.find(
        u => u.name.trim().toLowerCase() === cleanName.toLowerCase()
      );
      if (existing) {
        if (payload.avatar) existing.avatar = String(payload.avatar).slice(0, 8);
        if (payload.levelLabel) existing.levelLabel = String(payload.levelLabel).slice(0, 40);
        existing.updatedAt = new Date().toISOString();
        db.activeUserId = existing.id;
        save();
        return { user: existing, activeUserId: existing.id, created: false, users: db.users.map(summarizeUser) };
      }

      const now = new Date().toISOString();
      const baseState = createDefaultState();
      if (payload.initialState && typeof payload.initialState === 'object') {
        Object.assign(baseState, payload.initialState);
      }

      const newUser = {
        id: payload.id ? String(payload.id).slice(0, 60) : makeId('usr'),
        name: cleanName,
        avatar: String(payload.avatar || '🎸').slice(0, 8),
        levelLabel: String(payload.levelLabel || 'Principiante').slice(0, 40),
        createdAt: now,
        updatedAt: now,
        state: baseState,
        reviewedTheories: {},
        logs: []
      };

      db.users.push(newUser);
      db.activeUserId = newUser.id;
      save();
      return { user: newUser, activeUserId: newUser.id, created: true, users: db.users.map(summarizeUser) };
    },
    selectUser(userId) {
      const db = load();
      const target = db.users.find(u => u.id === userId);
      if (!target) return { error: 'Usuario no encontrado.', status: 404 };
      db.activeUserId = target.id;
      target.updatedAt = new Date().toISOString();
      save();
      return { user: target, activeUserId: target.id, users: db.users.map(summarizeUser) };
    },
    updateUserState(userId, statePatch = {}) {
      const db = load();
      const target = db.users.find(u => u.id === userId);
      if (!target) return { error: 'Usuario no encontrado.', status: 404 };
      target.state = {
        ...createDefaultState(),
        ...(target.state || {}),
        ...statePatch
      };
      target.updatedAt = new Date().toISOString();
      save();
      return { ok: true, user: target };
    },
    appendLog(userId, logEntry = {}) {
      const db = load();
      const target = db.users.find(u => u.id === userId);
      if (!target) return { error: 'Usuario no encontrado.', status: 404 };
      const outcome = logEntry.outcome === 'no_acierto' ? 'no_acierto' : 'acierto';
      const phase = logEntry.phase === 'remediation' ? 'remediation' : 'initial';
      const now = logEntry.timestamp || new Date().toISOString();

      const entry = {
        id: logEntry.id || makeId('log'),
        timestamp: now,
        lessonId: String(logEntry.lessonId || 'free_practice'),
        lessonTitle: String(logEntry.lessonTitle || ''),
        unitId: String(logEntry.unitId || ''),
        questionId: String(logEntry.questionId || ''),
        questionText: String(logEntry.questionText || ''),
        questionType: String(logEntry.questionType || 'quiz'),
        theoryId: String(logEntry.theoryId || 'general_music'),
        theoryTitle: String(logEntry.theoryTitle || 'Teoría Musical'),
        outcome,
        phase,
        userAnswer: String(logEntry.userAnswer || ''),
        expectedAnswer: String(logEntry.expectedAnswer || '')
      };

      if (!Array.isArray(target.logs)) target.logs = [];
      target.logs.push(entry);
      if (target.logs.length > 2000) {
        target.logs = target.logs.slice(-2000);
      }

      if (!target.reviewedTheories) target.reviewedTheories = {};
      if (outcome === 'acierto' && phase === 'remediation' && entry.theoryId) {
        const prev = target.reviewedTheories[entry.theoryId] || {};
        target.reviewedTheories[entry.theoryId] = {
          ...prev,
          masteredAt: now,
          reviewCount: prev.reviewCount || 1
        };
      }

      target.updatedAt = now;
      save();
      return { ok: true, entry, summary: summarizeUser(target) };
    },
    recordRemediation(userId, payload = {}) {
      const db = load();
      const target = db.users.find(u => u.id === userId);
      if (!target) return { error: 'Usuario no encontrado.', status: 404 };
      const theoryId = String(payload.theoryId || '').trim();
      if (!theoryId) return { error: 'theoryId requerido.', status: 400 };
      const now = new Date().toISOString();
      if (!target.reviewedTheories) target.reviewedTheories = {};
      const prev = target.reviewedTheories[theoryId] || { reviewCount: 0 };
      target.reviewedTheories[theoryId] = {
        ...prev,
        reviewedAt: now,
        masteredAt: payload.mastered ? now : prev.masteredAt,
        reviewCount: (prev.reviewCount || 0) + (payload.reviewed ? 1 : 0)
      };
      target.updatedAt = now;
      save();
      return { ok: true, reviewedTheories: target.reviewedTheories };
    },
    clearUserLogs(userId) {
      const db = load();
      const target = db.users.find(u => u.id === userId);
      if (!target) return { error: 'Usuario no encontrado.', status: 404 };
      target.logs = [];
      target.reviewedTheories = {};
      target.updatedAt = new Date().toISOString();
      save();
      return { ok: true, user: target };
    }
  };
}

function readJsonBody(req, maxBytes = 2 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = '';
    let bytes = 0;
    req.on('data', chunk => {
      bytes += chunk.length;
      if (bytes > maxBytes) {
        reject(new Error('Payload demasiado grande'));
        req.destroy();
        return;
      }
      body += chunk.toString('utf8');
    });
    req.on('end', () => {
      if (!body.trim()) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (_) {
        reject(new Error('JSON inválido'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });
  res.end(JSON.stringify(data));
}

export function createRequestHandler({ rootDir = __dirname, dbFile = DEFAULT_DB_FILE } = {}) {
  const userDb = createUserDatabase(dbFile);

  return async function handleRequest(req, res) {
    const rawUrl = req.url || '/';
    const reqPath = decodeURIComponent(rawUrl.split('?')[0]);
    const method = (req.method || 'GET').toUpperCase();
    const cleanPath = reqPath.startsWith('/api') ? (reqPath.slice(4) || '/') : reqPath;
    const isApi = reqPath.startsWith('/api') || cleanPath === '/health' || cleanPath.startsWith('/users');

    // ==================== API REST: REGISTRO DE USUARIOS Y BITÁCORA ====================
    if (isApi) {
      try {
        if (method === 'GET' && (cleanPath === '/health' || cleanPath === '' || cleanPath === '/')) {
          const list = userDb.listUsers();
          return sendJson(res, 200, { ok: true, usersCount: list.users.length, activeUserId: list.activeUserId });
        }

        if (method === 'GET' && cleanPath === '/users') {
          return sendJson(res, 200, userDb.listUsers());
        }

        if (method === 'POST' && cleanPath === '/users/register') {
          const body = await readJsonBody(req);
          const result = userDb.registerUser(body);
          if (result.error) return sendJson(res, result.status || 400, { error: result.error });
          return sendJson(res, result.created ? 201 : 200, result);
        }

        if (method === 'POST' && cleanPath === '/users/select') {
          const body = await readJsonBody(req);
          const result = userDb.selectUser(body.userId);
          if (result.error) return sendJson(res, result.status || 404, { error: result.error });
          return sendJson(res, 200, result);
        }

        const userMatch = cleanPath.match(/^\/users\/([^/]+)(?:\/(state|log|logs|remediation))?$/);
        if (userMatch) {
          const userId = userMatch[1];
          const action = userMatch[2] || '';

          if (method === 'GET' && !action) {
            const user = userDb.getUserById(userId);
            if (!user) return sendJson(res, 404, { error: 'Usuario no encontrado.' });
            return sendJson(res, 200, { user });
          }

          if (method === 'PUT' && action === 'state') {
            const body = await readJsonBody(req);
            const result = userDb.updateUserState(userId, body.state || body);
            if (result.error) return sendJson(res, result.status || 404, { error: result.error });
            return sendJson(res, 200, result);
          }

          if (method === 'POST' && action === 'log') {
            const body = await readJsonBody(req);
            const result = userDb.appendLog(userId, body);
            if (result.error) return sendJson(res, result.status || 404, { error: result.error });
            return sendJson(res, 201, result);
          }

          if (method === 'POST' && action === 'remediation') {
            const body = await readJsonBody(req);
            const result = userDb.recordRemediation(userId, body);
            if (result.error) return sendJson(res, result.status || 404, { error: result.error });
            return sendJson(res, 200, result);
          }

          if (method === 'DELETE' && action === 'logs') {
            const result = userDb.clearUserLogs(userId);
            if (result.error) return sendJson(res, result.status || 404, { error: result.error });
            return sendJson(res, 200, result);
          }
        }

        return sendJson(res, 404, { error: 'Endpoint API no encontrado.' });
      } catch (err) {
        return sendJson(res, 400, { error: err.message || 'Error en petición API' });
      }
    }

    // ==================== ARCHIVOS ESTÁTICOS ====================
    let filePath = reqPath === '/' ? '/index.html' : reqPath;
    const resolvedPath = path.resolve(rootDir, '.' + filePath);
    if (!resolvedPath.startsWith(rootDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('403 Forbidden');
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(resolvedPath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
          res.end(`Error del servidor: ${err.code}`);
        }
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(content);
      }
    });
  };
}

export function startServer(port = PORT, maxAttempts = 5) {
  const handler = createRequestHandler();
  const server = http.createServer(handler);
  let currentPort = port;

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && currentPort < port + maxAttempts) {
      currentPort++;
      console.warn(`⚠️ Puerto ${currentPort - 1} ocupado. Probando automáticamente en el puerto ${currentPort}...`);
      setTimeout(() => server.listen(currentPort), 120);
    } else {
      console.error('Error al iniciar el servidor HTTP:', err);
    }
  });

  server.listen(port, () => {
    const actualPort = server.address().port;
    console.log('='.repeat(72));
    console.log(`🎸 CuerdaViva! corriendo en http://localhost:${actualPort}`);
    console.log(`   Alabanzas Católicas + Vallenato, Cumbia, Porro & Pasillo (Método Keyner)`);
    console.log(`   API de Registro de Usuarios & Bitácora activa en /api/users`);
    console.log('='.repeat(72));
  });
  return server;
}

const arg1 = process.argv[1] ? path.resolve(process.argv[1]) : '';
const thisFile = path.resolve(__filename);
const isAudit = arg1.includes('audit');
const isDirectRun = !isAudit && (arg1 === thisFile || Boolean(process.env.VERCEL));

if (isDirectRun) {
  startServer();
}

const defaultHandler = createRequestHandler({
  rootDir: __dirname,
  dbFile: DEFAULT_DB_FILE
});

export default function handler(req, res) {
  return defaultHandler(req, res);
}
