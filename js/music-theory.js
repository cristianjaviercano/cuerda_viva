// ============================================================================
// js/music-theory.js
// Motor de Teoría Musical, Colores Cromáticos Vivos (Estilo Duolingo/Boomwhackers),
// Transposición, Análisis de Funciones Armónicas y Calculadora de Capotraste.
// ============================================================================

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const NOTES_ES = {
  'C': 'Do',
  'C#': 'Do#',
  'Db': 'Reb',
  'D': 'Re',
  'D#': 'Re#',
  'Eb': 'Mib',
  'E': 'Mi',
  'F': 'Fa',
  'F#': 'Fa#',
  'Gb': 'Solb',
  'G': 'Sol',
  'G#': 'Sol#',
  'Ab': 'Lab',
  'A': 'La',
  'A#': 'Sib',
  'Bb': 'Sib',
  'B': 'Si'
};

export const FLAT_TO_SHARP = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#',
  'Cb': 'B',
  'Fb': 'E'
};

// Paleta cromática viva estilo Duolingo + Boomwhackers para memoria visual instantánea
export const NOTE_COLORS = {
  'C':  { bg: '#FF4B4B', border: '#D33131', text: '#FFFFFF', light: '#FFE5E5', name: 'Rojo Do' },
  'C#': { bg: '#FF6D3F', border: '#D84E22', text: '#FFFFFF', light: '#FFEBE3', name: 'Coral Do#' },
  'D':  { bg: '#FF9600', border: '#D67B00', text: '#FFFFFF', light: '#FFF0D6', name: 'Naranja Re' },
  'D#': { bg: '#FFB300', border: '#D49200', text: '#2B2100', light: '#FFF6DB', name: 'Ámbar Re#' },
  'E':  { bg: '#FFC800', border: '#D9A600', text: '#2B2100', light: '#FFF9DB', name: 'Sol Mi' },
  'F':  { bg: '#58CC02', border: '#46A302', text: '#FFFFFF', light: '#E6F9D5', name: 'Verde Fa' },
  'F#': { bg: '#00C853', border: '#009B3E', text: '#FFFFFF', light: '#DCFCE7', name: 'Esmeralda Fa#' },
  'G':  { bg: '#00CD9C', border: '#00A37B', text: '#FFFFFF', light: '#D8FBF2', name: 'Turquesa Sol' },
  'G#': { bg: '#00B8D4', border: '#008FA6', text: '#FFFFFF', light: '#D9F7FC', name: 'Cian Sol#' },
  'A':  { bg: '#1CB0F6', border: '#148AC2', text: '#FFFFFF', light: '#DDF3FE', name: 'Azul La' },
  'A#': { bg: '#6C63FF', border: '#4E46D9', text: '#FFFFFF', light: '#E8E7FF', name: 'Índigo Sib' },
  'B':  { bg: '#CE82FF', border: '#A55EEA', text: '#FFFFFF', light: '#F5E8FF', name: 'Violeta Si' }
};

// Afinación estándar de guitarra (6ª a 1ª cuerda: índices 0 a 5, o por cuerda 1..6)
// Convención en este motor: STRING_OPEN_MIDI[0] = 6ª cuerda (E2 = 40) ... [5] = 1ª cuerda (E4 = 64)
export const STRING_OPEN_MIDI = [40, 45, 50, 55, 59, 64];
export const STRING_LABELS_6_TO_1 = [
  { num: 6, note: 'E', noteEs: 'Mi grave', freq: 82.41, midi: 40 },
  { num: 5, note: 'A', noteEs: 'La',       freq: 110.00, midi: 45 },
  { num: 4, note: 'D', noteEs: 'Re',       freq: 146.83, midi: 50 },
  { num: 3, note: 'G', noteEs: 'Sol',      freq: 196.00, midi: 55 },
  { num: 2, note: 'B', noteEs: 'Si',       freq: 246.94, midi: 59 },
  { num: 1, note: 'E', noteEs: 'Mi agudo', freq: 329.63, midi: 64 }
];

