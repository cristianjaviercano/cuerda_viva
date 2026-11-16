// ============================================================================
// audit_platform.mjs
// Suite de Verificación Exhaustiva para CuerdaViva!:
// 1. Integridad de Activos Estáticos e Imágenes Nano Banana
// 2. Coherencia del DOM en index.html y Selectores CSS
// 3. Método Numérico Keyner 10–60, Acordes DIS y Funciones Teóricas
// 4. Integridad Curricular (9 Unidades, 36 Lecciones, +150 Retos y Mapeo a THEORY_LIBRARY)
// 5. Canciones y Tablaturas Keyner, Folclor y Alabanzas
// 6. Base de Datos Atómica y Endpoints REST de server.js
// 7. Motor de Persistencia y Bitácora de UserStore (Aciertos / No Aciertos / Remediación)
// ============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importaciones de módulos del proyecto
import {
  toKeynerFretCode,
  parseKeynerFretCode,
  formatKeynerChordSymbol,
  formatChordLabel,
  NOTES_ES,
  NOTE_COLORS,
  getFretMidi
} from './js/music-theory.js';
import { CHORDS_DB, getChordData } from './js/chords-db.js';
import { TABS_DB } from './js/tabs-db.js';
import { MASTER_SONGS, isChristmasSong, isChristmasSeason } from './js/songs-db.js';
import { RHYTHM_PATTERNS } from './js/rhythm-trainer.js';
import {
  SKILL_UNITS,
  RETO_30_DIAS,
  THEORY_LIBRARY,
  UNIT_CAPSTONES
} from './js/curriculum-db.js';
import {
  GUITAR_PARTS_3D,
  KEYNER_HARMONIC_TABLE,
  NANO_BANANA_GALLERY
} from './js/guitar-3d.js';
import {
  UserStore,
  createDefaultUserState
} from './js/user-store.js';
import {
  createUserDatabase,
  createRequestHandler
} from './server.js';
import {
  MAX_HEARTS,
  shuffledOrder,
  neutralFeedback,
  loseHeart,
  gainHearts,
  pickReviewTheory,
  chunkTheory,
  countWords,
  estimateLessonMinutes,
  modelStepSeconds,
  SELF_ASSESSMENT_RUBRIC,
  scoreSelfAssessment
} from './js/pedagogy.js';
import { GLOSSARY, annotateGlossary } from './js/glossary.js';
import { BOOKS, CONTRIBUTIONS, COPYRIGHT, groupWorksByAuthor, normalizeAuthor, renderCreditsHTML } from './js/credits.js';
import {
  OnsetDetector,
  beatGrid,
  scoreTiming,
  describeTimingTendency,
  countChordChanges,
  ChordChangeCounter,
  makeEarRounds
} from './js/practice-metrics.js';
import {
  INTERVALS_DAYS,
  MASTERY_BOX,
  addDays,
  reviewCard,
  recordReview,
  dueTheoryIds,
  srsSummary,
  pickReviewItems
} from './js/spaced-repetition.js';
import {
  analyzeItems,
  buildItemBank,
  observedSecondsByType,
  itemsToCSV,
  pearson,
  median as medianOf
} from './js/item-analysis.js';

let passedChecks = 0;
let totalChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (!condition) {
    console.error(`❌ FALLÓ [${totalChecks}]: ${message}`);
    throw new Error(message);
  } else {
    passedChecks++;
    console.log(`  ✓ [${passedChecks}]: ${message}`);
  }
}

