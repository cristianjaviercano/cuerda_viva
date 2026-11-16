// ============================================================================
// js/credits.js
// Agradecimientos, libros, derechos de autor y propósito del proyecto.
// La lista de autores de canciones se genera desde el cancionero y las
// tablaturas, para que nunca quede desactualizada.
// ============================================================================

export const REPO_URL = 'https://github.com/cristianjaviercano/cuerda_viva';
export const ISSUES_URL = `${REPO_URL}/issues`;

export const COPYRIGHT = {
  holder: 'Cristian Javier Cano Mogollón y colaboradores de CuerdaViva!',
  years: '2020–2026',
  baseProject: 'Proyecto base de código abierto de joaocarvalhoopen (2020)',
  codeLicense: 'Código fuente: licencia MIT',
  contentLicense: 'Contenido pedagógico original (lecciones, ejercicios, explicaciones y retos): Creative Commons BY-NC-SA 4.0 — uso libre, sin ánimo de lucro, citando la fuente y compartiendo igual'
};

export const PURPOSE = [
  'CuerdaViva! es un proyecto meramente pedagógico, de uso libre y sin ánimo de lucro.',
  'Nace para apoyar a los coros parroquiales, a los niños, niñas y jóvenes, y a toda persona que desee aprender guitarra e incursionar en la música, la alabanza y el folclor colombiano.',
  'Ninguna parte de la plataforma se vende ni se cobra; no contiene publicidad ni recoge datos con fines comerciales.'
];

export const CONTRIBUTIONS = [
  'Las colaboraciones y contribuciones (código, lecciones, canciones, correcciones, ideas o apoyo) son libres y voluntarias.',
  'No son contractuales, no generan relación laboral ni obligaciones para ninguna de las partes, y no son vinculantes.',
  'Se reciben como donaciones para el desarrollo de trabajos académicos y pedagógicos.',
  'Al contribuir, aceptas que tu aporte se publique bajo las mismas licencias del proyecto.'
];

export const RIGHTS_NOTICE = [
  'Las canciones, letras, melodías, arreglos y libros citados pertenecen a sus respectivos autores, compositores, arreglistas y editores. CuerdaViva! no reclama ningún derecho sobre ellos.',
  'Se citan con fines exclusivamente educativos, de estudio y de práctica musical, reconociendo siempre su autoría.',
  `Si eres titular de derechos y deseas que una obra se retire o se cite de otra forma, escríbenos en ${ISSUES_URL} y la atenderemos con prioridad.`
];

/** Libros y métodos que fundamentan las lecciones. */
export const BOOKS = [
  {
    title: 'Haga Música con la Guitarra',
    author: 'Keyner Ramírez Mojica',
    use: 'Método numérico cuerda-espacio (10–60), simbología + / - / 5ª, anatomía, posturas y repertorio colombiano (Pueblito Viejo, Oropel, Espumas, El Año Viejo).'
  },
  {
    title: 'Entre Cuerdas de Guitarra — Guía del Profesor',
    author: 'Carlos Mario Vásquez Rojas ("Camavaro")',
    use: 'Bajos alternos B1/B2, fundamentos del acompañamiento y aires del folclor colombiano.'
  },
  {
    title: 'Cuadernillo de Guitarra',
    author: 'Luis Medina y Juan Caliva',
    use: 'Arpegios y estudios de Ferdinando Carulli, digitación p-i-m-a y repertorio litúrgico.'
  },
  {
    title: 'Método de Guitarra 1',
    author: 'Iván Becerra',
    use: 'Ejercicio cromático "La Arañita" (1-2-3-4) e independencia de dedos.'
  },
  {
    title: 'Curso Completo para Aprender a Tocar la Guitarra',
    author: 'Autor no identificado en el documento',
    use: 'Consulta general de acordes y técnica básica.'
  },
  {
    title: 'Curso Completo de Teoría Musical 1',
    author: 'Autor no identificado en el documento',
    use: 'Consulta de teoría: intervalos, escalas y armonía funcional.'
  }
];

/** Otras fuentes, maestros y tradiciones citadas en las lecciones. */
export const OTHER_SOURCES = [
  { name: 'Fran Cordón', use: 'Biomecánica de la mano, cejilla sin dolor y acordes de color.' },
  { name: 'Cordantonopulos', use: 'Familias de acordes y armonía aplicada.' },
  { name: 'Ferdinando Carulli (1770–1841)', use: 'Estudios de arpegio p-i-m-a-m-i.' },
  { name: 'Cancionero Digital (comunidad católica)', use: 'Cifrados de alabanzas y cantos litúrgicos.' },
  { name: 'Sistema CAGED', use: 'Didáctica tradicional del mástil para guitarra.' },
  { name: 'Maestros del folclor colombiano', use: 'Rafael Escalona, Alejo Durán, Lucho Bermúdez, José Barros, Jorge Villamil y tantos otros cuyos aires inspiran las lecciones de ritmo.' }
];

export const UNCONFIRMED_AUTHOR = 'Cancionero Digital Católico (autoría por confirmar)';
const NOT_AN_AUTHOR = new Set(['cuaresma', 'fm', 'cancionero digital católico', 'cancionero digital']);