// Escalas y Mapas Pentatónicos (de los libros de Camavaro, Fran Cordón y Cordantonopulos)
export const SCALES = {
  major: {
    name: 'Escala Mayor (Jónica)',
    formula: 'T - T - ST - T - T - T - ST',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    usage: 'Melodías alegres de Alabanza, Paseos Vallenatos mayores (Los Caminos de la Vida, Matilde Lina).'
  },
  minor_natural: {
    name: 'Menor Natural (Eólica)',
    formula: 'T - ST - T - T - ST - T - T',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    usage: 'Cantos de meditación/Cuaresma, La Gota Fría (Am), La Piragua (Am).'
  },
  pentatonic_minor: {
    name: 'Mapa Pentatónico Menor',
    formula: '1 - b3 - 4 - 5 - b7',
    intervals: [0, 3, 5, 7, 10],
    usage: 'El "Mapa" infalible del método Entre Cuerdas para improvisar sin notas falsas.'
  },
  pentatonic_major: {
    name: 'Mapa Pentatónico Mayor',
    formula: '1 - 2 - 3 - 5 - 6',
    intervals: [0, 2, 4, 7, 9],
    usage: 'Punteos vallenatos dulces, intros de adoración y arreglos campestres.'
  },
  mixolydian: {
    name: 'Modo Mixolidio (Sabor Vallenato V7)',
    formula: '1 - 2 - 3 - 4 - 5 - 6 - b7',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    usage: '¡El sonido del acordeón vallenato y porros sabaneros sobre acordes dominantes (G7, D7, C7)!'
  },
  harmonic_minor: {
    name: 'Menor Armónica (Tensión E7 → Am)',
    formula: '1 - 2 - b3 - 4 - 5 - b6 - 7',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    usage: 'Esencial cuando aparece el acorde E7 resolviendo a Am en Cumbias, Vallenatos y Cantos Litúrgicos.'
  },
  dorian: {
    name: 'Modo Dórico (IIm)',
    formula: '1 - 2 - b3 - 4 - 5 - 6 - b7',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    usage: 'Color moderno para adoración contemporánea sobre progresiones IIm - V.'
  }
};

export function normalizeNote(note) {
  if (!note) return 'C';
  const clean = note.trim();
  if (FLAT_TO_SHARP[clean]) return FLAT_TO_SHARP[clean];
  if (NOTES.includes(clean)) return clean;
  // Intentar desde español
  const lower = clean.toLowerCase();
  const map = {
    'do': 'C', 'do#': 'C#', 'reb': 'C#',
    're': 'D', 're#': 'D#', 'mib': 'D#',
    'mi': 'E',
    'fa': 'F', 'fa#': 'F#', 'solb': 'F#',
    'sol': 'G', 'sol#': 'G#', 'lab': 'G#',
    'la': 'A', 'la#': 'A#', 'sib': 'A#',
    'si': 'B'
  };
  return map[lower] || 'C';
}

export function getNoteColor(noteOrChord) {
  const { root } = parseChord(normalizeChordToAmerican(noteOrChord || 'C'));
  const norm = normalizeNote(root || noteOrChord);
  return NOTE_COLORS[norm] || NOTE_COLORS['C'];
}

export function midiToNoteInfo(midi) {
  const noteIdx = ((midi % 12) + 12) % 12;
  const note = NOTES[noteIdx];
  const octave = Math.floor(midi / 12) - 1;
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  return {
    midi,
    note,
    noteEs: NOTES_ES[note] || note,
    octave,
    freq,
    color: NOTE_COLORS[note]
  };
}

export function getFretMidi(stringNum1To6, fret) {
  // stringNum1To6: 1 = 1ª cuerda aguda (E4=64), 6 = 6ª cuerda grave (E2=40)
  const idx6To1 = 6 - stringNum1To6;
  return STRING_OPEN_MIDI[idx6To1] + fret;
}

// Convención numérica de Keyner Ramírez Mojica ("Haga Música con la Guitarra"):
// Primer dígito = cuerda (1..6), restantes dígitos = espacio/traste (0..22)
export function toKeynerFretCode(stringNum1To6, fret) {
  return `${stringNum1To6}${fret}`;
}

export function parseKeynerFretCode(code) {
  const s = String(code || '').trim();
  if (!/^[1-6]\d{1,2}$/.test(s)) return null;
  const stringNum = parseInt(s[0], 10);
  const fret = parseInt(s.slice(1), 10);
  if (fret < 0 || fret > 22) return null;
  return { stringNum, fret, s: stringNum, f: fret, code: s, midi: getFretMidi(stringNum, fret) };
}