async function runAudit() {
  console.log('='.repeat(72));
  console.log('🚀 INICIANDO AUDITORÍA INTEGRAL DE CUERDAVIVA!');
  console.log('='.repeat(72));

  // --------------------------------------------------------------------------
  // 1. VERIFICACIÓN DE ARCHIVOS ESTÁTICOS E ILUSTRACIONES
  // --------------------------------------------------------------------------
  console.log('\n[1/7] Verificando Archivos Estáticos e Ilustraciones Nano Banana...');
  const expectedImages = [
    'assets/img/guitar_parts_diagram.jpg',
    'assets/img/guitar_posture_styles.jpg',
    'assets/img/guitar_hands_numbering.jpg',
    'assets/img/keyner_numeric_fretboard.jpg'
  ];
  for (const relPath of expectedImages) {
    const full = path.join(__dirname, relPath);
    assert(fs.existsSync(full), `Existe archivo de imagen: ${relPath}`);
    const stat = fs.statSync(full);
    assert(stat.size > 100000, `Imagen tiene tamaño real válido (${Math.round(stat.size / 1024)} KB): ${relPath}`);
  }

  // --------------------------------------------------------------------------
  // 2. VERIFICACIÓN DE ESTRUCTURA DOM EN index.html Y ESTILOS CSS
  // --------------------------------------------------------------------------
  console.log('\n[2/7] Verificando Selectores y Marcado DOM en index.html y css/style.css...');
  const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const cssContent = fs.readFileSync(path.join(__dirname, 'css', 'style.css'), 'utf8');

  const requiredIds = [
    'main-nav',
    'btn-home-logo',
    'btn-open-user-modal',
    'nav-user-name',
    'nav-user-avatar',
    'nav-user-alerts',
    'btn-open-audio-modal',
    'view-learn',
    'view-tabs',
    'view-songs',
    'view-rhythms',
    'view-fretboard',
    'view-guitar3d',
    'view-challenge',
    'modal-audio-tuner',
    'modal-lesson',
    'modal-chord-detail',
    'modal-user-profile',
    'user-modal-body',
    'lesson-progress-fill',
    'lesson-phase-badge',
    'lesson-hearts-count',
    'lesson-step-body',
    'lesson-footer-bar',
    'btn-lesson-primary',
    'btn-quit-lesson'
  ];
  for (const id of requiredIds) {
    assert(htmlContent.includes(`id="${id}"`), `index.html contiene el elemento con id="${id}"`);
  }

  // Verificar navegación 3D en topbar
  assert(htmlContent.includes('data-nav="guitar3d"'), 'index.html incluye botón de navegación para "guitar3d"');

  // Verificar selectores CSS críticos
  const requiredCssSelectors = [
    '.user-profile-pill',
    '.pending-dot',
    '.sidebar-kpi-mini-row',
    '.weak-alert-banner',
    '.lesson-theory-img-box',
    '.remediation-theory-panel',
    '.remediation-alert-banner',
    '.g3d-studio-wrap',
    '.g3d-canvas-stage',
    '.keyner-readout-card',
    '.km-grid',
    '.g3d-full-poster-img',
    '.ht-chord-tile',
    '.modal-user-lg',
    '.user-switch-card',
    '.kpi-cards-grid',
    '.weak-theory-row',
    '.attempt-log-table',
    '.outcome-pill-ok',
    '.outcome-pill-miss'
  ];
  for (const sel of requiredCssSelectors) {
    assert(cssContent.includes(sel), `css/style.css define el selector: ${sel}`);
  }

  // --------------------------------------------------------------------------
  // 3. MÉTODO NUMÉRICO KEYNER 10–60 Y TEORÍA DE ACORDES
  // --------------------------------------------------------------------------
  console.log('\n[3/7] Verificando Método Numérico Keyner 10-60 y Utilidades Teóricas...');
  assert(toKeynerFretCode(4, 3) === '43', 'toKeynerFretCode(4, 3) genera "43"');
  assert(toKeynerFretCode(1, 0) === '10', 'toKeynerFretCode(1, 0) genera "10"');
  assert(toKeynerFretCode(1, 12) === '112', 'toKeynerFretCode(1, 12) genera "112"');

  const p1 = parseKeynerFretCode('43');
  assert(p1.s === 4 && p1.f === 3, 'parseKeynerFretCode("43") devuelve s: 4, f: 3');
  const p2 = parseKeynerFretCode('112');
  assert(p2.s === 1 && p2.f === 12, 'parseKeynerFretCode("112") devuelve s: 1, f: 12');

  assert(formatKeynerChordSymbol('C') === 'DO+', 'formatKeynerChordSymbol("C") genera "DO+"');
  assert(formatKeynerChordSymbol('Am') === 'LA-', 'formatKeynerChordSymbol("Am") genera "LA-"');
  assert(formatKeynerChordSymbol('G7') === '5ª DO', 'formatKeynerChordSymbol("G7") genera "5ª DO"');
  assert(formatKeynerChordSymbol('D#dim7').includes('DIS.'), 'formatKeynerChordSymbol("D#dim7") incluye etiqueta "DIS."');

  assert(formatChordLabel('Am', 'keyner') === 'LA-', 'formatChordLabel("Am", "keyner") genera "LA-"');

  // Verificar presencia de acordes disminuidos requeridos por el libro de Keyner (DIS.)
  const dimChords = ['D#dim7', 'Bdim7', 'F#dim7'];
  for (const dc of dimChords) {
    assert(CHORDS_DB[dc] !== undefined, `CHORDS_DB contiene el acorde disminuido ${dc}`);
    const data = getChordData(dc);
    assert(data.voicings && data.voicings.length > 0, `getChordData("${dc}") tiene posiciones disponibles`);
  }

  // --------------------------------------------------------------------------
  // 4. INTEGRIDAD CURRICULAR: 9 UNIDADES, 36 LECCIONES, +150 RETOS Y MAPPING TEÓRICO
  // --------------------------------------------------------------------------
  console.log('\n[4/7] Verificando Estructura Curricular Completa y Mapeo a THEORY_LIBRARY...');
  assert(SKILL_UNITS.length === 9, `Existen exactamente 9 Unidades en SKILL_UNITS (obtenidas: ${SKILL_UNITS.length})`);

  let totalLessonsCount = 0;
  let totalStepsCount = 0;
  let totalQuestionsCount = 0;
  const theoryUsage = new Set();

  SKILL_UNITS.forEach((unit, uIdx) => {
    assert(unit.lessons && unit.lessons.length === 4, `Unidad ${uIdx + 1} (${unit.title}) tiene exactamente 4 lecciones`);
    unit.lessons.forEach((lesson) => {
      totalLessonsCount++;
      assert(lesson.id && lesson.title && Array.isArray(lesson.steps), `Lección ${lesson.id} tiene ID, título y arreglo de pasos`);
      assert(lesson.steps.length >= 3, `Lección ${lesson.id} tiene contenido expandido (>= 3 pasos, tiene ${lesson.steps.length})`);

      lesson.steps.forEach((step, sIdx) => {
        totalStepsCount++;
        const stId = `${lesson.id}_s${sIdx}`;
        assert(step.type, `Paso ${stId} tiene propiedad "type"`);

        // Mapeo obligatorio a THEORY_LIBRARY
        if (step.theoryId) {
          theoryUsage.add(step.theoryId);
          assert(
            THEORY_LIBRARY[step.theoryId] !== undefined,
            `Paso ${stId} mapea a una teoría válida en THEORY_LIBRARY: "${step.theoryId}"`
          );
        }

        if (step.type === 'theory') {
          assert(step.body && step.title, `Paso teórico ${stId} tiene cuerpo y título`);
          if (step.actionTarget) {
            assert(
              ['tabs', 'songs', 'rhythms', 'fretboard', 'guitar3d'].includes(step.actionTarget.tab),
              `Paso ${stId} tiene actionTarget válido a pestaña: ${step.actionTarget.tab}`
            );
          }
        } else if (step.type === 'quiz') {
          totalQuestionsCount++;
          assert(Array.isArray(step.options) && step.options.length >= 2, `Quiz ${stId} tiene opciones válidas`);
          assert(
            typeof step.correctIndex === 'number' && step.correctIndex >= 0 && step.correctIndex < step.options.length,
            `Quiz ${stId} tiene correctIndex dentro del rango (índice: ${step.correctIndex}, opciones: ${step.options.length})`
          );
          assert(step.explanation, `Quiz ${stId} incluye explicación pedagógica`);
        } else if (step.type === 'fretboard_find') {
          totalQuestionsCount++;
          assert(
            step.targetString >= 1 && step.targetString <= 6,
            `Fretboard find ${stId} tiene targetString 1..6 (${step.targetString})`
          );
          assert(
            step.targetFret >= 0 && step.targetFret <= 15,
            `Fretboard find ${stId} tiene targetFret 0..15 (${step.targetFret})`
          );
          assert(step.hint, `Fretboard find ${stId} incluye pista de orientación`);
        } else if (step.type === 'play_guitar_chord') {
          totalQuestionsCount++;
          assert(step.chord, `Play chord ${stId} tiene propiedad chord`);
          const chordData = getChordData(step.chord);
          assert(chordData && chordData.voicings.length > 0, `Acorde de reto ${step.chord} existe en biblioteca de acordes`);
        } else if (step.type === 'play_guitar_note') {
          totalQuestionsCount++;
          assert(
            typeof step.targetMidi === 'number' && step.targetMidi >= 40 && step.targetMidi <= 88,
            `Play note ${stId} tiene targetMidi de guitarra válido (${step.targetMidi})`
          );
        }
      });
    });
  });

  assert(totalLessonsCount === 36, `Total de 36 Lecciones (9 unidades × 4 lecciones = ${totalLessonsCount})`);
  assert(totalQuestionsCount >= 100, `Total de preguntas y retos prácticos interactivos >= 100 (actual: ${totalQuestionsCount})`);
  assert(totalStepsCount >= 140, `Total de pasos didácticos >= 140 (actual: ${totalStepsCount})`);

  console.log(`  ℹ️ Curriculum expandido verificado: 9 unidades · 36 lecciones · ${totalStepsCount} pasos (${totalQuestionsCount} retos evaluables).`);
  console.log(`  ℹ️ Total de teorías activas cubiertas en THEORY_LIBRARY: ${theoryUsage.size} teorías.`);

  // Verificar Reto de 30 Días
  assert(RETO_30_DIAS.length === 30, `RETO_30_DIAS tiene exactamente 30 días definidos (tiene: ${RETO_30_DIAS.length})`);
  RETO_30_DIAS.forEach(day => {
    assert(day.day && day.title && day.focus && day.minutes, `Día ${day.day} del Reto tiene estructura completa`);
  });

  // --------------------------------------------------------------------------
  // 5. CANCIONES, TABLATURAS Y RITMOS (MÉTODO KEYNER + FOLCLOR + ALABANZA)
  // --------------------------------------------------------------------------
  console.log('\n[5/7] Verificando Base de Canciones, Tablaturas y Ritmos...');
  const keynerSongs = [
    'col_pueblito_viejo',
    'col_espumas',
    'col_oropel',
    'col_pescador_lucero',
    'col_al_sur',
    'col_el_ano_viejo'
  ];
  for (const sid of keynerSongs) {
    const s = MASTER_SONGS.find(item => item.id === sid);
    assert(s !== undefined, `MASTER_SONGS contiene la canción del libro Keyner: "${sid}"`);
    assert(s.sourceMethod === 'keyner', `Canción "${sid}" está etiquetada con sourceMethod: "keyner"`);
    assert(s.keynerIntro, `Canción "${sid}" incluye la introducción numérica de Keyner: ${s.keynerIntro}`);
  }

  const keynerTabs = [
    'tab_keyner_escala_do',
    'tab_keyner_pueblito_viejo',
    'tab_keyner_oropel',
    'tab_keyner_espumas',
    'tab_keyner_pescador_lucero',
    'tab_keyner_carmen_bolivar',
    'tab_keyner_el_ano_viejo'
  ];
  for (const tid of keynerTabs) {
    const t = TABS_DB.find(item => item.id === tid);
    assert(t !== undefined, `TABS_DB contiene la tablatura del método Keyner: "${tid}"`);
    assert(t.sourceMethod === 'keyner', `Tablatura "${tid}" está etiquetada con sourceMethod: "keyner"`);
    assert(t.steps && t.steps.length >= 8, `Tablatura "${tid}" tiene notas y pasos reales (total: ${t.steps.length})`);
  }

  // Verificar los 18 ritmos incluyendo folclor andino y vallenato
  const requiredRhythms = [
    'paseo_vallenato',
    'merengue_vallenato',
    'cumbia',
    'porro_colombiano',
    'pasillo_colombiano',
    'bambuco_colombiano',
    'guabina_andina',
    'bolero_clasico'
  ];
  for (const rid of requiredRhythms) {
    assert(RHYTHM_PATTERNS[rid] !== undefined, `RHYTHM_PATTERNS contiene el patrón rítmico: "${rid}"`);
    assert(RHYTHM_PATTERNS[rid].steps && RHYTHM_PATTERNS[rid].steps.length >= 4, `Patrón "${rid}" tiene pasos de rasgueo definidos`);
  }
  assert(Object.keys(RHYTHM_PATTERNS).length === 18, `Existen exactamente 18 patrones de rasgueo y percusión`);

  // Verificar Guitarra 3D
  assert(GUITAR_PARTS_3D.length === 10, `GUITAR_PARTS_3D tiene 10 piezas anatómicas definidas`);
  assert(KEYNER_HARMONIC_TABLE.length === 9, `KEYNER_HARMONIC_TABLE tiene 9 tonalidades fundamentales del libro`);
  assert(NANO_BANANA_GALLERY.length === 4, `NANO_BANANA_GALLERY tiene 4 láminas didácticas`);

  // --------------------------------------------------------------------------
  // 6. PRUEBA DE BASE DE DATOS Y ENDPOINTS REST DE server.js
  // --------------------------------------------------------------------------
  console.log('\n[6/7] Verificando Base de Datos Atómica y Endpoints REST de server.js...');
  const tempDbFile = path.join(__dirname, 'data', `test_audit_db_${Date.now()}.json`);
  try {
    const testDb = createUserDatabase(tempDbFile);
    const initialList = testDb.listUsers();
    assert(initialList.users.length === 1, 'Base de datos temporal crea usuario por defecto "Estudiante Principal"');

    // Registrar nuevo usuario
    const regRes = testDb.registerUser({
      name: 'Simón Bolívar',
      avatar: '🪗',
      levelLabel: 'Intermedio'
    });
    assert(regRes.created === true, 'registerUser crea exitosamente el nuevo perfil');
    assert(regRes.user.name === 'Simón Bolívar', 'Nombre guardado correctamente en BD');

    // Seleccionar usuario
    const selRes = testDb.selectUser(regRes.user.id);
    assert(selRes.user.id === regRes.user.id, 'selectUser activa el perfil solicitado');

    // Actualizar estado
    const stateRes = testDb.updateUserState(regRes.user.id, { xp: 120, streak: 3 });
    assert(stateRes.ok && stateRes.user.state.xp === 120, 'updateUserState persiste XP y racha');

    // Registrar fallo (no_acierto) en una teoría
    const missLog = testDb.appendLog(regRes.user.id, {
      lessonId: 'u1_l1',
      questionId: 'q_test_1',
      questionText: 'Pregunta de prueba',
      theoryId: 'guitar_posture',
      theoryTitle: 'Postura Ergonómica',
      outcome: 'no_acierto',
      phase: 'initial'
    });
    assert(missLog.ok && missLog.summary.weakPendingCount === 1, 'appendLog registra no_acierto e incrementa weakPendingCount a 1');

    // Registrar paso de remediación (remediation) sobre la misma teoría
    const hitRem = testDb.appendLog(regRes.user.id, {
      lessonId: 'u1_l1',
      questionId: 'q_test_1',
      questionText: 'Pregunta de prueba',
      theoryId: 'guitar_posture',
      theoryTitle: 'Postura Ergonómica',
      outcome: 'acierto',
      phase: 'remediation'
    });
    assert(hitRem.ok && hitRem.summary.weakPendingCount === 0, 'Acierto en fase "remediation" limpia la teoría pendiente (weakPendingCount = 0)');

    // Limpiar logs
    const clearRes = testDb.clearUserLogs(regRes.user.id);
    assert(clearRes.ok && clearRes.user.logs.length === 0, 'clearUserLogs vacía la bitácora del usuario');

    // Probar RequestHandler de server.js con mock de request/response
    const handler = createRequestHandler({ rootDir: __dirname, dbFile: tempDbFile });

    const mockRequest = (method, url, body = null) => {
      return new Promise((resolve) => {
        let reqData = body ? JSON.stringify(body) : '';
        const req = {
          method,
          url,
          on: (event, cb) => {
            if (event === 'data' && reqData) cb(Buffer.from(reqData));
            if (event === 'end') cb();
          },
          destroy: () => {}
        };
        let statusCode = 200;
        let resHeaders = {};
        let resBody = '';
        const res = {
          writeHead: (st, hd) => {
            statusCode = st;
            resHeaders = hd;
          },
          end: (data) => {
            resBody = data;
            resolve({
              status: statusCode,
              headers: resHeaders,
              json: () => JSON.parse(resBody || '{}'),
              text: () => resBody
            });
          }
        };
        handler(req, res);
      });
    };

    // Test GET /api/health
    const healthRes = await mockRequest('GET', '/api/health');
    assert(healthRes.status === 200 && healthRes.json().ok === true, 'GET /api/health responde 200 OK');

    // Test GET /api/users
    const usersRes = await mockRequest('GET', '/api/users');
    assert(usersRes.status === 200 && Array.isArray(usersRes.json().users), 'GET /api/users devuelve lista de usuarios');

    // Test POST /api/users/register
    const regApiRes = await mockRequest('POST', '/api/users/register', { name: 'Mariana Pajón', avatar: '🏆' });
    assert(regApiRes.status === 201 && regApiRes.json().created === true, 'POST /api/users/register responde 201 Created');

    // Test GET archivo estático existente index.html
    const staticRes = await mockRequest('GET', '/index.html');
    assert(staticRes.status === 200 && staticRes.text().includes('CuerdaViva!'), 'Manejador sirve estáticos (index.html)');

    // Analítica: el servidor conserva tiempo y opción, y agrega sin exponer nombres
    const anaUser = regApiRes.json().user;
    const logRes = await mockRequest('POST', `/api/users/${encodeURIComponent(anaUser.id)}/log`, {
      lessonId: 'u1_l1', questionId: 'u1_l1_s2', questionType: 'quiz', outcome: 'acierto', phase: 'initial', durationMs: 12345.6, optionIndex: 1, sessionMode: 'lesson'
    });
    const savedEntry = logRes.json().entry;
    assert(savedEntry.durationMs === 12346 && savedEntry.optionIndex === 1 && savedEntry.sessionMode === 'lesson',
      'POST /log conserva durationMs, optionIndex y sessionMode para la analítica');
    const anaRes = await mockRequest('GET', '/api/analytics/items');
    const anaBody = anaRes.json();
    const anaItem = (anaBody.items || []).find(i => i.questionId === 'u1_l1_s2');
    assert(anaRes.status === 200 && anaItem && anaItem.n === 1 && anaItem.medianSec > 12, 'GET /api/analytics/items agrega las respuestas por reto');
    assert(!anaRes.text().includes('Mariana'), 'La analítica del servidor no expone nombres de estudiantes');

  } finally {
    if (fs.existsSync(tempDbFile)) {
      try { fs.unlinkSync(tempDbFile); } catch (_) {}
    }
  }

  // --------------------------------------------------------------------------
  // 7. PRUEBA DEL CLIENTE UserStore (LOCALSTORAGE, CSV BOM, JSON Y KPI ACCURACY)
  // --------------------------------------------------------------------------
  console.log('\n[7/7] Verificando Motor de Persistencia y Métricas de UserStore...');
  const clientStore = new UserStore();
  const defState = createDefaultUserState();
  assert(defState.xp === 0 && defState.hearts === 5 && defState.streak === 1, 'createDefaultUserState inicializa valores sanos');

  // Simular registro en memoria de UserStore
  clientStore.registry = {
    activeUserId: 'test_u1',
    users: [
      {
        id: 'test_u1',
        name: 'Andrés Cepeda',
        avatar: '🎸',
        levelLabel: 'Avanzado',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        state: defState,
        reviewedTheories: {},
        logs: []
      }
    ]
  };

  // Grabar 3 intentos iniciales (2 aciertos, 1 no acierto)
  clientStore.recordAttempt({
    lessonId: 'u1_l1',
    questionId: 'q1',
    theoryId: 'guitar_anatomy',
    theoryTitle: 'Anatomía de la Guitarra',
    outcome: 'acierto',
    phase: 'initial'
  });
  clientStore.recordAttempt({
    lessonId: 'u1_l1',
    questionId: 'q2',
    theoryId: 'guitar_posture',
    theoryTitle: 'Postura Ergonómica',
    outcome: 'no_acierto',
    phase: 'initial'
  });
  clientStore.recordAttempt({
    lessonId: 'u1_l1',
    questionId: 'q3',
    theoryId: 'hands_nails',
    theoryTitle: 'Numeración de Manos',
    outcome: 'acierto',
    phase: 'initial'
  });

  let stats = clientStore.getStats();
  assert(stats.totalAttempts === 3, 'UserStore cuenta 3 intentos en total');
  assert(stats.hits === 2 && stats.misses === 1, 'UserStore desglosa 2 aciertos y 1 no acierto');
  assert(stats.accuracyPct === 67, `Precisión global calculada: ${stats.accuracyPct}% (esperado: 67%)`);

  let weak = clientStore.getWeakTheories();
  assert(weak.length === 1 && weak[0].theoryId === 'guitar_posture' && weak[0].needsReview === true, 'getWeakTheories detecta "guitar_posture" como pendiente de repaso');

  // Ahora el estudiante hace la remediación obligatoria y acierta
  clientStore.recordAttempt({
    lessonId: 'u1_l1',
    questionId: 'q2',
    theoryId: 'guitar_posture',
    theoryTitle: 'Postura Ergonómica',
    outcome: 'acierto',
    phase: 'remediation'
  });

  stats = clientStore.getStats();
  assert(stats.remediationWins === 1, 'remediationWins se incrementa a 1');
  assert(stats.hits === 3, 'Total aciertos sube a 3');

  weak = clientStore.getWeakTheories();
  assert(weak.length === 1 && weak[0].needsReview === false, 'Tras acierto en remediación, needsReview pasa a false (teoría consolidada)');

  // Exportar CSV y verificar BOM para Excel
  const csv = clientStore.exportLogsCSV();
  assert(csv.startsWith('\uFEFF'), 'exportLogsCSV incluye BOM UTF-8 (\\uFEFF) para visualización correcta en Excel');
  assert(csv.includes('Postura Ergonómica') && csv.includes('REPASO_OBLIGATORIO'), 'exportLogsCSV incluye datos de fases y teorías');

  // Exportar JSON
  const jsonStr = clientStore.exportLogsJSON();
  const jsonParsed = JSON.parse(jsonStr);
  assert(jsonParsed.user && jsonParsed.stats && Array.isArray(jsonParsed.logs), 'exportLogsJSON genera estructura válida con usuario, stats y logs');

  // ==================== 8. VALIDEZ DE LA EVALUACIÓN (PEDAGOGÍA) ====================
  console.log('\n🧪 8. Validez de la evaluación: barajado, distractores y vidas');

  const quizzes = [];
  for (const u of SKILL_UNITS) for (const l of u.lessons) l.steps.forEach((st, i) => {
    if (st.type === 'quiz') quizzes.push({ id: `${l.id}_s${i}`, st });
  });

  for (const { id, st } of quizzes) {
    const norm = st.options.map(o => String(o).toLowerCase().trim());
    assert(
      st.options.length >= 3 && st.correctIndex >= 0 && st.correctIndex < st.options.length && new Set(norm).size === norm.length,
      `Quiz ${id}: ≥3 opciones únicas y correctIndex válido`
    );
  }

  // Pista de longitud: la opción correcta no debe ser sistemáticamente la más larga.
  const longestCorrect = quizzes.filter(({ st }) => {
    const L = st.options.map(o => o.length);
    return L.every((v, i) => i === st.correctIndex || v < L[st.correctIndex]);
  }).length;
  const longestPct = longestCorrect / quizzes.length;
  assert(longestPct <= 0.35, `Sesgo de longitud: correcta = más larga en ${(longestPct * 100).toFixed(1)}% (≤ 35%)`);

  // Barajado Fisher–Yates: permutación válida y distribución uniforme (semilla fija).
  let seed = 12345;
  const rng = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const perm = shuffledOrder(4, rng);
  assert([...perm].sort().join(',') === '0,1,2,3', 'shuffledOrder devuelve una permutación válida');
  const slotCount = [0, 0, 0, 0];
  const RUNS = 20000;
  for (let r = 0; r < RUNS; r++) slotCount[shuffledOrder(4, rng).indexOf(1)]++;
  const maxDev = Math.max(...slotCount.map(c => Math.abs(c / RUNS - 0.25)));
  assert(maxDev < 0.02, `La respuesta correcta cae en cada posición ~25% (desviación máx. ${(maxDev * 100).toFixed(2)}%)`);

  const appSrc = fs.readFileSync(path.join(__dirname, 'js', 'app.js'), 'utf8');
  assert(appSrc.includes('shuffledOrder(step.options.length)'), 'El ejecutor de lecciones baraja las opciones del quiz');
  assert(!/Math\.max\(1,\s*this\.state\.hearts/.test(appSrc), 'Las vidas pueden llegar a 0 (sin piso artificial en 1)');
  assert(!/this\.state\.hearts\s*=\s*5;/.test(appSrc), 'No existe recarga gratuita de vidas en el cliente');

  // Retroalimentación neutra al fallar
  assert(neutralFeedback('¡Correcto! Los trastes son...') === 'Los trastes son...', 'neutralFeedback elimina "¡Correcto!" inicial');
  assert(neutralFeedback('Sin elogio.') === 'Sin elogio.', 'neutralFeedback no altera textos sin elogio');

  // Economía de vidas
  assert(loseHeart(1).hearts === 0 && loseHeart(1).depleted, 'Perder la última vida deja 0 y marca agotamiento');
  assert(loseHeart(0).hearts === 0, 'Las vidas nunca son negativas');
  assert(loseHeart(3, { isRemediation: true }).hearts === 3, 'Los errores en remediación no restan vidas');
  assert(gainHearts(4, 2) === MAX_HEARTS && gainHearts(0, 2) === 2, 'gainHearts respeta el máximo');

  // Selección de teoría para recuperar vidas
  assert(
    pickReviewTheory([{ theoryId: 'x', needsReview: false }, { theoryId: 'guitar_posture', needsReview: true }], SKILL_UNITS, []) === 'guitar_posture',
    'pickReviewTheory prioriza teorías pendientes de la bitácora'
  );
  const fallbackTheory = pickReviewTheory([], SKILL_UNITS, ['u1_l1'], () => 0);
  assert(Boolean(THEORY_LIBRARY[fallbackTheory]), 'pickReviewTheory usa lecciones completadas si no hay pendientes');
  assert(
    pickReviewTheory([{ theoryId: 'hands_nails', needsReview: false }], SKILL_UNITS, []) === 'hands_nails',
    'pickReviewTheory reutiliza teorías falladas y ya consolidadas (recuperación espaciada)'
  );
  assert(pickReviewTheory([], SKILL_UNITS, []) === null, 'pickReviewTheory devuelve null sin historial');
  assert(!/gainHearts\(this\.state\.hearts,\s*MAX_HEARTS\)/.test(appSrc), 'Sin historial no se regalan vidas');

  // ==================== 9. RETOS DE HABILIDAD MEDIBLES ====================
  console.log('\n🎯 9. Retos de habilidad: ataques, pulso, cambios de acorde y oído');

  // 9.1 Detector de ataques sobre una envolvente sintética (rasgueos con decaimiento, cuadros de 16 ms)
  const strumTimes = [1000, 1857, 2714, 3571];
  const det = new OnsetDetector({ minRms: 0.01 });
  const detected = [];
  for (let t = 0; t <= 4300; t += 16) {
    let env = 0.002;
    strumTimes.forEach(st => { if (t >= st) env += 0.2 * Math.exp(-(t - st) / 250); });
    if (det.push(env, t)) detected.push(t);
  }
  assert(detected.length === strumTimes.length, `OnsetDetector detecta ${strumTimes.length} rasgueos (detectó ${detected.length})`);
  assert(detected.every((t, i) => Math.abs(t - strumTimes[i]) <= 16), 'Cada ataque se detecta en ≤ 1 cuadro (16 ms) del rasgueo real');

  // 9.2 Precisión rítmica
  const grid = beatGrid(1000, 60, 4);
  assert(grid.join(',') === '1000,2000,3000,4000', 'beatGrid genera pulsos a 60 BPM cada 1000 ms');
  const perfect = scoreTiming(grid, grid, 90);
  assert(perfect.hitRate === 1 && perfect.meanAbsMs === 0, 'Ataques exactos → 100% de acierto y 0 ms de error');
  const late = scoreTiming(grid.map(b => b + 40), grid, 90);
  assert(late.hitRate === 1 && late.meanSignedMs === 40, 'Ataques +40 ms → dentro de tolerancia con sesgo +40 ms (tarde)');
  const sloppy = scoreTiming([1000, 2150, 3400], grid, 90);
  assert(sloppy.hits === 1 && sloppy.missed === 1, 'Ataques fuera de tolerancia o ausentes no cuentan como acierto');
  assert(scoreTiming([1000, 1500, 2000, 3000, 4000], grid, 90).extra === 1, 'Se reportan ataques extra fuera del pulso');
  assert(/tarde/.test(describeTimingTendency(60)) && /adelant/.test(describeTimingTendency(-60)) && /centrado/.test(describeTimingTendency(5)),
    'describeTimingTendency diagnostica tarde / adelantado / centrado');

  // 9.3 Cambios de acorde
  const frames = [];
  const seq = [['A', 0, 400], ['B', 400, 800], [null, 800, 900], ['A', 900, 1300], ['B', 1300, 1380], ['A', 1380, 1700]];
  seq.forEach(([label, a, b]) => { for (let t = a; t < b; t += 20) frames.push({ t, label }); });
  assert(countChordChanges(frames, { minHoldMs: 200 }) === 2, 'countChordChanges cuenta A→B→A = 2 e ignora destellos < 200 ms y silencios');
  const ccc = new ChordChangeCounter({ minHoldMs: 200 });
  frames.forEach(f => ccc.push(f.label, f.t));
  assert(ccc.changes === 2, 'ChordChangeCounter (tiempo real) coincide con countChordChanges');

  // 9.4 Oído
  const ear = makeEarRounds(400);
  assert(ear.every(r => getChordData(r.chord)), 'Todos los acordes del entrenamiento auditivo existen en CHORDS_DB');
  assert(ear.every(r => (r.quality === 'minor') === /m$/.test(r.chord)), 'La calidad Mayor/menor de cada ronda coincide con el acorde');
  const minorShare = ear.filter(r => r.quality === 'minor').length / ear.length;
  assert(minorShare > 0.4 && minorShare < 0.6, `Mayor y menor aparecen equilibrados (${Math.round(minorShare * 100)}% menor)`);

  // 9.5 Integridad curricular de los retos
  const drillSteps = [];
  for (const u of SKILL_UNITS) for (const l of u.lessons) l.steps.forEach((st, i) => {
    if (['chord_change', 'strum_timing', 'ear_quality'].includes(st.type)) drillSteps.push({ id: `${l.id}_s${i}`, st });
  });
  assert(drillSteps.length >= 10, `El currículo incluye ${drillSteps.length} retos de habilidad medibles (≥ 10)`);
  for (const { id, st } of drillSteps) {
    let ok = Boolean(THEORY_LIBRARY[st.theoryId]) && Boolean(st.title) && Boolean(st.instruction);
    if (st.type === 'chord_change') ok = ok && st.chords.length === 2 && st.chords.every(c => getChordData(c)) && st.targetChanges > 0 && st.durationSec >= 15;
    if (st.type === 'strum_timing') ok = ok && st.bpm >= 40 && st.bpm <= 160 && st.bars * st.beatsPerBar >= 6 && st.toleranceMs >= 50 && st.minHitRate > 0 && st.minHitRate <= 1 && (!st.chord || getChordData(st.chord));
    if (st.type === 'ear_quality') ok = ok && st.rounds >= 3 && st.minCorrect <= st.rounds;
    assert(ok, `Reto ${id} (${st.type}) con parámetros y teoría válidos`);
  }
  assert(/DRILL_TYPES\.includes\(step\.type\)/.test(appSrc), 'El ejecutor de lecciones despacha los retos de habilidad');

  // ==================== 10. SECUENCIA DIDÁCTICA (PARTE C) ====================
  console.log('\n🧭 10. Secuencia didáctica: prerrequisitos, práctica intercalada y compatibilidad');

  const orderedLessons = SKILL_UNITS.flatMap((u, ui) => u.lessons.map(l => ({ unit: ui + 1, lesson: l })));

  // 10.1 Compatibilidad del progreso guardado: los 36 IDs originales se conservan
  const expectedIds = [];
  for (let u = 1; u <= 9; u++) for (let l = 1; l <= 4; l++) expectedIds.push(`u${u}_l${l}`);
  const actualIds = orderedLessons.map(o => o.lesson.id);
  assert(expectedIds.every(id => actualIds.includes(id)) && new Set(actualIds).size === 36,
    'Se conservan los 36 IDs de lección (el progreso guardado sigue siendo válido)');

  // 10.2 Sin referencias adelantadas: cada reto evalúa una teoría ya presentada
  const introducedAt = {};
  const forwardRefs = [];
  orderedLessons.forEach(({ lesson }, idx) => {
    lesson.steps.forEach(st => {
      if (st.type === 'theory' && st.theoryId && !(st.theoryId in introducedAt)) introducedAt[st.theoryId] = idx;
    });
    lesson.steps.forEach((st, i) => {
      if (st.type !== 'theory' && st.theoryId && !(st.theoryId in introducedAt)) forwardRefs.push(`${lesson.id}_s${i}→${st.theoryId}`);
    });
  });
  assert(forwardRefs.length === 0, `Ningún reto evalúa una teoría aún no presentada${forwardRefs.length ? ': ' + forwardRefs.join(', ') : ''}`);

  // 10.3 Hitos de secuencia
  const unitOf = theoryId => orderedLessons[introducedAt[theoryId]]?.unit;
  const firstLesson = orderedLessons[0].lesson;
  assert(firstLesson.steps.some(st => st.type === 'play_guitar_chord'), 'La primera lección ya hace sonar un acorde (sonido en los primeros minutos)');
  assert(SKILL_UNITS[0].lessons.some(l => l.steps.some(st => st.type === 'strum_timing')), 'El pulso rítmico se entrena desde la Unidad 1');
  assert(SKILL_UNITS[0].lessons.some(l => l.steps.some(st => st.type === 'chord_change')), 'Los cambios de acorde se entrenan desde la Unidad 1');
  assert(unitOf('strumming_44_engine') <= 2, `El rasgueo 4/4 se presenta en la Unidad ${unitOf('strumming_44_engine')} (≤ 2)`);
  assert(unitOf('harmonic_circle_basic') >= 5, `Las funciones armónicas se presentan en la Unidad ${unitOf('harmonic_circle_basic')} (≥ 5)`);
  assert(introducedAt.keyner_numeric_grid < introducedAt.tab_reading_techniques, 'La matriz Keyner se presenta antes que la lectura TAB que la usa');
  assert(introducedAt.minor_open_chords < introducedAt.harmonic_circle_basic && introducedAt.major_open_chords < introducedAt.harmonic_circle_basic,
    'Los acordes mayores y menores se presentan antes que el círculo armónico');

  // 10.4 Los códigos numéricos Keyner no aparecen antes de presentarse el método
  const keynerIdx = introducedAt.keyner_numeric_grid;
  const codeLeaks = [];
  orderedLessons.slice(0, keynerIdx).forEach(({ lesson }) => {
    lesson.steps.forEach((st, i) => {
      const txt = [st.body, st.question, st.instruction, st.explanation, st.hint, st.highlightBox, ...(st.options || [])].filter(Boolean).join(' ');
      if (/cód\.\s*\d|código Keyner|`[1-6]\d`|"[1-6]\d"/.test(txt)) codeLeaks.push(`${lesson.id}_s${i}`);
    });
  });
  assert(codeLeaks.length === 0, `Sin códigos Keyner antes de la Unidad ${orderedLessons[keynerIdx].unit}${codeLeaks.length ? ': ' + codeLeaks.join(', ') : ''}`);

  // 10.5 Práctica intercalada
  const PRACTICE = ['play_guitar_chord', 'play_guitar_note', 'fretboard_find', 'chord_change', 'strum_timing', 'ear_quality'];
  const lessonsWithoutPractice = orderedLessons.filter(({ lesson }) => !lesson.steps.some(st => PRACTICE.includes(st.type))).map(o => o.lesson.id);
  assert(lessonsWithoutPractice.length === 0, 'Cada lección incluye al menos un reto práctico');
  const allEval = orderedLessons.flatMap(o => o.lesson.steps).filter(st => st.type !== 'theory');
  const practiceShare = allEval.filter(st => PRACTICE.includes(st.type)).length / allEval.length;
  assert(practiceShare >= 0.5, `Los retos prácticos son ≥ 50% de lo evaluado (${(practiceShare * 100).toFixed(1)}%)`);

  // ==================== 11. REPASO ESPACIADO (PARTE D) ====================
  console.log('\n📅 11. Repaso espaciado (Leitner) y sesiones de repaso');

  assert(addDays('2026-01-31', 1) === '2026-02-01' && addDays('2026-12-31', 1) === '2027-01-01', 'addDays cruza meses y años correctamente');

  const D0 = '2026-03-01';
  let card = reviewCard(null, true, D0);
  assert(card.box === 1 && card.due === addDays(D0, INTERVALS_DAYS[1]), 'Primer acierto → caja 1, repaso al día siguiente');
  const sameDay = reviewCard(card, true, D0);
  assert(sameDay.box === 1, 'Un segundo acierto el MISMO día no sube de caja (solo cuenta lo espaciado)');
  card = reviewCard(card, true, addDays(D0, 1));
  assert(card.box === 2 && card.due === addDays(D0, 1 + INTERVALS_DAYS[2]), 'Acierto al día siguiente → caja 2, intervalo de 3 días');
  card = reviewCard(card, true, addDays(D0, 4));
  assert(card.box === MASTERY_BOX, `Aciertos en 3 días distintos → caja ${MASTERY_BOX} (dominada)`);
  const lapsed = reviewCard(card, false, addDays(D0, 11));
  assert(lapsed.box === 0 && lapsed.lapses === 1 && lapsed.due === addDays(D0, 12), 'Un fallo devuelve la tarjeta a la caja 0 y la programa para mañana');
  let capped = null;
  for (let d = 0; d < 20; d++) capped = reviewCard(capped, true, addDays(D0, d * 40));
  assert(capped.box === INTERVALS_DAYS.length - 1, 'La caja nunca supera el máximo');

  let srs = {};
  srs = recordReview(srs, 'a', true, '2026-03-01');   // due 03-02
  srs = recordReview(srs, 'b', false, '2026-03-01');  // due 03-02, caja 0
  srs = recordReview(srs, 'c', true, '2026-03-05');   // due 03-06
  assert(dueTheoryIds(srs, '2026-03-02').join(',') === 'b,a', 'dueTheoryIds devuelve las pendientes, primero las de caja más baja');
  assert(dueTheoryIds(srs, '2026-03-01').length === 0, 'Nada pendiente el mismo día del primer estudio');
  const sum = srsSummary(srs, '2026-03-02');
  assert(sum.total === 3 && sum.due === 2 && sum.mastered === 0 && sum.nextDue === '2026-03-06', 'srsSummary resume pendientes, dominadas y próximo repaso');

  const allTheories = Object.keys(THEORY_LIBRARY);
  const reviewSet = pickReviewItems(allTheories, SKILL_UNITS, { max: 6 });
  assert(reviewSet.length === 6, 'pickReviewItems respeta el tamaño máximo de la sesión');
  assert(new Set(reviewSet.map(r => r.theoryId)).size === reviewSet.length, 'Una pregunta por teoría: la sesión intercala temas distintos');
  const allReview = pickReviewItems(allTheories, SKILL_UNITS, { max: 99 });
  assert(allReview.every(r => !['theory', 'play_guitar_chord', 'play_guitar_note'].includes(r.step.type)),
    'El repaso excluye pasos teóricos y retos validables sin tocar');
  assert(allReview.filter(r => ['chord_change', 'strum_timing'].includes(r.step.type)).length <= 1, 'Como máximo un reto largo (≥ 20 s) por sesión');
  const tId = 'minor_open_chords';
  const r0 = pickReviewItems([tId], SKILL_UNITS, { srs: { [tId]: { reps: 0 } } })[0];
  const r1 = pickReviewItems([tId], SKILL_UNITS, { srs: { [tId]: { reps: 1 } } })[0];
  assert(r0 && r1 && r0.questionId !== r1.questionId, 'El ítem rota entre repasos: no siempre la misma pregunta');
  const excl = pickReviewItems([tId], SKILL_UNITS, { excludeLessonId: r0.lessonId });
  assert(excl.every(r => r.lessonId !== r0.lessonId), 'El calentamiento excluye retos de la lección que se va a estudiar');

  assert(/recordReview\(this\.state\.srs/.test(appSrc) && /openDailyReview\(\)/.test(appSrc) && /_reviewQid/.test(appSrc),
    'La app registra el repaso espaciado, ofrece el Repaso del día y el calentamiento');
  assert(/protectedPhase = isRemediation \|\| !sess \|\| sess\.mode !== 'lesson'/.test(appSrc), 'Repasar nunca resta vidas');

  // ==================== 12. CANCIONES PARA TODOS ====================
  console.log('\n🎉 12. Canciones para todos (dominio público / tradicionales)');
  const popular = MASTER_SONGS.filter(sg => sg.category === 'popular');
  assert(popular.length >= 8, `Hay ${popular.length} canciones para todos (≥ 8)`);
  assert(popular.some(sg => /cumplea/i.test(sg.title)), 'Incluye "Cumpleaños Feliz"');
  for (const sg of popular) {
    const chords = [...sg.content.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]);
    const ok = chords.length >= 3
      && chords.every(c => getChordData(c))
      && sg.progressionLoop.every(c => getChordData(c))
      && Boolean(RHYTHM_PATTERNS[sg.rhythmId])
      && Boolean(sg.occasion)
      && (!sg.linkedTabId || TABS_DB.some(t => t.id === sg.linkedTabId));
    assert(ok, `Canción "${sg.title}": acordes existentes, ritmo válido, ocasión y TAB vinculada coherentes`);
    assert(/Tradicional|tradicional|dominio público|\((1[0-8]\d\d|19[01]\d)\)|s\. XVIII/.test(sg.author),
      `Canción "${sg.title}" declara origen tradicional o de dominio público (${sg.author})`);
  }
  const popTabs = TABS_DB.filter(t => t.category === 'popular');
  assert(popTabs.length >= 3, `Hay ${popTabs.length} tablaturas de melodías para todos (≥ 3)`);
  for (const t of popTabs) {
    const firstPos = t.steps.every(e => e.s >= 1 && e.s <= 6 && e.f >= 0 && e.f <= 4 && e.dur > 0);
    assert(firstPos, `TAB "${t.title}" está en primera posición (trastes 0–4)`);
  }
  const cumpleTab = TABS_DB.find(t => t.id === 'tab_cumpleanos_feliz');
  const cumpleMidis = cumpleTab.steps.map(e => getFretMidi(e.s, e.f)).join(',');
  assert(cumpleMidis === '50,50,52,50,55,54,50,50,52,50,57,55,50,50,62,59,55,54,52,60,60,59,55,57,55',
    'La melodía de "Cumpleaños Feliz" es correcta nota a nota (D D E D G F# · D D E D A G · D D D\' B G F# E · C C B G A G)');
  const pulses = cumpleTab.steps.reduce((a, e) => a + e.dur, 0);
  assert(pulses === 1 + 8 * 3, 'Cumpleaños Feliz: anacrusa de 1 pulso + 8 compases de 3/4');

  const practiceRefs = orderedLessons.flatMap(o => (o.lesson.practiceSongs || []).map(ps => ({ lesson: o.lesson.id, ...ps })));
  assert(practiceRefs.length >= 8, `Las lecciones recomiendan ${practiceRefs.length} canciones para aplicar lo aprendido`);
  for (const ps of practiceRefs) {
    const exists = ps.tab === 'songs' ? MASTER_SONGS.some(sg => sg.id === ps.itemId) : TABS_DB.some(t => t.id === ps.itemId);
    assert(exists, `Lección ${ps.lesson} enlaza "${ps.itemId}" existente`);
  }

  // ==================== 13. DISEÑO INSTRUCCIONAL (PARTE E) ====================
  console.log('\n🧩 13. Diseño instruccional: objetivos, una idea por pantalla, glosario y autoevaluación');

  // 13.1 Objetivos observables y duración
  const VAGUE_VERBS = /^(conocer|entender|saber|comprender|aprender|familiarizarse|apreciar|ver|estudiar)\b/i;
  for (const { lesson } of orderedLessons) {
    const objs = lesson.objectives || [];
    const okObjs = objs.length >= 1 && objs.length <= 3 && objs.every(o => o.length <= 110 && !VAGUE_VERBS.test(o) && /^[A-ZÁÉÍÓÚ]/.test(o));
    assert(okObjs, `Lección ${lesson.id}: 1–3 objetivos observables (sin "conocer/entender/saber…")`);
    const min = estimateLessonMinutes(lesson);
    assert(min >= 2 && min <= 12, `Lección ${lesson.id}: duración estimada ${min} min (2–12)`);
  }

  // 13.2 Una idea por pantalla: tarjetas ≤ 80 palabras sin perder contenido
  const words = t => String(t).replace(/[*`•]/g, ' ').split(/\s+/).filter(Boolean);
  let theoryCards = 0;
  const longCards = [];
  const lostContent = [];
  const checkChunks = (id, text) => {
    const chunks = chunkTheory(text);
    theoryCards += chunks.length;
    chunks.forEach((c, i) => { if (countWords(c) > 80) longCards.push(`${id}#${i}`); });
    if (words(chunks.join(' ')).join(' ') !== words(text).join(' ')) lostContent.push(id);
  };
  orderedLessons.forEach(({ lesson }) => lesson.steps.forEach((st, i) => { if (st.type === 'theory') checkChunks(`${lesson.id}_s${i}`, st.body); }));
  Object.values(THEORY_LIBRARY).forEach(t => checkChunks(`lib:${t.id}`, t.explanation));
  assert(longCards.length === 0, `Ninguna pantalla teórica supera 80 palabras (${theoryCards} tarjetas)${longCards.length ? ': ' + longCards.join(', ') : ''}`);
  assert(lostContent.length === 0, `La división en tarjetas conserva todo el texto original${lostContent.length ? ': ' + lostContent.join(', ') : ''}`);
  assert(/_pageTheoryChunks\(body, chunkTheory\(step\.body\)/.test(appSrc) && /_pageTheoryChunks\(body, chunkTheory\(theory\.explanation\)/.test(appSrc),
    'La teoría de la lección y la de remediación se muestran una idea por pantalla');

  // 13.3 Glosario emergente
  const stripTags = h => h.replace(/<[^>]+>/g, '');
  const sampleHtml = '<p>El <strong>dominante secundario</strong> lleva a la tónica; pisa el traste y otro traste.</p><code>traste</code><img alt="traste">';
  const annotated = annotateGlossary(sampleHtml);
  assert(stripTags(annotated) === stripTags(sampleHtml), 'annotateGlossary no altera el texto visible');
  assert((annotated.match(/class="gloss-term"/g) || []).length === 3, 'Marca solo la primera aparición de cada término (dominante secundario, tónica, traste)');
  assert(annotated.includes('<code>traste</code>') && annotated.includes('alt="traste"'), 'No marca dentro de <code> ni de atributos');
  assert(!/data-def="[^"]*<button/.test(annotated), 'Las definiciones insertadas no se vuelven a anotar');
  assert(GLOSSARY.every(([, def]) => countWords(def) <= 25), 'Cada definición del glosario tiene ≤ 25 palabras');
  const corpus = orderedLessons.flatMap(o => o.lesson.steps).map(st => [st.body, st.question].filter(Boolean).join(' ')).join(' ')
    + ' ' + Object.values(THEORY_LIBRARY).map(t => t.explanation).join(' ');
  const usedTerms = GLOSSARY.filter(([term]) => new RegExp(`(?<![\\p{L}])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'iu').test(corpus));
  assert(usedTerms.length / GLOSSARY.length >= 0.8, `El ${Math.round(usedTerms.length / GLOSSARY.length * 100)}% de los términos del glosario aparece en el curso (≥ 80%)`);

  // 13.4 Autoevaluación de cierre de unidad
  assert(SKILL_UNITS.every(u => UNIT_CAPSTONES[u.id]?.task), 'Cada unidad tiene una tarea de cierre para autoevaluarse');
  assert(Object.values(UNIT_CAPSTONES).every(c => !c.songId || MASTER_SONGS.some(sg => sg.id === c.songId)), 'Las canciones de las tareas de cierre existen');
  assert(SELF_ASSESSMENT_RUBRIC.length === 4 && SELF_ASSESSMENT_RUBRIC.every(c => c.levels.length === 3 && THEORY_LIBRARY[c.theoryId]),
    'La rúbrica tiene 4 criterios × 3 niveles vinculados a teorías existentes');
  const best = scoreSelfAssessment({ limpieza: 3, pulso: 3, transiciones: 3, postura: 3 });
  const weakSA = scoreSelfAssessment({ limpieza: 1, pulso: 2, transiciones: 1, postura: 3 });
  assert(best.total === 12 && best.level === 'Dominado' && best.reviewTheories.length === 0, 'Puntaje máximo → "Dominado" sin repasos');
  assert(weakSA.total === 7 && weakSA.level === 'Necesita práctica' && weakSA.reviewTheories.join(',') === 'minor_open_chords,major_open_chords',
    'Los criterios en nivel 1 programan el repaso de su teoría');
  assert(/openUnitSelfAssessment\(/.test(appSrc) && /recordReview\(this\.state\.srs, tid, false\)/.test(appSrc) && /no se sube a ningún servidor/.test(appSrc),
    'La app ofrece la autoevaluación, la conecta con el repaso espaciado y la grabación es solo local');

  // ==================== 14. ANÁLISIS DE ÍTEMS (PARTE F) ====================
  console.log('\n📊 14. Análisis de ítems con una población sintética de habilidad conocida');

  assert(pearson([0, 0, 1, 1], [0.1, 0.2, 0.8, 0.9]) > 0.9 && pearson([1, 1], [0.5, 0.5]) === null, 'pearson calcula la correlación y devuelve null sin varianza');
  assert(medianOf([3, 1, 2]) === 2 && medianOf([4, 1, 3, 2]) === 2.5 && medianOf([]) === null, 'median correcta (impar, par y vacía)');

  // Población: 40 estudiantes con habilidad θ ∈ [0,1]; generador determinista.
  let seedIA = 7;
  const rngIA = () => ((seedIA = (seedIA * 1103515245 + 12345) % 2147483648) / 2147483648);
  const bank = buildItemBank(SKILL_UNITS);
  const quizIds = Object.keys(bank).filter(id => bank[id].type === 'quiz');
  const QG = quizIds[0];   // ítem "bueno": acierta según θ
  const QE = quizIds[1];   // ítem "muy fácil": todos aciertan
  const QR = quizIds[2];   // ítem "invertido": aciertan los de θ bajo (clave errónea)
  const QH = quizIds[3];   // ítem "muy difícil": solo θ > 0,85
  const fillers = quizIds.slice(4, 14);
  const t0 = Date.parse('2026-05-01T10:00:00Z');
  const synthUsers = Array.from({ length: 40 }, (_, u) => {
    const theta = (u + 0.5) / 40;
    const logs = [];
    let k = 0;
    const add = (qid, correct, extra = {}) => logs.push({
      timestamp: new Date(t0 + (k++) * 60000).toISOString(), questionId: qid, questionType: 'quiz',
      phase: 'initial', outcome: correct ? 'acierto' : 'no_acierto', durationMs: 20000 + u * 100,
      optionIndex: correct ? bank[qid].correctIndex : (bank[qid].correctIndex === 0 ? 1 : 0), ...extra
    });
    fillers.forEach(q => add(q, rngIA() < theta));
    add(QG, rngIA() < theta);
    add(QE, true);
    add(QR, theta < 0.5);
    add(QH, theta > 0.85);
    // Un reintento posterior en remediación NO debe contar
    add(QG, true, { phase: 'remediation' });
    const sessions = [{ mode: 'lesson', lessonId: 'u1_l1', outcome: u < 12 ? 'abandono' : 'victoria', lastQuestionId: u < 12 ? QH : null }];
    return { id: `u${u}`, logs, state: { sessions } };
  });
  const ia = analyzeItems(synthUsers, bank);
  const it = id => ia.items.find(i => i.questionId === id);

  assert(ia.respondents === 40 && it(QG).n === 40, 'Usa una respuesta por estudiante e ignora la remediación');
  assert(it(QE).p === 1 && it(QE).flags.includes('muy_facil'), `Ítem trivial → p = 1 y alerta "muy fácil"`);
  assert(it(QH).p < 0.4 && it(QH).flags.includes('muy_dificil'), `Ítem difícil → p = ${it(QH).p.toFixed(2)} y alerta "muy difícil"`);
  assert(it(QG).rpb > 0.2 && it(QG).D > 0.2 && !it(QG).flags.some(f => /discriminacion/.test(f)),
    `Ítem que depende de la habilidad → rpb = ${it(QG).rpb.toFixed(2)}, D = ${it(QG).D.toFixed(2)}, sin alertas de discriminación`);
  assert(it(QR).rpb < 0 && it(QR).flags.includes('discriminacion_negativa'), `Ítem con clave invertida → rpb = ${it(QR).rpb.toFixed(2)} y alerta de discriminación negativa`);
  assert(it(QG).options.length === bank[QG].options.length && it(QG).flags.includes('distractor_no_funcional'),
    'Detecta distractores que nadie elige (los errores sintéticos usan una sola opción)');
  assert(it(QH).abandons === 12 && it(QH).flags.includes('abandono_alto'), 'Atribuye los abandonos al reto donde ocurren y alerta si superan el 20%');
  const lessonU11 = ia.lessons.find(l => l.lessonId === 'u1_l1');
  assert(lessonU11.started === 40 && lessonU11.completed === 28 && lessonU11.abandoned === 12, 'Tasa de finalización por lección (28/40)');
  assert(ia.items[0].flags.length >= ia.items[ia.items.length - 1].flags.length, 'Los retos con alertas se listan primero');

  // Pocos datos → sin alertas (evita conclusiones con muestras pequeñas)
  const small = analyzeItems(synthUsers.slice(0, 5), bank);
  assert(small.items.every(i => !i.flags.some(f => f !== 'abandono_alto')), 'Con < 10 respuestas no se emiten alertas de dificultad ni discriminación');

  // Calibración de tiempos
  const obs = observedSecondsByType(synthUsers);
  assert(obs.quiz >= 20 && obs.quiz <= 24, `Mediana real de las preguntas: ${obs.quiz} s`);
  const someLesson = orderedLessons[0].lesson;
  assert(estimateLessonMinutes(someLesson, { quiz: 120 }) > estimateLessonMinutes(someLesson),
    'La duración estimada de una lección se recalibra con los tiempos observados');
  assert(modelStepSeconds({ type: 'quiz' }) === 30, 'El modelo inicial de tiempos sigue disponible cuando no hay datos');

  // Exportación
  const iaCsv = itemsToCSV(ia);
  assert(iaCsv.startsWith('﻿') && iaCsv.split('\n').length === ia.items.length + 1 && iaCsv.includes('discriminacion_negativa'),
    'itemsToCSV exporta una fila por reto, con BOM para Excel y las alertas');

  // Instrumentación de la app
  assert(/durationMs,\s*\n\s*optionIndex,\s*\n\s*sessionMode/.test(appSrc) && /_recordSessionEnd\('abandono'\)/.test(appSrc) && /optionIndex: sess\.selectedOption/.test(appSrc),
    'La app registra tiempo de respuesta, opción elegida y sesiones abandonadas');
  assert(/estimateLessonMinutes\(lesson, this\._getObservedSeconds\(\)\)/.test(appSrc), 'La ruta muestra duraciones calibradas con datos reales');

  // ==================== 15. AGRADECIMIENTOS Y DERECHOS DE AUTOR ====================
  console.log('\n📚 15. Agradecimientos, libros y derechos de autor');
  const creditsHtml = renderCreditsHTML({ songs: MASTER_SONGS, tabs: TABS_DB });
  const creditAuthors = groupWorksByAuthor(MASTER_SONGS, TABS_DB);
  assert(['Keyner Ramírez Mojica', 'Carlos Mario Vásquez Rojas', 'Luis Medina y Juan Caliva', 'Iván Becerra'].every(a => BOOKS.some(b => b.author.includes(a))),
    'Se agradece a los autores de los cuatro métodos principales');
  assert(MASTER_SONGS.every(sg => creditAuthors.some(a => a.author === normalizeAuthor(sg.author) && a.works.includes(sg.title))),
    `Cada canción del cancionero aparece con su autor en los créditos (${creditAuthors.length} autores)`);
  assert(/©/.test(creditsHtml) && creditsHtml.includes(COPYRIGHT.holder) && /MIT/.test(creditsHtml) && /BY-NC-SA/.test(creditsHtml),
    'La vista de créditos declara el copyright y las licencias de código y contenido');
  assert(/sin ánimo de lucro/.test(creditsHtml) && /coros/.test(creditsHtml) && CONTRIBUTIONS.some(c => /no son contractuales/i.test(c)) && CONTRIBUTIONS.some(c => /donaciones/.test(c)),
    'Declara el propósito pedagógico sin ánimo de lucro y que las contribuciones son libres, no contractuales y donaciones');
  assert(/pertenecen a sus respectivos autores/.test(creditsHtml) && /issues/.test(creditsHtml), 'Reconoce los derechos de terceros y ofrece un canal para solicitudes de retiro');
  assert(!renderCreditsHTML({ songs: [{ title: '<img src=x onerror=alert(1)>', author: '<b>x</b>' }] }).includes('<img src=x'), 'La vista de créditos escapa el HTML de los datos');
  assert(fs.existsSync(path.join(__dirname, 'LICENSE')) && fs.existsSync(path.join(__dirname, 'CREDITOS.md')), 'El repositorio incluye LICENSE y CREDITOS.md');
  assert(/data-nav="credits"/.test(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')) && /renderCreditsView\(\)/.test(appSrc), 'La pestaña 📚 Créditos está en la navegación');

  // ==================== 16. NAVIDAD: VILLANCICOS ====================
  console.log('\n🎄 16. Sección de Navidad (villancicos tradicionales y de dominio público)');
  const carols = MASTER_SONGS.filter(isChristmasSong);
  assert(carols.length >= 10, `Hay ${carols.length} villancicos (≥ 10)`);
  assert(['Tutaina', 'Vamos, Pastores, Vamos', 'Dulce Jesús Mío'].every(t => carols.some(c => c.title.startsWith(t))),
    'Incluye los villancicos de la Novena de Aguinaldos (Tutaina, Vamos Pastores, Gozos)');
  for (const c of carols) {
    const chords = [...c.content.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]);
    assert(chords.every(ch => getChordData(ch)) && c.progressionLoop.every(ch => getChordData(ch)),
      `Villancico "${c.title}": todos sus acordes existen en la biblioteca`);
  }
  const PROTECTED = /burrito sabanero|tamborilero|ni[ñn]o del tambor|feliz navidad|blanca navidad|navidad sin ti|rodolfo el reno/i;
  assert(!MASTER_SONGS.some(sg => PROTECTED.test(sg.title)), 'No incluye villancicos modernos con derechos vigentes (Mi Burrito Sabanero, El Tamborilero, Feliz Navidad…)');
  assert(carols.filter(c => c.category === 'popular').every(c => /tradicional|dominio público|\((1[0-8]\d\d|19[01]\d)\)|s\. XVIII/i.test(c.author)),
    'Cada villancico nuevo declara origen tradicional o de dominio público');
  assert(isChristmasSeason(new Date(2026, 10, 15)) && isChristmasSeason(new Date(2026, 11, 24)) && isChristmasSeason(new Date(2027, 0, 6)),
    'La temporada navideña va del 15 de noviembre al 6 de enero');
  assert(!isChristmasSeason(new Date(2026, 10, 14)) && !isChristmasSeason(new Date(2027, 0, 7)) && !isChristmasSeason(new Date(2026, 6, 1)),
    'Fuera de temporada no se muestra el aviso de Navidad');
  const nochePaz = TABS_DB.find(t => t.id === 'tab_noche_de_paz');
  const npMidis = nochePaz.steps.map(e => getFretMidi(e.s, e.f));
  // Noche de Paz (Gruber, 1818) en Do: G A G E · G A G E · D D B · C C G · A A C B A · G A G E · A A C B A · G A G E · D D F D B · C E · C G E · G F D · C
  const npExpected = [55,57,55,52, 55,57,55,52, 62,62,59, 60,60,55, 57,57,60,59,57, 55,57,55,52, 57,57,60,59,57, 55,57,55,52, 62,62,65,62,59, 60,64, 60,55,52, 55,53,50, 48];
  assert(npMidis.join(',') === npExpected.join(','), 'La melodía de "Noche de Paz" es correcta nota a nota');
  assert(nochePaz.steps.reduce((a, e) => a + e.dur, 0) === 23 * 3 && nochePaz.steps.every(e => e.f <= 4), 'Noche de Paz: 23 compases de 3/4 en primera posición');
  assert(MASTER_SONGS.find(sg => sg.id === 'pop_noche_de_paz').linkedTabId === 'tab_noche_de_paz', 'La canción Noche de Paz enlaza su tablatura');
  const ssSrc = fs.readFileSync(path.join(__dirname, 'js', 'song-studio.js'), 'utf8');
  const tpSrc = fs.readFileSync(path.join(__dirname, 'js', 'tab-player.js'), 'utf8');
  assert(/data-sgrp="navidad"/.test(ssSrc) && /data-cat="navidad"/.test(tpSrc) && /isChristmasSeason\(\)/.test(appSrc),
    'Filtros "🎄 Navidad" en Canciones y Tablaturas, y aviso de temporada en la Ruta');

  console.log('\n' + '='.repeat(72));
  console.log(`🎉 AUDITORÍA CULMINADA CON ÉXITO: ${passedChecks}/${totalChecks} VERIFICACIONES PASADAS`);
  console.log('='.repeat(72));
}

runAudit().catch(err => {
  console.error('\n❌ ERROR FATAL DURANTE LA AUDITORÍA:', err);
  process.exit(1);
});