/**
 * Normaliza la autoría para agruparla: quita la fuente entre paréntesis o tras
 * "—"/" - " y, si el campo no parece un nombre (datos importados con títulos,
 * fechas o fragmentos de letra), la agrupa como "autoría por confirmar".
 */
export function normalizeAuthor(author) {
  const clean = String(author || '')
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s*[—–]\s*(Arr\.|Cancionero|Cuadernillo|Haga|Canciones|Libro).*$/i, '')
    .replace(/\s+-\s+.*$/, '')
    .replace(/\bS\.\s?J\./g, 'SJ.')
    .replace(/\s+/g, ' ')
    .trim();
  const looksLikeName = clean.length >= 3
    && /^\p{Lu}/u.test(clean)
    && !/[“”"«»]/.test(clean)
    && !/\d/.test(clean)
    && !/,\s*\p{Ll}/u.test(clean)
    && !/\s(y|el|la|los|las|de|del|que)$/i.test(clean)
    && !NOT_AN_AUTHOR.has(clean.toLowerCase());
  return looksLikeName ? clean : UNCONFIRMED_AUTHOR;
}

/**
 * Agrupa canciones y tablaturas por autor: [{ author, works: [títulos] }],
 * ordenado alfabéticamente.
 */
export function groupWorksByAuthor(songs = [], tabs = []) {
  const map = new Map();
  const add = (author, title) => {
    const key = normalizeAuthor(author);
    if (!map.has(key)) map.set(key, new Set());
    map.get(key).add(String(title || '').replace(/\s+—.*$/, '').trim());
  };
  songs.forEach(s => add(s.author, s.title));
  tabs.forEach(t => add(t.artist, t.title));
  return [...map.entries()]
    .map(([author, works]) => ({ author, works: [...works].filter(Boolean).sort((a, b) => a.localeCompare(b, 'es')) }))
    .sort((a, b) => a.author.localeCompare(b.author, 'es'));
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const linkify = s => esc(s).replace(esc(ISSUES_URL), `<a href="${ISSUES_URL}" target="_blank" rel="noopener">${esc(ISSUES_URL)}</a>`);

/** HTML de la vista "Agradecimientos y Libros". */
export function renderCreditsHTML({ songs = [], tabs = [] } = {}) {
  const authors = groupWorksByAuthor(songs, tabs);
  const totalWorks = authors.reduce((a, x) => a + x.works.length, 0);
  return `
    <div class="credits-page">
      <div class="duo-card credits-hero">
        <span class="badge-vivid badge-green">📚 Agradecimientos y Libros</span>
        <h1>Gracias a quienes hacen posible aprender música</h1>
        <p>${PURPOSE.map(esc).join(' ')}</p>
      </div>

      <div class="credits-grid">
        <section class="duo-card credits-card">
          <h2>📖 Libros y métodos</h2>
          <p class="muted-hint">Agradecemos a sus autores: sus obras son la base de las lecciones.</p>
          <ul class="credits-list">
            ${BOOKS.map(b => `<li><strong>${esc(b.title)}</strong> — ${esc(b.author)}<br><small>${esc(b.use)}</small></li>`).join('')}
          </ul>
          <h3>Otras fuentes y maestros</h3>
          <ul class="credits-list">
            ${OTHER_SOURCES.map(o => `<li><strong>${esc(o.name)}</strong><br><small>${esc(o.use)}</small></li>`).join('')}
          </ul>
        </section>

        <section class="duo-card credits-card">
          <h2>🎶 Autores de las canciones</h2>
          <p class="muted-hint">Gracias a los ${authors.length} compositores, comunidades y tradiciones de las ${totalWorks} obras del cancionero y las tablaturas.
            ¿Conoces el autor de una obra marcada «autoría por confirmar»? Ayúdanos a completarlo en <a href="${ISSUES_URL}" target="_blank" rel="noopener">GitHub</a>.</p>
          <ul class="credits-list credits-authors">
            ${authors.map(a => `<li><strong>${esc(a.author)}</strong><br><small>${a.works.map(esc).join(' · ')}</small></li>`).join('')}
          </ul>
        </section>
      </div>

      <div class="credits-grid">
        <section class="duo-card credits-card">
          <h2>©️ Derechos de autor</h2>
          <p><strong>© ${esc(COPYRIGHT.years)} ${esc(COPYRIGHT.holder)}.</strong></p>
          <ul class="credits-list">
            <li>${esc(COPYRIGHT.codeLicense)}.</li>
            <li>${esc(COPYRIGHT.contentLicense)}.</li>
            <li>${esc(COPYRIGHT.baseProject)}.</li>
          </ul>
          ${RIGHTS_NOTICE.map(t => `<p>${linkify(t)}</p>`).join('')}
        </section>

        <section class="duo-card credits-card">
          <h2>🤝 Propósito y contribuciones</h2>
          ${PURPOSE.map(t => `<p>${esc(t)}</p>`).join('')}
          <h3>Colaboraciones</h3>
          <ul class="credits-list">
            ${CONTRIBUTIONS.map(t => `<li>${esc(t)}</li>`).join('')}
          </ul>
          <p><a class="duo-btn btn-blue btn-sm" href="${REPO_URL}" target="_blank" rel="noopener">💻 Repositorio del proyecto</a></p>
        </section>
      </div>
    </div>`;
}