export function formatKeynerChordSymbol(chord) {
  if (!chord) return '';
  const norm = normalizeChordToAmerican(chord);
  const mainOnly = norm.split('/')[0];
  const { root, suffix } = parseChord(mainOnly);
  const rootEs = (NOTES_ES[root] || root).toUpperCase();
  if (suffix.includes('dim')) return `DIS. (${NOTES_ES[root] || root})`;
  if (suffix === '7' || suffix === '9' || suffix === '13') {
    const idx = NOTES.indexOf(root);
    if (idx !== -1) {
      const targetTonic = NOTES[(idx + 5) % 12];
      return `5ª ${(NOTES_ES[targetTonic] || targetTonic).toUpperCase()}`;
    }
  }
  if (suffix === 'm' || suffix === 'min') return `${rootEs}-`;
  if (suffix === '') return `${rootEs}+`;
  return `${rootEs}${suffix}`;
}

export function latinToAmericanRoot(latinRoot) {
  let base = latinRoot;
  let acc = '';
  if (latinRoot.endsWith('#') || latinRoot.endsWith('b')) {
    base = latinRoot.slice(0, -1);
    acc = latinRoot.slice(-1);
  }
  const map = { do: 'C', re: 'D', mi: 'E', fa: 'F', sol: 'G', la: 'A', si: 'B' };
  const am = map[base.toLowerCase()];
  return am ? am + acc : latinRoot;
}

