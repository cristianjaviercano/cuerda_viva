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
  NOTE_COLORS
} from './js/music-theory.js';
import { CHORDS_DB, getChordData } from './js/chords-db.js';
import { TABS_DB } from './js/tabs-db.js';
import { MASTER_SONGS } from './js/songs-db.js';
import { RHYTHM_PATTERNS } from './js/rhythm-trainer.js';
import {
  SKILL_UNITS,
  RETO_30_DIAS,
  THEORY_LIBRARY
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

  console.log('\n' + '='.repeat(72));
  console.log(`🎉 AUDITORÍA CULMINADA CON ÉXITO: ${passedChecks}/${totalChecks} VERIFICACIONES PASADAS`);
  console.log('='.repeat(72));
}

runAudit().catch(err => {
  console.error('\n❌ ERROR FATAL DURANTE LA AUDITORÍA:', err);
  process.exit(1);
});