export function normalizeChordToAmerican(chord) {
  if (!chord) return '';
  const trimmed = chord.trim();
  if (trimmed.includes('/')) {
    const [main, bass] = trimmed.split('/');
    return `${normalizeChordToAmerican(main)}/${normalizeChordToAmerican(bass)}`;
  }
  const latinMatch = trimmed.match(/^(do|re|mi|fa|sol|la|si)(#|b)?(.*)$/i);
  if (latinMatch) {
    const root = latinToAmericanRoot(latinMatch[1] + (latinMatch[2] || ''));
    let suffix = latinMatch[3] || '';
    if (suffix.startsWith('-')) suffix = 'm' + suffix.slice(1);
    return normalizeRootAccidental(root) + suffix;
  }
  const amMatch = trimmed.match(/^([a-gA-G])(#|b)?(.*)$/);
  if (amMatch) {
    const root = amMatch[1].toUpperCase() + (amMatch[2] || '');
    let suffix = amMatch[3] || '';
    if (suffix.startsWith('-')) suffix = 'm' + suffix.slice(1);
    return normalizeRootAccidental(root) + suffix;
  }
  return trimmed;
}

function normalizeRootAccidental(root) {
  if (FLAT_TO_SHARP[root]) return FLAT_TO_SHARP[root];
  return root;
}

export function parseChord(chord) {
  const norm = normalizeChordToAmerican(chord);
  if (!norm) return { root: 'C', suffix: '', bass: '' };
  const [main, bass = ''] = norm.split('/');
  const m = main.match(/^([A-G]#?)(.*)$/);
  if (!m) return { root: 'C', suffix: '', bass: '' };
  return {
    root: m[1],
    suffix: m[2] || '',
    bass: bass ? normalizeRootAccidental(bass) : ''
  };
}

export function formatChordLabel(chord, mode = 'dual') {
  // mode: 'dual' ('Do · C'), 'american' ('C'), 'latin' ('Do'), 'keyner' ('DO+ / LA- / 5ª LA')
  if (!chord) return '';
  if (mode === 'keyner') return formatKeynerChordSymbol(chord);
  const norm = normalizeChordToAmerican(chord);
  const { root, suffix, bass } = parseChord(norm);
  const rootEs = NOTES_ES[root] || root;
  const bassEs = bass ? `/${NOTES_ES[bass] || bass}` : '';
  const bassAm = bass ? `/${bass}` : '';

  if (mode === 'american') return `${root}${suffix}${bassAm}`;
  if (mode === 'latin') return `${rootEs}${suffix}${bassEs}`;
  return `${root}${suffix}${bassAm} (${rootEs}${suffix})`;
}

export function formatChordShortEs(chord) {
  if (!chord) return '';
  const { root, suffix, bass } = parseChord(chord);
  const rootEs = NOTES_ES[root] || root;
  const bassEs = bass ? `/${NOTES_ES[bass] || bass}` : '';
  return `${rootEs}${suffix}${bassEs}`;
}

export function transposeChord(chord, semitones) {
  if (!chord || semitones === 0) return normalizeChordToAmerican(chord);
  const norm = normalizeChordToAmerican(chord);
  if (norm.includes('/')) {
    const [m, b] = norm.split('/');
    return `${transposeChord(m, semitones)}/${transposeChord(b, semitones)}`;
  }
  const { root, suffix } = parseChord(norm);
  const idx = NOTES.indexOf(root);
  if (idx === -1) return norm;
  const nextIdx = ((idx + semitones) % 12 + 12) % 12;
  return `${NOTES[nextIdx]}${suffix}`;
}

export function transposeSongContent(content, semitones) {
  if (!content) return '';
  return content.replace(/\[([^\]]+)\]/g, (_, rawChord) => {
    const clean = rawChord.trim();
    if (!isValidChord(clean)) return `[${rawChord}]`;
    return `[${transposeChord(clean, semitones)}]`;
  });
}

export function isValidChord(token) {
  if (!token) return false;
  const clean = token.trim();
  return /^(?:do|re|mi|fa|sol|la|si|[a-gA-G])(?:#|b)?(?:m|min|maj7|maj|dim7|dim|aug|sus2|sus4|add9|m7b5|m7|m6|7sus4|2|4|5|6|7|9|11|13|-)?(?:\/(?:do|re|mi|fa|sol|la|si|[a-gA-G])(?:#|b)?)?$/i.test(clean);
}

// Parsea letra con acordes [G]palabra en líneas y segmentos alineados a cada sílaba
export function parseSongLines(content, transpose = 0) {
  if (!content) return [];
  return content.split('\n').map(rawLine => {
    const trimmed = rawLine.trim();
    const isSectionHeader = /^(INTRO|ESTROFA|VERSO|CORO|ESTRIBILLO|PUENTE|FINAL|CODA|PRE-CORO|PUNTEO)/i.test(trimmed) && !trimmed.includes('[');
    if (isSectionHeader) {
      return { type: 'header', text: trimmed, segments: [] };
    }

    const regex = /\[([^\]]+)\]/g;
    const segments = [];
    let lastIndex = 0;
    let match;
    let pendingChord = null;

    while ((match = regex.exec(rawLine)) !== null) {
      const textBefore = rawLine.slice(lastIndex, match.index);
      if (textBefore.length > 0 || pendingChord) {
        segments.push({
          chord: pendingChord,
          lyric: textBefore
        });
      }
      const rawChord = match[1].trim();
      pendingChord = isValidChord(rawChord)
        ? transposeChord(rawChord, transpose)
        : rawChord;
      lastIndex = regex.lastIndex;
    }

    const tail = rawLine.slice(lastIndex);
    if (tail.length > 0 || pendingChord) {
      segments.push({
        chord: pendingChord,
        lyric: tail
      });
    }

    if (segments.length === 0) {
      return { type: 'empty', text: '', segments: [] };
    }

    const hasLyrics = segments.some(s => s.lyric && s.lyric.trim().length > 0);
    return {
      type: hasLyrics ? 'lyric' : 'chords_only',
      segments
    };
  });
}

export function extractSongChords(content, transpose = 0) {
  const sequence = [];
  const regex = /\[([^\]]+)\]/g;
  let m;
  while ((m = regex.exec(content || '')) !== null) {
    const raw = m[1].trim();
    if (!isValidChord(raw)) continue;
    const c = transposeChord(raw, transpose);
    if (sequence[sequence.length - 1] !== c) {
      sequence.push(c);
    }
  }
  return sequence;
}

export function detectKeyFromChords(chords, explicitKey = '') {
  if (explicitKey) {
    const norm = normalizeChordToAmerican(explicitKey);
    const { root, suffix } = parseChord(norm);
    const isMinor = suffix.startsWith('m') && !suffix.startsWith('maj');
    return `${root}${isMinor ? 'm' : ''}`;
  }
  if (!chords || chords.length === 0) return 'C';
  const last = chords[chords.length - 1];
  const { root, suffix } = parseChord(last);
  const isMinor = suffix.startsWith('m') && !suffix.startsWith('maj');
  return `${root}${isMinor ? 'm' : ''}`;
}

// ============================================================================
// ANÁLISIS DE FUNCIÓN ARMÓNICA (Basado en Vanesa Cordantonopulos & Fran Cordón)
// ============================================================================
export function analyzeHarmonicFunction(chord, songKey = 'C') {
  const { root: chordRoot, suffix } = parseChord(chord);
  const { root: keyRoot, suffix: keySuffix } = parseChord(songKey);
  const isMinorKey = keySuffix.startsWith('m') && !keySuffix.startsWith('maj');

  const keyIdx = NOTES.indexOf(keyRoot);
  const chordIdx = NOTES.indexOf(chordRoot);
  if (keyIdx === -1 || chordIdx === -1) {
    return { roman: '?', role: 'Acorde de Paso', family: 'paso', badgeColor: '#94A3B8' };
  }

  const interval = ((chordIdx - keyIdx) % 12 + 12) % 12;
  const isChordMinor = suffix.startsWith('m') && !suffix.startsWith('maj');
  const isDom7 = suffix === '7' || suffix === '9' || suffix === '13';
  const isDim = suffix.includes('dim') || suffix.includes('m7b5');

  if (!isMinorKey) {
    // Tonalidad Mayor
    if (interval === 0 && !isChordMinor && !isDom7) {
      return { roman: 'I', role: 'Tónica (Hogar / Reposo)', family: 'tonica', badgeColor: '#58CC02' };
    }
    if (interval === 0 && isDom7) {
      return { roman: 'V7/IV', role: 'Dominante Secundario → pide ir al IV', family: 'dominante_sec', badgeColor: '#FF9600' };
    }
    if (interval === 2 && isChordMinor) {
      return { roman: 'IIm', role: 'Subdominante suave', family: 'subdominante', badgeColor: '#1CB0F6' };
    }
    if (interval === 2 && !isChordMinor) {
      return { roman: 'V7/V', role: 'Dominante Secundario → empuja al V', family: 'dominante_sec', badgeColor: '#FF9600' };
    }
    if (interval === 4 && isChordMinor) {
      return { roman: 'IIIm', role: 'Tónica suave / Mediante', family: 'tonica', badgeColor: '#58CC02' };
    }
    if (interval === 4 && !isChordMinor) {
      return { roman: 'V7/VI', role: 'Dominante Secundario → llama al VIm', family: 'dominante_sec', badgeColor: '#FF9600' };
    }
    if (interval === 5 && !isChordMinor) {
      return { roman: 'IV', role: 'Subdominante (Viaje / Apertura)', family: 'subdominante', badgeColor: '#1CB0F6' };
    }
    if (interval === 5 && isChordMinor) {
      return { roman: 'IVm', role: 'Subdominante Menor (Intercambio nostálgico)', family: 'subdominante', badgeColor: '#6C63FF' };
    }
    if (interval === 7) {
      return { roman: isDom7 ? 'V7' : 'V', role: 'Dominante (Máxima tensión → vuelve a I)', family: 'dominante', badgeColor: '#FF4B4B' };
    }
    if (interval === 9 && isChordMinor) {
      return { roman: 'VIm', role: 'Relativo Menor (Tónica emotiva)', family: 'tonica', badgeColor: '#00CD9C' };
    }
    if (interval === 9 && !isChordMinor) {
      return { roman: 'V7/II', role: 'Dominante Secundario → llama al IIm', family: 'dominante_sec', badgeColor: '#FF9600' };
    }
    if (interval === 10) {
      return { roman: 'bVII', role: 'Subtónica modal (Puente épico)', family: 'subdominante', badgeColor: '#CE82FF' };
    }
    if (interval === 11 || isDim) {
      return { roman: 'VII°', role: 'Sensible Dominante', family: 'dominante', badgeColor: '#FF4B4B' };
    }
  } else {
    // Tonalidad Menor (ej. La Gota Fría, La Piragua en Am)
    if (interval === 0 && isChordMinor) {
      return { roman: 'Im', role: 'Tónica Menor (Centro)', family: 'tonica', badgeColor: '#58CC02' };
    }
    if (interval === 0 && !isChordMinor) {
      return { roman: 'I Mayor', role: 'Tercera de Picardía / V7/IVm', family: 'dominante_sec', badgeColor: '#FF9600' };
    }
    if (interval === 3) {
      return { roman: 'bIII', role: 'Relativo Mayor (Luz)', family: 'tonica', badgeColor: '#00CD9C' };
    }
    if (interval === 5) {
      return { roman: isChordMinor ? 'IVm' : 'IV', role: 'Subdominante', family: 'subdominante', badgeColor: '#1CB0F6' };
    }
    if (interval === 7) {
      return { roman: isChordMinor ? 'Vm' : (isDom7 ? 'V7' : 'V'), role: 'Dominante Armónica → resuelve a Im', family: 'dominante', badgeColor: '#FF4B4B' };
    }
    if (interval === 8) {
      return { roman: 'bVI', role: 'Submediante (Clásico andino/católico)', family: 'subdominante', badgeColor: '#1CB0F6' };
    }
    if (interval === 10) {
      return { roman: 'bVII', role: 'Subtónica (Cadencia folclórica)', family: 'dominante', badgeColor: '#CE82FF' };
    }
  }

  return { roman: formatChordShortEs(chord), role: 'Color cromático', family: 'paso', badgeColor: '#94A3B8' };
}

// ============================================================================
// CALCULADORA INTELIGENTE DE CAPOTRASTE (Para tocar sin cejillas difíciles)
// ============================================================================
const EASY_OPEN_CHORDS = new Set([
  'C', 'D', 'E', 'G', 'A', 'Am', 'Dm', 'Em',
  'A7', 'B7', 'C7', 'D7', 'E7', 'G7',
  'Am7', 'Dm7', 'Em7', 'Cmaj7', 'Fmaj7', 'Dsus4', 'Asus2'
]);

export function suggestCapoOptions(chords) {
  const unique = Array.from(new Set(chords.map(c => normalizeChordToAmerican(c).split('/')[0])));
  if (unique.length === 0) return [];
  const results = [];

  for (let capo = 0; capo <= 7; capo++) {
    const shapes = unique.map(c => transposeChord(c, -capo));
    let penalty = capo * 0.25;
    let barreCount = 0;
    for (const s of shapes) {
      if (EASY_OPEN_CHORDS.has(s)) continue;
      if (s === 'F' || s === 'Bm') {
        penalty += 1.2;
        barreCount++;
      } else {
        penalty += 2.5;
        barreCount++;
      }
    }
    results.push({
      capo,
      shapes,
      barreCount,
      score: penalty
    });
  }

  return results.sort((a, b) => a.score - b.score).slice(0, 3);
}

// Obtiene las notas individuales (clases de altura 0..11) que componen un acorde
// para verificación polifónica por micrófono / entrada de línea
export function getChordPitchClasses(chordName) {
  const { root, suffix } = parseChord(chordName);
  const rootIdx = NOTES.indexOf(root);
  if (rootIdx === -1) return [];

  let intervals = [0, 4, 7];
  if (suffix.startsWith('m7b5')) intervals = [0, 3, 6, 10];
  else if (suffix.startsWith('dim7')) intervals = [0, 3, 6, 9];
  else if (suffix.startsWith('dim')) intervals = [0, 3, 6];
  else if (suffix.startsWith('maj7') || suffix.startsWith('M7')) intervals = [0, 4, 7, 11];
  else if (suffix.startsWith('m7')) intervals = [0, 3, 7, 10];
  else if (suffix.startsWith('m') && !suffix.startsWith('maj')) intervals = [0, 3, 7];
  else if (suffix.startsWith('sus4')) intervals = [0, 5, 7];
  else if (suffix.startsWith('sus2')) intervals = [0, 2, 7];
  else if (suffix.startsWith('7')) intervals = [0, 4, 7, 10];
  else if (suffix.startsWith('add9')) intervals = [0, 2, 4, 7];

  return intervals.map(i => (rootIdx + i) % 12);
}

