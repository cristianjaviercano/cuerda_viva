// ============================================================================
// js/tabs-db.js
// Biblioteca Curada de Tablaturas Interactivas:
// 1. Punteos y Bajeos de Vallenatos y Folclor Colombiano
// 2. Intros, Melodías y Arpegios de Alabanzas y Adoración Católica
// 3. Estudios Técnicos Progresivos de los 5 Libros en /Metodos
// ============================================================================

// Estructura de cada evento (step) en una tablatura:
// - s: cuerda (1 = 1ª Mi agudo ... 6 = 6ª Mi grave)  | o notes: [{s, f, finger}] para acordes/dobles cuerdas
// - f: traste (0 = al aire)
// - finger: dedo mano izquierda sugerido (0 = aire, 1 = índice, 2 = medio, 3 = anular, 4 = meñique)
// - dur: duración en pulsos (1 = negra, 0.5 = corchea, 2 = blanca, 1.5 = negra con puntillo, 0.25 = semicorchea)
// - chord: acorde de acompañamiento opcional que inicia en este evento
// - tech: técnica opcional ('h' ligado, 'p' pull-off, '/' slide, 'v' vibrato, 'B1' bajo 1, 'B2' bajo 2)
// - lyric: sílaba o guía pedagógica opcional debajo de la nota

export const TABS_DB = [
  // ==========================================================================
  // CATEGORÍA 1: VALLENATOS Y FOLCLOR COLOMBIANO
  // ==========================================================================
  {
    id: 'tab_caminos_vida',
    title: 'Los Caminos de la Vida — Punteo Clásico',
    artist: 'Omar Geles / Los Diablitos',
    category: 'vallenato',
    subgenre: 'Paseo Vallenato',
    key: 'Am',
    bpm: 88,
    difficulty: 2,
    recommendedInstrument: 'accordion',
    youtubeQuery: 'tutorial punteo guitarra los caminos de la vida tablatura',
    description: '¡El punteo vallenato más famoso de Colombia! Recorre la progresión circular Am → Dm → G → C → F → E7 → Am imitando la melodía nostálgica del acordeón en la 1ª y 2ª cuerda.',
    tips: [
      'Usa dedo índice (1) y medio (2) alternados en la mano derecha ("caminando") sin repetir dedo.',
      'Prueba cambiar el timbre arriba entre "Acordeón Vallenato" y "Requinto Acústico" para escuchar ambos colores.',
      'Activa el modo "🎙️ Espera mi Guitarra" para dominarlo nota por nota a tu propio ritmo.'
    ],
    steps: [
      // Frase 1: Am -> Dm
      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'Am', lyric: 'Intro' },
      { s: 1, f: 8, finger: 4, dur: 1.0, tech: 'v' },
      { s: 1, f: 7, finger: 3, dur: 0.5 },
      { s: 1, f: 5, finger: 1, dur: 0.5 },
      { s: 1, f: 3, finger: 1, dur: 0.5 },
      { s: 1, f: 1, finger: 1, dur: 1.5, chord: 'Dm' },
      // Frase 2: G -> C
      { s: 2, f: 3, finger: 3, dur: 0.5, chord: 'G' },
      { s: 1, f: 7, finger: 4, dur: 1.0, tech: 'v' },
      { s: 1, f: 5, finger: 2, dur: 0.5 },
      { s: 1, f: 3, finger: 1, dur: 0.5 },
      { s: 1, f: 1, finger: 1, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 1.5, chord: 'C' },
      // Frase 3: F -> E7 -> Am
      { s: 2, f: 1, finger: 1, dur: 0.5, chord: 'F' },
      { s: 1, f: 5, finger: 4, dur: 1.0 },
      { s: 1, f: 3, finger: 2, dur: 0.5 },
      { s: 1, f: 1, finger: 1, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'E7' },
      { s: 2, f: 3, finger: 3, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 3, f: 2, finger: 2, dur: 2.0, chord: 'Am', tech: 'v', lyric: 'Cierre' }
    ]
  },

  {
    id: 'tab_gota_fria',
    title: 'La Gota Fría — Punteo Tradicional',
    artist: 'Emiliano Zuleta / Carlos Vives',
    category: 'vallenato',
    subgenre: 'Paseo / Merengue Vallenato',
    key: 'Am',
    bpm: 102,
    difficulty: 1,
    recommendedInstrument: 'requinto',
    youtubeQuery: 'la gota fria punteo guitarra tablatura tutorial',
    description: 'Punteo costeño lleno de sabor en primera posición (trastes 0 a 3). Ideal para empezar en el punteo vallenato porque no requiere saltos largos de mano.',
    tips: [
      'Observa la nota Sol# (3ª cuerda traste 1) sobre el acorde E7: proviene de la Escala Menor Armónica.',
      'Si quieres tocarla encima de la grabación original de Carlos Vives, coloca Capotraste en el traste 1.'
    ],
    steps: [
      { s: 3, f: 2, finger: 2, dur: 0.5, chord: 'Am', lyric: 'Pique' },
      { s: 3, f: 2, finger: 2, dur: 0.5 },
      { s: 3, f: 2, finger: 2, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 2, f: 3, finger: 3, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 2, f: 0, finger: 0, dur: 0.5, chord: 'E7' },
      { s: 3, f: 2, finger: 2, dur: 1.0, chord: 'Am' },

      { s: 2, f: 0, finger: 0, dur: 0.5, chord: 'E7' },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 2, f: 3, finger: 3, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 3, f: 1, finger: 1, dur: 0.5, lyric: 'Sol#' },
      { s: 3, f: 2, finger: 2, dur: 1.5, chord: 'Am', tech: 'v' },

      { s: 2, f: 1, finger: 1, dur: 0.5, chord: 'C' },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      { s: 1, f: 3, finger: 3, dur: 1.0, chord: 'G7' },
      { s: 1, f: 1, finger: 1, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'C' },
      { s: 2, f: 3, finger: 3, dur: 0.5, chord: 'E7' },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 3, f: 2, finger: 2, dur: 1.5, chord: 'Am', tech: 'v' }
    ]
  },

  {
    id: 'tab_ausencia_sentimental',
    title: 'Ausencia Sentimental — Intro Lírica',
    artist: 'Rafael Manjarrés / Silvio Brito',
    category: 'vallenato',
    subgenre: 'Paseo Vallenato Romántico',
    key: 'G',
    bpm: 82,
    difficulty: 2,
    recommendedInstrument: 'requinto',
    youtubeQuery: 'ausencia sentimental intro guitarra tablatura',
    description: 'Himno del Festival de la Leyenda Vallenata. Una melodía cantabile en Sol Mayor que enseña el fraseo expresivo del paseo romántico.',
    tips: [
      'Deja vibrar las notas largas (blancas y negras con puntillo) como si cantaras cada frase.',
      'Fíjate cómo pasa por E7 (Dominante secundario V7/VI) hacia Am antes de resolver con D7 → G.'
    ],
    steps: [
      { s: 3, f: 0, finger: 0, dur: 0.5, chord: 'G', lyric: 'Frase 1' },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 2, f: 3, finger: 3, dur: 1.0 },
      { s: 1, f: 3, finger: 3, dur: 1.0, tech: 'v' },
      { s: 1, f: 2, finger: 2, dur: 0.5, chord: 'D/F#' },
      { s: 1, f: 0, finger: 0, dur: 1.0, chord: 'Em' },

      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'E7' },
      { s: 2, f: 3, finger: 3, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 1.0, chord: 'Am' },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 3, finger: 3, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5, chord: 'C' },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 3, f: 2, finger: 2, dur: 1.0, chord: 'D7' },

      { s: 2, f: 3, finger: 3, dur: 0.5, chord: 'D7' },
      { s: 1, f: 2, finger: 2, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 3, finger: 3, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 3, f: 0, finger: 0, dur: 2.0, chord: 'G', tech: 'v', lyric: 'Sol!' }
    ]
  },

  {
    id: 'tab_sin_medir_distancias',
    title: 'Sin Medir Distancias — Punteo Romántico',
    artist: 'Gustavo Gutiérrez / Diomedes Díaz',
    category: 'vallenato',
    subgenre: 'Paseo Lírico',
    key: 'D',
    bpm: 78,
    difficulty: 2,
    recommendedInstrument: 'requinto',
    youtubeQuery: 'sin medir distancias intro guitarra tutorial tab',
    description: 'Joya poética de Valledupar en Re Mayor. Trabaja la posición media del mástil (trastes 2 al 5) con ligados dulces.',
    tips: [
      'Mantén el dedo 1 como ancla en el traste 2 (posición II) para alcanzar cómodamente el traste 5 con el meñique (dedo 4).'
    ],
    steps: [
      { s: 3, f: 2, finger: 1, dur: 0.5, chord: 'D', lyric: 'Herida...' },
      { s: 2, f: 3, finger: 2, dur: 0.5 },
      { s: 1, f: 2, finger: 1, dur: 1.0 },
      { s: 1, f: 3, finger: 2, dur: 0.5 },
      { s: 1, f: 5, finger: 4, dur: 1.0, chord: 'Bm', tech: 'v' },
      { s: 1, f: 3, finger: 2, dur: 0.5 },
      { s: 1, f: 2, finger: 1, dur: 1.0 },

      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'G' },
      { s: 1, f: 2, finger: 1, dur: 0.5 },
      { s: 1, f: 3, finger: 2, dur: 1.0 },
      { s: 1, f: 2, finger: 1, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'Em' },
      { s: 2, f: 3, finger: 3, dur: 0.5 },
      { s: 2, f: 2, finger: 2, dur: 1.5, chord: 'A7', tech: 'v' },

      { s: 2, f: 2, finger: 1, dur: 0.5, chord: 'A7' },
      { s: 2, f: 3, finger: 2, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      { s: 1, f: 3, finger: 3, dur: 0.5 },
      { s: 1, f: 2, finger: 2, dur: 0.5, chord: 'D' },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 3, finger: 3, dur: 2.0, chord: 'D', tech: 'v' }
    ]
  },

  {
    id: 'tab_matilde_lina',
    title: 'Matilde Lina — Paseo Sabanero Clásico',
    artist: 'Leandro Díaz',
    category: 'vallenato',
    subgenre: 'Paseo Tradicional',
    key: 'G',
    bpm: 98,
    difficulty: 1,
    recommendedInstrument: 'accordion',
    youtubeQuery: 'matilde lina punteo guitarra tutorial acordes',
    description: 'El inmortal canto de Leandro Díaz. Perfecto para principiantes e intermedios: combina notas al aire luminosas en Sol Mayor.',
    tips: [
      'Acentúa la primera nota de cada grupo con alegría costeña.'
    ],
    steps: [
      { s: 1, f: 3, finger: 3, dur: 0.5, chord: 'G', lyric: 'Alegre' },
      { s: 1, f: 2, finger: 2, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 3, finger: 3, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5, chord: 'E7' },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 1.0, chord: 'Am' },

      { s: 2, f: 1, finger: 1, dur: 0.5, chord: 'Am' },
      { s: 2, f: 3, finger: 3, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'D7' },
      { s: 1, f: 2, finger: 2, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 3, finger: 3, dur: 0.5 },
      { s: 2, f: 0, finger: 0, dur: 1.5, chord: 'G', tech: 'v' },

      { s: 2, f: 1, finger: 1, dur: 0.5, chord: 'C' },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 3, finger: 3, dur: 0.5, chord: 'D7' },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 3, f: 2, finger: 2, dur: 0.5 },
      { s: 3, f: 0, finger: 0, dur: 2.0, chord: 'G', lyric: 'Fin' }
    ]
  },

  {
    id: 'tab_alicia_adorada',
    title: 'Alicia Adorada — Paseo Tradicional',
    artist: 'Juancho Polo Valencia',
    category: 'vallenato',
    subgenre: 'Paseo Clásico',
    key: 'C',
    bpm: 86,
    difficulty: 1,
    recommendedInstrument: 'accordion',
    youtubeQuery: 'alicia adorada punteo guitarra tutorial',
    description: 'Uno de los paseos más sentidos del folclor vallenato en Do Mayor. Ideal para conectar las cuerdas 2ª, 3ª, 4ª y 5ª.',
    tips: [
      'Cierra la frase aterrizando con el pulgar en el Do grave de la 5ª cuerda traste 3.'
    ],
    steps: [
      { s: 3, f: 0, finger: 0, dur: 0.5, chord: 'C' },
      { s: 3, f: 2, finger: 2, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 1.0 },
      { s: 2, f: 3, finger: 3, dur: 0.5, chord: 'F' },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 3, f: 2, finger: 2, dur: 1.0 },

      { s: 3, f: 0, finger: 0, dur: 0.5, chord: 'G7' },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 3, finger: 3, dur: 1.0 },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 1.5, chord: 'C' },

      { s: 2, f: 1, finger: 1, dur: 0.5, chord: 'Am' },
      { s: 3, f: 2, finger: 2, dur: 0.5 },
      { s: 3, f: 0, finger: 0, dur: 0.5, chord: 'G7' },
      { s: 4, f: 3, finger: 3, dur: 0.5 },
      { s: 4, f: 2, finger: 2, dur: 0.5, chord: 'C' },
      { s: 4, f: 0, finger: 0, dur: 0.5 },
      { s: 5, f: 3, finger: 3, dur: 2.0, chord: 'C', tech: 'B1', lyric: 'Bajo Do' }
    ]
  },

  {
    id: 'tab_bajeo_vallenato',
    title: 'Bajeo Maestro de Paseo Vallenato (C - G7 - F - C)',
    artist: 'Técnica Colombiana de Acompañamiento',
    category: 'vallenato',
    subgenre: 'Técnica de Bajos + Acorde',
    key: 'C',
    bpm: 90,
    difficulty: 2,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'como tocar bajeo paseo vallenato en guitarra',
    description: 'En la guitarra vallenata tu dedo pulgar hace el papel del bajo eléctrico ("tumbao") alternando Bajo Primario (I) y Bajo Secundario (V) mientras índice-medio-anular contestan en las primas.',
    tips: [
      'En Do Mayor (C), mueve el dedo 3 de la 5ª cuerda traste 3 (Do = B1) hacia la 6ª cuerda traste 3 (Sol = B2).',
      'Usa el pulgar apoyado para que el bajo suene gordo y redondo, como enseña el método "Entre Cuerdas".'
    ],
    steps: [
      // Compás C: B1 - acorde - B2 - acorde
      { s: 5, f: 3, finger: 3, dur: 1.0, chord: 'C', tech: 'B1', lyric: 'Bajo 1 (Do)' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: 'Primas' },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 6, f: 3, finger: 3, dur: 1.0, tech: 'B2', lyric: 'Bajo 2 (Sol)' },
      { s: 3, f: 0, finger: 0, dur: 1.0 },
      // Compás G7: B1 - primas - B2 - primas
      { s: 6, f: 3, finger: 3, dur: 1.0, chord: 'G7', tech: 'B1', lyric: 'Bajo 1 (Sol)' },
      { s: 1, f: 1, finger: 1, dur: 0.5 },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 4, f: 0, finger: 0, dur: 1.0, tech: 'B2', lyric: 'Bajo 2 (Re)' },
      { s: 3, f: 0, finger: 0, dur: 1.0 },
      // Compás F: B1 - primas - B2 - primas
      { s: 4, f: 3, finger: 3, dur: 1.0, chord: 'F', tech: 'B1', lyric: 'Bajo Fa' },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 3, f: 2, finger: 2, dur: 0.5 },
      { s: 5, f: 3, finger: 3, dur: 1.0, tech: 'B2', lyric: 'Bajo Do' },
      { s: 2, f: 1, finger: 1, dur: 1.0 },
      // Resolución G7 -> C
      { s: 6, f: 3, finger: 3, dur: 0.5, chord: 'G7', lyric: 'Llamado' },
      { s: 5, f: 0, finger: 0, dur: 0.5 },
      { s: 5, f: 2, finger: 2, dur: 0.5 },
      { s: 5, f: 3, finger: 3, dur: 2.5, chord: 'C', tech: 'B1', lyric: '¡Remate Do!' }
    ]
  },

  {
    id: 'tab_la_piragua',
    title: 'La Piragua — Punteo Cumbia Colombiana',
    artist: 'José Barros',
    category: 'vallenato',
    subgenre: 'Cumbia Clásica',
    key: 'Am',
    bpm: 94,
    difficulty: 1,
    recommendedInstrument: 'requinto',
    youtubeQuery: 'la piragua punteo guitarra tablatura',
    description: '"Era la piragua de Guillermo Cubillos..." Melodía inmortal del río Magdalena sobre Am → G → F → E7 → Am.',
    tips: [
      'Observa cómo la melodía desciende por el arpegio de La menor y resuelve sobre la sensible Sol# de Mi7.'
    ],
    steps: [
      { s: 3, f: 2, finger: 2, dur: 0.5, chord: 'Am', lyric: 'La pi-' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: 'ra-' },
      { s: 1, f: 0, finger: 0, dur: 1.0, lyric: 'gua' },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 3, finger: 3, dur: 0.5, chord: 'G' },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 2, f: 0, finger: 0, dur: 1.0 },

      { s: 3, f: 2, finger: 2, dur: 0.5, chord: 'F' },
      { s: 2, f: 1, finger: 1, dur: 1.0 },
      { s: 2, f: 0, finger: 0, dur: 0.5, chord: 'E7' },
      { s: 3, f: 2, finger: 2, dur: 0.5 },
      { s: 3, f: 1, finger: 1, dur: 1.0, lyric: 'Sol#' },
      { s: 3, f: 2, finger: 2, dur: 2.0, chord: 'Am', tech: 'v' }
    ]
  },

  // ==========================================================================
  // CATEGORÍA 2: ALABANZAS Y ADORACIÓN CATÓLICA
  // ==========================================================================
  {
    id: 'tab_pescador_hombres',
    title: 'Pescador de Hombres — Melodía e Intro',
    artist: 'Cesáreo Gabaráin (Cancionero Litúrgico)',
    category: 'catolica',
    subgenre: 'Comunión / Vocacional',
    key: 'C',
    bpm: 76,
    difficulty: 1,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'pescador de hombres punteo guitarra tablatura',
    description: '¡Ideal como tu primera melodía católica punteada! Toda en los primeros 5 trastes en Do Mayor ("Tú has venido a la orilla...").',
    tips: [
      'Canta mentalmente la letra siguiendo las sílabas debajo de cada nota para interiorizar el ritmo en 3/4 - 6/8.'
    ],
    steps: [
      { s: 1, f: 0, finger: 0, dur: 1.5, chord: 'C', lyric: 'Tú...' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: 'has' },
      { s: 1, f: 1, finger: 1, dur: 0.5, lyric: 've-' },
      { s: 1, f: 3, finger: 3, dur: 1.0, chord: 'G', lyric: 'ni-' },
      { s: 1, f: 3, finger: 3, dur: 0.5, lyric: 'do a' },
      { s: 1, f: 5, finger: 4, dur: 0.5, lyric: 'la o-' },
      { s: 1, f: 3, finger: 3, dur: 0.5 },
      { s: 1, f: 1, finger: 1, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 1.5, chord: 'Am', lyric: 'ri-lla' },

      { s: 1, f: 1, finger: 1, dur: 0.5, chord: 'F', lyric: 'no has' },
      { s: 1, f: 1, finger: 1, dur: 0.5, lyric: 'bus-' },
      { s: 1, f: 1, finger: 1, dur: 1.0, lyric: 'ca-' },
      { s: 1, f: 5, finger: 4, dur: 0.5, chord: 'Dm', lyric: 'do ni a' },
      { s: 1, f: 3, finger: 3, dur: 0.5, lyric: 'sa-' },
      { s: 1, f: 1, finger: 1, dur: 0.5, lyric: 'bios' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: 'ni a' },
      { s: 2, f: 3, finger: 3, dur: 1.5, chord: 'G7', lyric: 'ri-cos' },

      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'C', lyric: 'tan' },
      { s: 1, f: 1, finger: 1, dur: 0.5, lyric: 'só-' },
      { s: 1, f: 3, finger: 3, dur: 1.0, chord: 'G', lyric: 'lo' },
      { s: 1, f: 3, finger: 3, dur: 0.5, lyric: 'quie-' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: 'res' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: 'que' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: 'yo' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: 'te' },
      { s: 2, f: 1, finger: 1, dur: 2.0, chord: 'C', tech: 'v', lyric: 'si-ga' }
    ]
  },

  {
    id: 'tab_dios_esta_aqui',
    title: 'Dios Está Aquí — Intro y Melodía del Coro',
    artist: 'Alabanza Católica Clásica',
    category: 'catolica',
    subgenre: 'Adoración / Comunión',
    key: 'D',
    bpm: 74,
    difficulty: 1,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'dios esta aqui punteo guitarra intro tablatura',
    description: 'Del repertorio de tu Cancionero Digital en Re Mayor (D → A → Bm → D7 → G → A → D). Hermosa melodía para abrir el momento de oración.',
    tips: [
      'Observa cómo todas las notas pertenecen a la escala de Re Mayor (con Fa# en 1ª cuerda traste 2).'
    ],
    steps: [
      { s: 1, f: 2, finger: 2, dur: 1.0, chord: 'D', lyric: 'Dios' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: 'es-' },
      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'A', lyric: 'tá a-' },
      { s: 1, f: 2, finger: 2, dur: 1.5, chord: 'Bm', lyric: 'quí' },

      { s: 2, f: 3, finger: 3, dur: 0.5, chord: 'D7', lyric: 'tan' },
      { s: 1, f: 3, finger: 3, dur: 0.5, chord: 'G', lyric: 'cier-' },
      { s: 1, f: 3, finger: 3, dur: 0.5, lyric: 'to' },
      { s: 1, f: 3, finger: 3, dur: 0.5, lyric: 'co-' },
      { s: 1, f: 2, finger: 2, dur: 0.5, lyric: 'mo el' },
      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'A', lyric: 'ai-' },
      { s: 1, f: 2, finger: 2, dur: 0.5, lyric: 're' },
      { s: 1, f: 3, finger: 3, dur: 0.5, lyric: 'que' },
      { s: 1, f: 2, finger: 2, dur: 1.5, chord: 'D', lyric: 'res-pi-ro' },

      { s: 1, f: 3, finger: 3, dur: 0.5, chord: 'G', lyric: 'tan' },
      { s: 1, f: 3, finger: 3, dur: 0.5, lyric: 'cier-' },
      { s: 1, f: 2, finger: 2, dur: 0.5, lyric: 'to' },
      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'A', lyric: 'que' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: 'lo' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: 'pue-' },
      { s: 1, f: 2, finger: 2, dur: 0.5, lyric: 'des' },
      { s: 2, f: 3, finger: 3, dur: 2.0, chord: 'D', tech: 'v', lyric: 'o-ír' }
    ]
  },

  {
    id: 'tab_nadie_te_ama',
    title: 'Nadie Te Ama Como Yo — Intro Arpegiada',
    artist: 'Martín Valverde',
    category: 'catolica',
    subgenre: 'Adoración / Retiro',
    key: 'C',
    bpm: 68,
    difficulty: 2,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'nadie te ama como yo intro arpegio guitarra tutorial',
    description: 'Introducción arpegiada emotiva con línea de bajo descendente Do → Sol/Si → La menor → Fa → Sol7. ¡Suena profesional desde el primer compás!',
    tips: [
      'Mantén puestos los dedos del acorde completo en la mano izquierda para que las cuerdas sigan resonando juntas (campaneo).'
    ],
    steps: [
      // C
      { s: 5, f: 3, finger: 3, dur: 0.5, chord: 'C', tech: 'B1', lyric: 'Bajo Do' },
      { s: 3, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      // G/B
      { s: 5, f: 2, finger: 2, dur: 0.5, chord: 'G/B', tech: 'B1', lyric: 'Bajo Si' },
      { s: 3, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 3, finger: 4, dur: 0.5 },
      { s: 1, f: 3, finger: 3, dur: 0.5 },
      // Am
      { s: 5, f: 0, finger: 0, dur: 0.5, chord: 'Am', tech: 'B1', lyric: 'Bajo La' },
      { s: 3, f: 2, finger: 3, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      // Fmaj7
      { s: 4, f: 3, finger: 3, dur: 0.5, chord: 'Fmaj7', tech: 'B1', lyric: 'Bajo Fa' },
      { s: 3, f: 2, finger: 2, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      // G7 -> C
      { s: 6, f: 3, finger: 3, dur: 0.5, chord: 'G7', lyric: 'Sol7' },
      { s: 3, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 1, f: 1, finger: 1, dur: 0.5 },
      { s: 5, f: 3, finger: 3, dur: 2.0, chord: 'C', lyric: 'Reposo Do' }
    ]
  },

  {
    id: 'tab_alma_misionera',
    title: 'Alma Misionera — Melodía en Sol Mayor',
    artist: 'Cancionero Católico Misionero',
    category: 'catolica',
    subgenre: 'Envío / Comunión',
    key: 'G',
    bpm: 84,
    difficulty: 1,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'alma misionera punteo guitarra tutorial',
    description: '"Señor, toma mi vida nueva..." Melodía súper noble en cuerdas 2ª y 3ª sobre el famoso círculo G → D → Em → C.',
    tips: [
      'Casi toda la melodía usa cuerdas al aire y trastes 1, 2 y 3. ¡Perfecta para practicar con el micrófono!'
    ],
    steps: [
      { s: 3, f: 0, finger: 0, dur: 0.5, chord: 'G', lyric: 'Se-' },
      { s: 2, f: 3, finger: 3, dur: 1.0, lyric: 'ñor' },
      { s: 2, f: 3, finger: 3, dur: 0.5, chord: 'D', lyric: 'to-' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: 'ma' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: 'mi' },
      { s: 2, f: 0, finger: 0, dur: 0.5, chord: 'Em', lyric: 'vi-' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: 'da' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: 'nue-' },
      { s: 3, f: 0, finger: 0, dur: 1.5, chord: 'C', lyric: 'va' },

      { s: 3, f: 0, finger: 0, dur: 0.5, chord: 'C', lyric: 'an-' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: 'tes' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: 'de' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: 'que' },
      { s: 2, f: 0, finger: 0, dur: 0.5, chord: 'G', lyric: 'la es-' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: 'pe-' },
      { s: 3, f: 0, finger: 0, dur: 1.0, lyric: 'ra' },

      { s: 3, f: 0, finger: 0, dur: 0.5, chord: 'Am', lyric: 'des-' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: 'gas-' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: 'te a-' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: 'ños' },
      { s: 3, f: 2, finger: 2, dur: 0.5, chord: 'D', lyric: 'en' },
      { s: 2, f: 3, finger: 3, dur: 2.0, chord: 'D', tech: 'v', lyric: 'mí' }
    ]
  },

  {
    id: 'tab_junto_a_ti_maria',
    title: 'Junto a Ti, María — Arpegio Mariano',
    artist: 'Kairoi (Cancionero Digital #5)',
    category: 'catolica',
    subgenre: 'Canto Mariano',
    key: 'D',
    bpm: 72,
    difficulty: 2,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'junto a ti maria arpegio guitarra tutorial',
    description: 'Aplica el arpegio clásico p-i-m-a-m-i sobre el Canon en Re Mayor (D → A → Bm → F#m → G → D → A).',
    tips: [
      'Asigna dedo índice (i) siempre a 3ª cuerda, medio (m) a 2ª cuerda y anular (a) a 1ª cuerda. Solo el pulgar cambia de bajo.'
    ],
    steps: [
      // D
      { s: 4, f: 0, finger: 0, dur: 0.5, chord: 'D', tech: 'B1', lyric: 'p (Re)' },
      { s: 3, f: 2, finger: 1, dur: 0.5, lyric: 'i' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: 'm' },
      { s: 1, f: 2, finger: 2, dur: 0.5, lyric: 'a' },
      // A
      { s: 5, f: 0, finger: 0, dur: 0.5, chord: 'A', tech: 'B1', lyric: 'p (La)' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: 'i' },
      { s: 2, f: 2, finger: 3, dur: 0.5, lyric: 'm' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: 'a' },
      // Bm
      { s: 5, f: 2, finger: 1, dur: 0.5, chord: 'Bm', tech: 'B1', lyric: 'p (Si)' },
      { s: 3, f: 4, finger: 4, dur: 0.5, lyric: 'i' },
      { s: 2, f: 3, finger: 2, dur: 0.5, lyric: 'm' },
      { s: 1, f: 2, finger: 1, dur: 0.5, lyric: 'a' },
      // G -> A -> D
      { s: 6, f: 3, finger: 2, dur: 0.5, chord: 'G', tech: 'B1', lyric: 'p (Sol)' },
      { s: 3, f: 0, finger: 0, dur: 0.5 },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 1, f: 3, finger: 3, dur: 0.5 },
      { s: 5, f: 0, finger: 0, dur: 0.5, chord: 'A', lyric: 'La' },
      { s: 2, f: 2, finger: 3, dur: 0.5 },
      { s: 4, f: 0, finger: 0, dur: 1.0, chord: 'D', lyric: 'Re' },
      { s: 1, f: 2, finger: 2, dur: 1.5, chord: 'D', lyric: 'Paz' }
    ]
  },

  {
    id: 'tab_tan_cerca_de_mi',
    title: 'Tan Cerca de Mí — Melodía + Bajeo Clásico',
    artist: 'Cesáreo Gabaráin',
    category: 'catolica',
    subgenre: 'Adoración',
    key: 'C',
    bpm: 72,
    difficulty: 1,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'tan cerca de mi guitarra punteo bajeo tutorial',
    description: 'Incluye la melodía del coro ("Tan cerca de mí...") y el famoso adorno de bajeo Sol-La-Si-Do en 6ª y 5ª cuerda.',
    tips: [
      'El adorno final en los bajos (6ª traste 3 → 5ª al aire → 5ª traste 2 → 5ª traste 3) sirve para enlazar Sol → Do en decenas de cantos y vallenatos.'
    ],
    steps: [
      { s: 1, f: 0, finger: 0, dur: 1.0, chord: 'C', lyric: 'Tan' },
      { s: 2, f: 3, finger: 3, dur: 1.0, chord: 'G', lyric: 'cer-' },
      { s: 2, f: 1, finger: 1, dur: 0.5, chord: 'Am', lyric: 'ca' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: 'de' },
      { s: 2, f: 1, finger: 1, dur: 1.5, chord: 'C7', lyric: 'mí' },

      { s: 1, f: 1, finger: 1, dur: 1.0, chord: 'F', lyric: 'tan' },
      { s: 1, f: 0, finger: 0, dur: 1.0, chord: 'C', lyric: 'cer-' },
      { s: 2, f: 3, finger: 3, dur: 0.5, chord: 'Dm', lyric: 'ca' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: 'de' },
      { s: 2, f: 3, finger: 3, dur: 1.5, chord: 'G7', lyric: 'mí' },

      // Bajeo clásico G -> A -> B -> C
      { s: 6, f: 3, finger: 3, dur: 0.5, chord: 'G', tech: 'B1', lyric: 'Sol' },
      { s: 5, f: 0, finger: 0, dur: 0.5, lyric: 'La' },
      { s: 5, f: 2, finger: 2, dur: 0.5, lyric: 'Si' },
      { s: 5, f: 3, finger: 3, dur: 2.0, chord: 'C', tech: 'B1', lyric: '¡Do!' }
    ]
  },

  // ==========================================================================
  // CATEGORÍA 3: ESTUDIOS TÉCNICOS DE LOS MÉTODOS (/Metodos)
  // ==========================================================================
  {
    id: 'tab_cuerdas_1_y_2_camavaro',
    title: 'Método Entre Cuerdas: Notas en 1ª y 2ª Cuerda',
    artist: 'Carlos Mario Vásquez ("Camavaro" — MinCultura)',
    category: 'metodo',
    subgenre: 'Lectura y Ubicación',
    key: 'C',
    bpm: 76,
    difficulty: 1,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'notas primera y segunda cuerda guitarra ejercicios',
    description: 'Ejercicio fundamental del libro "Entre Cuerdas de Guitarra": domina Si-Do-Re (2ª cuerda trastes 0-1-3) y Mi-Fa-Sol (1ª cuerda trastes 0-1-3) diciendo cada nombre en voz alta.',
    tips: [
      '¡Regla de Oro de posición I!: Dedo 1 siempre pisa traste 1, Dedo 2 traste 2 y Dedo 3 traste 3.',
      'Observa los colores vivos: Do siempre es Rojo, Re Naranja, Mi Amarillo, Fa Verde, Sol Turquesa y Si Violeta.'
    ],
    steps: [
      { s: 2, f: 0, finger: 0, dur: 1.0, chord: 'G', lyric: 'Si' },
      { s: 2, f: 1, finger: 1, dur: 1.0, chord: 'C', lyric: 'Do' },
      { s: 2, f: 3, finger: 3, dur: 1.0, chord: 'G', lyric: 'Re' },
      { s: 1, f: 0, finger: 0, dur: 1.0, chord: 'C', lyric: 'Mi' },
      { s: 1, f: 1, finger: 1, dur: 1.0, chord: 'F', lyric: 'Fa' },
      { s: 1, f: 3, finger: 3, dur: 2.0, chord: 'G', lyric: 'Sol' },

      { s: 1, f: 3, finger: 3, dur: 1.0, chord: 'G', lyric: 'Sol' },
      { s: 1, f: 1, finger: 1, dur: 1.0, chord: 'F', lyric: 'Fa' },
      { s: 1, f: 0, finger: 0, dur: 1.0, chord: 'C', lyric: 'Mi' },
      { s: 2, f: 3, finger: 3, dur: 1.0, chord: 'G7', lyric: 'Re' },
      { s: 2, f: 1, finger: 1, dur: 2.0, chord: 'C', lyric: '¡Do!' }
    ]
  },

  {
    id: 'tab_aranita_becerra',
    title: 'La Arañita Cromática 1-2-3-4 (Calentamiento)',
    artist: 'Método Iván Becerra & Entre Cuerdas',
    category: 'metodo',
    subgenre: 'Independencia Mano Izquierda',
    key: 'C',
    bpm: 84,
    difficulty: 1,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'ejercicio aranita guitarra 1 2 3 4 independencia dedos',
    description: '¡5 minutos diarios de Arañita multiplican tu velocidad para punteos vallenatos y cejillas! No levantes el dedo anterior mientras colocas el siguiente (1 → 2 → 3 → 4).',
    tips: [
      'Coloca cada dedo justo detrás del riel metálico del traste sin aplastarlo.',
      'Pulgar de la mano izquierda detrás del mástil a mitad de altura (nunca asomado arriba).'
    ],
    steps: [
      // 6ª cuerda
      { s: 6, f: 1, finger: 1, dur: 0.5, lyric: 'Dedo 1' },
      { s: 6, f: 2, finger: 2, dur: 0.5, lyric: 'Dedo 2' },
      { s: 6, f: 3, finger: 3, dur: 0.5, lyric: 'Dedo 3' },
      { s: 6, f: 4, finger: 4, dur: 0.5, lyric: 'Dedo 4' },
      // 5ª cuerda
      { s: 5, f: 1, finger: 1, dur: 0.5 },
      { s: 5, f: 2, finger: 2, dur: 0.5 },
      { s: 5, f: 3, finger: 3, dur: 0.5 },
      { s: 5, f: 4, finger: 4, dur: 0.5 },
      // 4ª cuerda
      { s: 4, f: 1, finger: 1, dur: 0.5 },
      { s: 4, f: 2, finger: 2, dur: 0.5 },
      { s: 4, f: 3, finger: 3, dur: 0.5 },
      { s: 4, f: 4, finger: 4, dur: 0.5 },
      // 3ª cuerda
      { s: 3, f: 1, finger: 1, dur: 0.5 },
      { s: 3, f: 2, finger: 2, dur: 0.5 },
      { s: 3, f: 3, finger: 3, dur: 0.5 },
      { s: 3, f: 4, finger: 4, dur: 0.5 },
      // 2ª cuerda
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 2, f: 2, finger: 2, dur: 0.5 },
      { s: 2, f: 3, finger: 3, dur: 0.5 },
      { s: 2, f: 4, finger: 4, dur: 0.5 },
      // 1ª cuerda
      { s: 1, f: 1, finger: 1, dur: 0.5 },
      { s: 1, f: 2, finger: 2, dur: 0.5 },
      { s: 1, f: 3, finger: 3, dur: 0.5 },
      { s: 1, f: 4, finger: 4, dur: 1.0, lyric: '¡Meta!' }
    ]
  },

  {
    id: 'tab_carulli_arpegio',
    title: 'Estudio de Arpegio en Do Mayor (Carulli)',
    artist: 'Ferdinando Carulli — Cuadernillo Medina & Caliva',
    category: 'metodo',
    subgenre: 'Mano Derecha Clásica',
    key: 'C',
    bpm: 80,
    difficulty: 2,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'estudio en do mayor carulli guitarra tutorial',
    description: 'Del Cuadernillo de Guitarra (pág. 32): entrena la fórmula reina de mano derecha p-i-m-a-m-i sobre la cadencia clásica C → G7 → C.',
    tips: [
      'La mano derecha permanece quieta y relajada sobre la boca de la guitarra; se mueven las falanges de los dedos hacia la palma, sin jalar las cuerdas hacia afuera.'
    ],
    steps: [
      // C (p i m a m i)
      { s: 5, f: 3, finger: 3, dur: 0.5, chord: 'C', lyric: 'p' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: 'i' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: 'm' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: 'a' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: 'm' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: 'i' },
      // G7/B (5ª traste 2)
      { s: 5, f: 2, finger: 2, dur: 0.5, chord: 'G7', lyric: 'p' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: 'i' },
      { s: 2, f: 3, finger: 4, dur: 0.5, lyric: 'm' },
      { s: 1, f: 1, finger: 1, dur: 0.5, lyric: 'a' },
      { s: 2, f: 3, finger: 4, dur: 0.5, lyric: 'm' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: 'i' },
      // Am -> F -> G7 -> C
      { s: 5, f: 0, finger: 0, dur: 0.5, chord: 'Am', lyric: 'p' },
      { s: 3, f: 2, finger: 2, dur: 0.5 },
      { s: 2, f: 1, finger: 1, dur: 0.5 },
      { s: 1, f: 0, finger: 0, dur: 0.5 },
      { s: 6, f: 3, finger: 3, dur: 0.5, chord: 'G7', lyric: 'Sol7' },
      { s: 2, f: 0, finger: 0, dur: 0.5 },
      { s: 1, f: 1, finger: 1, dur: 0.5 },
      { s: 5, f: 3, finger: 3, dur: 1.5, chord: 'C', lyric: 'Do Final' }
    ]
  },

  {
    id: 'tab_mapa_pentatonico',
    title: 'Mapa Pentatónico Menor/Mayor ( Caja Traste 5 )',
    artist: 'Método Entre Cuerdas & Fran Cordón',
    category: 'metodo',
    subgenre: 'Improvisación y Punteos',
    key: 'Am',
    bpm: 90,
    difficulty: 2,
    recommendedInstrument: 'requinto',
    youtubeQuery: 'escala pentatonica la menor traste 5 guitarra improvisar',
    description: '¡El mapa maestro para improvisar solos sobre canciones en Do Mayor o La Menor! Sirve sobre "Los Caminos de la Vida", "La Gota Fría", "La Piragua" y cantos en Do/Lam.',
    tips: [
      'Dedo 1 manda en el traste 5, Dedo 3 en el traste 7 y Dedo 4 en el traste 8. ¡Dos notas por cuerda!'
    ],
    steps: [
      { s: 6, f: 5, finger: 1, dur: 0.5, chord: 'Am', lyric: 'La' },
      { s: 6, f: 8, finger: 4, dur: 0.5, lyric: 'Do' },
      { s: 5, f: 5, finger: 1, dur: 0.5, lyric: 'Re' },
      { s: 5, f: 7, finger: 3, dur: 0.5, lyric: 'Mi' },
      { s: 4, f: 5, finger: 1, dur: 0.5, chord: 'G', lyric: 'Sol' },
      { s: 4, f: 7, finger: 3, dur: 0.5, lyric: 'La' },
      { s: 3, f: 5, finger: 1, dur: 0.5, lyric: 'Do' },
      { s: 3, f: 7, finger: 3, dur: 0.5, lyric: 'Re' },
      { s: 2, f: 5, finger: 1, dur: 0.5, chord: 'F', lyric: 'Mi' },
      { s: 2, f: 8, finger: 4, dur: 0.5, lyric: 'Sol' },
      { s: 1, f: 5, finger: 1, dur: 0.5, chord: 'E7', lyric: 'La' },
      { s: 1, f: 8, finger: 4, dur: 1.0, chord: 'C', tech: 'v', lyric: 'Do!' },
      // Frase melódica de regreso
      { s: 1, f: 5, finger: 1, dur: 0.5, chord: 'Am' },
      { s: 2, f: 8, finger: 4, dur: 0.5 },
      { s: 2, f: 5, finger: 1, dur: 0.5 },
      { s: 3, f: 7, finger: 3, dur: 0.5 },
      { s: 3, f: 5, finger: 1, dur: 0.5 },
      { s: 4, f: 7, finger: 3, dur: 2.0, chord: 'Am', tech: 'v', lyric: 'Raíz La' }
    ]
  },

  // ==========================================================================
  // CATEGORÍA 4: INTRODUCCIONES & ESCALAS DEL LIBRO "HAGA MÚSICA CON LA GUITARRA"
  // (Método Numérico 10–60 de Keyner Ramírez Mojica)
  // ==========================================================================
  {
    id: 'tab_keyner_escala_do',
    title: 'Escala de Do Mayor en 2 Octavas (Libro Keyner p.7)',
    artist: 'Keyner Ramírez Mojica — Haga Música con la Guitarra',
    category: 'metodo',
    sourceMethod: 'keyner',
    subgenre: 'Método Numérico 10-60',
    key: 'C',
    bpm: 82,
    difficulty: 1,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'escala do mayor guitarra primera posicion dos octavas',
    description: 'Ejercicio fundamental de la página 7 del libro "Haga Música con la Guitarra": 53-40-42-43-30-32-20-21-23-10-11-13-15-17-18. Activa "Mostrar → Método Keyner (10-60)" para leer cada número igual que en el libro físico.',
    tips: [
      'Regla de Keyner: primer dígito = cuerda (1 a 6); segundo/tercer dígito = espacio o traste (ej. 53 = 5ª cuerda espacio 3).',
      'Del espacio 1 al 4 usa el dedo correspondiente (D1..D4); a partir del 15-17-18 desliza tu mano izquierda hacia arriba.'
    ],
    steps: [
      { s: 5, f: 3, finger: 3, dur: 0.5, chord: 'C', lyric: 'Do(53)' },
      { s: 4, f: 0, finger: 0, dur: 0.5, lyric: 'Re(40)' },
      { s: 4, f: 2, finger: 2, dur: 0.5, lyric: 'Mi(42)' },
      { s: 4, f: 3, finger: 3, dur: 0.5, lyric: 'Fa(43)' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: 'Sol(30)' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: 'La(32)' },
      { s: 2, f: 0, finger: 0, dur: 0.5, chord: 'G7', lyric: 'Si(20)' },
      { s: 2, f: 1, finger: 1, dur: 0.5, chord: 'C', lyric: 'Do(21)' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: 'Re(23)' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: 'Mi(10)' },
      { s: 1, f: 1, finger: 1, dur: 0.5, lyric: 'Fa(11)' },
      { s: 1, f: 3, finger: 3, dur: 0.5, lyric: 'Sol(13)' },
      { s: 1, f: 5, finger: 1, dur: 0.5, tech: '/', lyric: 'La(15)' },
      { s: 1, f: 7, finger: 3, dur: 0.5, lyric: 'Si(17)' },
      { s: 1, f: 8, finger: 4, dur: 1.5, chord: 'C', tech: 'v', lyric: 'Do(18)!' },
      // Regreso descendente
      { s: 1, f: 7, finger: 3, dur: 0.5, lyric: 'Si' },
      { s: 1, f: 5, finger: 1, dur: 0.5, lyric: 'La' },
      { s: 1, f: 3, finger: 3, dur: 0.5, lyric: 'Sol' },
      { s: 1, f: 1, finger: 1, dur: 0.5, lyric: 'Fa' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: 'Mi' },
      { s: 2, f: 3, finger: 3, dur: 0.5, chord: 'G7', lyric: 'Re' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: 'Do' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: 'Si' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: 'La' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: 'Sol' },
      { s: 4, f: 3, finger: 3, dur: 0.5, lyric: 'Fa' },
      { s: 4, f: 2, finger: 2, dur: 0.5, lyric: 'Mi' },
      { s: 4, f: 0, finger: 0, dur: 0.5, lyric: 'Re' },
      { s: 5, f: 3, finger: 3, dur: 2.0, chord: 'C', tech: 'v', lyric: 'Do(53)' }
    ]
  },

  {
    id: 'tab_keyner_pueblito_viejo',
    title: 'Pueblito Viejo — Intro Libro Keyner (p.23)',
    artist: 'José A. Morales — Arr. Keyner Ramírez',
    category: 'vallenato',
    sourceMethod: 'keyner',
    subgenre: 'Vals / Pasillo Colombiano',
    key: 'Am',
    bpm: 92,
    difficulty: 2,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'pueblito viejo guitarra punteo introduccion tutorial',
    description: 'Transcripción fiel de la página 23 de "Haga Música con la Guitarra": 32-21-20-32-30-43 · 43-42-40 · 32-20-32-30-43-42 · 42-40-53 · 42-32-30-43-42-40.',
    tips: [
      'Cambia arriba "Mostrar → Método Keyner (10-60)" para comparar directamente cada código con tu libro físico.',
      'Observa el paso cromático descendente en la 4ª cuerda: 43 (Fa) → 42 (Mi) → 40 (Re) → 53 (Do).'
    ],
    steps: [
      { s: 3, f: 2, finger: 2, dur: 0.5, chord: 'Am', lyric: '32' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: '21' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: '30' },
      { s: 4, f: 3, finger: 3, dur: 1.5, chord: 'Dm', lyric: '43' },

      { s: 4, f: 3, finger: 3, dur: 0.5, lyric: '43' },
      { s: 4, f: 2, finger: 2, dur: 0.5, lyric: '42' },
      { s: 4, f: 0, finger: 0, dur: 1.0, chord: 'E7', lyric: '40' },

      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: '30' },
      { s: 4, f: 3, finger: 3, dur: 0.5, lyric: '43' },
      { s: 4, f: 2, finger: 2, dur: 1.0, chord: 'Am', lyric: '42' },

      { s: 4, f: 2, finger: 2, dur: 0.5, lyric: '42' },
      { s: 4, f: 0, finger: 0, dur: 0.5, lyric: '40' },
      { s: 5, f: 3, finger: 3, dur: 1.0, chord: 'C', lyric: '53' },

      { s: 4, f: 2, finger: 2, dur: 0.5, lyric: '42' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: '30' },
      { s: 4, f: 3, finger: 3, dur: 0.5, lyric: '43' },
      { s: 4, f: 2, finger: 2, dur: 0.5, lyric: '42' },
      { s: 4, f: 0, finger: 0, dur: 1.0, chord: 'Dm', lyric: '40' },

      { s: 5, f: 3, finger: 3, dur: 0.5, lyric: '53' },
      { s: 5, f: 2, finger: 2, dur: 0.5, chord: 'E7', tech: '*', lyric: '52*' },
      { s: 5, f: 0, finger: 0, dur: 0.5, lyric: '50' },
      { s: 4, f: 2, finger: 2, dur: 0.5, lyric: '42' },
      { s: 3, f: 2, finger: 2, dur: 1.5, chord: 'Am', tech: 'v', lyric: '32 Fin' }
    ]
  },

  {
    id: 'tab_keyner_oropel',
    title: 'Oropel — Intro Libro Keyner (p.20)',
    artist: 'Jorge Villamil — Arr. Keyner Ramírez',
    category: 'vallenato',
    sourceMethod: 'keyner',
    subgenre: 'Vals / Pasillo Huilense',
    key: 'Em',
    bpm: 94,
    difficulty: 2,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'oropel jorge villamil guitarra introduccion punteo',
    description: 'Intro clásica en Mi Menor tomada textualmente del método numérico de Keyner Ramírez (pág. 20): 52-52-52-20-30-32-30-44-30-32-30-44-42.',
    tips: [
      'Pon atención al código 44 (4ª cuerda espacio 4 = Fa#) para mantener el color auténtico de Mi menor melódico.',
      'Mantén el dedo 1 cerca del espacio 1–2 y alcanza 44 con el dedo 4 (meñique) sin tensar la muñeca.'
    ],
    steps: [
      { s: 5, f: 2, finger: 2, dur: 0.5, chord: 'Em', lyric: '52' },
      { s: 5, f: 2, finger: 2, dur: 0.5, lyric: '52' },
      { s: 5, f: 2, finger: 2, dur: 0.5, lyric: '52' },
      { s: 2, f: 0, finger: 0, dur: 1.0, lyric: '20' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: '30' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: '30' },
      { s: 4, f: 4, finger: 4, dur: 1.0, chord: 'B7', lyric: '44' },

      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: '30' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: '30' },
      { s: 4, f: 4, finger: 4, dur: 0.5, lyric: '44' },
      { s: 4, f: 2, finger: 2, dur: 1.0, chord: 'Em', lyric: '42' },

      { s: 4, f: 2, finger: 2, dur: 0.5, lyric: '42' },
      { s: 4, f: 4, finger: 4, dur: 0.5, lyric: '44' },
      { s: 3, f: 0, finger: 0, dur: 0.5, chord: 'Am', lyric: '30' },
      { s: 4, f: 2, finger: 2, dur: 0.5, lyric: '42' },
      { s: 4, f: 0, finger: 0, dur: 0.5, lyric: '40' },
      { s: 5, f: 3, finger: 3, dur: 1.0, lyric: '53' },

      { s: 3, f: 2, finger: 2, dur: 0.5, chord: 'B7', lyric: '32' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: '21' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 3, f: 0, finger: 0, dur: 1.5, chord: 'Em', tech: 'v', lyric: '30 Fin' }
    ]
  },

  {
    id: 'tab_keyner_espumas',
    title: 'Espumas — Intro Pasillo Libro Keyner (p.28)',
    artist: 'Jorge Villamil — Arr. Keyner Ramírez',
    category: 'vallenato',
    sourceMethod: 'keyner',
    subgenre: 'Pasillo Clásico en La Mayor',
    key: 'A',
    bpm: 112,
    difficulty: 2,
    recommendedInstrument: 'requinto',
    youtubeQuery: 'espumas pasillo guitarra introduccion punteo tutorial',
    description: 'Uno de los pasillos más bellos del repertorio colombiano (pág. 28 de Keyner Ramírez): 10-10-10-12-12-10-10-23 · 23-12-12-10-10-23-23-10 · 32-32-32-31-20-32-44-23-22.',
    tips: [
      'Fíjate en las notas sobre el acorde 5ª de La (E7): alternas 12 (Fa#) con 10 (Mi) y 23 (Re).',
      'La bajada final 32 → 31 (Sol#) → 20 → 32 → 44 (Fa#) → 23 → 22 (Do#) resuelve directo sobre La Mayor (LA+).'
    ],
    steps: [
      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'A', lyric: '10' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 1, f: 2, finger: 2, dur: 0.5, lyric: '12' },
      { s: 1, f: 2, finger: 2, dur: 0.5, lyric: '12' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 2, f: 3, finger: 3, dur: 1.5, chord: 'E7', lyric: '23' },

      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: '23' },
      { s: 1, f: 2, finger: 2, dur: 0.5, lyric: '12' },
      { s: 1, f: 2, finger: 2, dur: 0.5, lyric: '12' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: '23' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: '23' },
      { s: 1, f: 0, finger: 0, dur: 1.5, chord: 'A', lyric: '10' },

      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 3, f: 1, finger: 1, dur: 0.5, chord: 'E7', lyric: '31' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 4, f: 4, finger: 4, dur: 0.5, lyric: '44' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: '23' },
      { s: 2, f: 2, finger: 2, dur: 2.0, chord: 'A', tech: 'v', lyric: '22!' }
    ]
  },

  {
    id: 'tab_keyner_pescador_lucero',
    title: 'Pescador, Lucero y Río — Intro Pasillo (p.31)',
    artist: 'José A. Morales — Arr. Keyner Ramírez',
    category: 'vallenato',
    sourceMethod: 'keyner',
    subgenre: 'Pasillo en Re Mayor',
    key: 'D',
    bpm: 104,
    difficulty: 2,
    recommendedInstrument: 'nylon',
    youtubeQuery: 'pescador lucero y rio guitarra introduccion punteo',
    description: 'Intro romántica de la pág. 31 del libro de Keyner Ramírez: 32-20-21-20-32-21 · 10-23 · 23-21 · 20 · 23-22-10-23-20-32 · 44-32-23-10-23-22.',
    tips: [
      'Cuidado con el cambio de 21 (Do natural) a 22 (Do sostenido), propio del giro entre Re menor y Re mayor.',
      'Usa "🔁 Marcar Inicio A / Fin B" sobre los compases centrales si quieres dominar el arpegio 44-32-23-10.'
    ],
    steps: [
      { s: 3, f: 2, finger: 2, dur: 0.5, chord: 'D', lyric: '32' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: '21' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 2, f: 1, finger: 1, dur: 1.0, chord: 'A7', lyric: '21' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 2, f: 3, finger: 3, dur: 1.0, lyric: '23' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: '23' },
      { s: 2, f: 1, finger: 1, dur: 1.0, lyric: '21' },
      { s: 2, f: 0, finger: 0, dur: 1.0, chord: 'D', lyric: '20' },

      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: '23' },
      { s: 2, f: 2, finger: 2, dur: 0.5, lyric: '22' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: '23' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 3, f: 2, finger: 2, dur: 1.0, lyric: '32' },
      { s: 4, f: 4, finger: 4, dur: 0.5, chord: 'G', lyric: '44' },
      { s: 3, f: 2, finger: 2, dur: 0.5, lyric: '32' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: '23' },
      { s: 1, f: 0, finger: 0, dur: 0.5, chord: 'A7', lyric: '10' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: '23' },
      { s: 2, f: 2, finger: 2, dur: 0.5, lyric: '22' },
      { s: 3, f: 0, finger: 0, dur: 0.5, lyric: '30' },
      { s: 3, f: 2, finger: 2, dur: 1.5, chord: 'D', tech: 'v', lyric: '32 Fin' }
    ]
  },

  {
    id: 'tab_keyner_carmen_bolivar',
    title: 'Carmen de Bolívar — Intro Porro Libro Keyner (p.41)',
    artist: 'Lucho Bermúdez — Arr. Keyner Ramírez',
    category: 'vallenato',
    sourceMethod: 'keyner',
    subgenre: 'Porro Sabanero en La Mayor',
    key: 'A',
    bpm: 108,
    difficulty: 2,
    recommendedInstrument: 'accordion',
    youtubeQuery: 'carmen de bolivar punteo guitarra porro tutorial',
    description: 'Melodía alegre de viento-madera adaptada a guitarra en la página 41 del libro de Keyner Ramírez: 22-22-23-10 · 24-10-12-10 · 52-42-31-23 · 22-20.',
    tips: [
      'Fíjate cómo el arreglo de Keyner Ramírez utiliza la figura abierta de La Mayor (LA+) y 5ª de La (E7).',
      'Practica el motivo 52-42-31-23 arpegiando sobre las cuerdas de E7 hasta que suene con sabor sabanero.'
    ],
    steps: [
      { s: 2, f: 2, finger: 2, dur: 0.5, chord: 'A', lyric: '22' },
      { s: 2, f: 2, finger: 2, dur: 0.5, lyric: '22' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: '23' },
      { s: 1, f: 0, finger: 0, dur: 1.0, lyric: '10' },
      { s: 2, f: 4, finger: 4, dur: 0.5, lyric: '24' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 1, f: 2, finger: 2, dur: 0.5, lyric: '12' },
      { s: 1, f: 0, finger: 0, dur: 1.0, lyric: '10' },

      { s: 2, f: 4, finger: 4, dur: 0.5, lyric: '24' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 1, f: 2, finger: 2, dur: 0.5, lyric: '12' },
      { s: 2, f: 3, finger: 3, dur: 1.0, chord: 'E7', lyric: '23' },

      { s: 5, f: 2, finger: 2, dur: 0.5, lyric: '52' },
      { s: 4, f: 2, finger: 2, dur: 0.5, lyric: '42' },
      { s: 3, f: 1, finger: 1, dur: 0.5, lyric: '31' },
      { s: 2, f: 3, finger: 3, dur: 0.5, lyric: '23' },
      { s: 2, f: 2, finger: 2, dur: 0.5, chord: 'A', lyric: '22' },
      { s: 2, f: 0, finger: 0, dur: 1.0, lyric: '20' },

      { s: 5, f: 2, finger: 2, dur: 0.5, chord: 'E7', lyric: '52' },
      { s: 4, f: 2, finger: 2, dur: 0.5, lyric: '42' },
      { s: 3, f: 1, finger: 1, dur: 0.5, lyric: '31' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 1, f: 2, finger: 2, dur: 0.5, lyric: '12' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 2, f: 2, finger: 2, dur: 0.5, lyric: '22' },
      { s: 3, f: 2, finger: 2, dur: 1.5, chord: 'A', tech: 'v', lyric: '32!' }
    ]
  },

  {
    id: 'tab_keyner_el_ano_viejo',
    title: 'El Año Viejo — Intro Parranda Libro Keyner (p.40)',
    artist: 'Crescencio Salcedo — Arr. Keyner Ramírez',
    category: 'vallenato',
    sourceMethod: 'keyner',
    subgenre: 'Porro / Cumbia Decembrina',
    key: 'Am',
    bpm: 108,
    difficulty: 1,
    recommendedInstrument: 'accordion',
    youtubeQuery: 'el ano viejo guitarra punteo introduccion tutorial',
    description: 'Clásico inolvidable de Colombia transcrito del método Keyner Ramírez (pág. 40): 50-42-32-21-20-32-21-20-23 · 20 · 52-42-31-20-20-23-21-10.',
    tips: [
      'Armonizada por completo con solo dos acordes de la tabla de Keyner: La Menor (LA-) y su 5ª de La (E7).',
      'Nota cómo el arpegio 50-42-32-21 forma el acorde exacto de La Menor mientras cantas la melodía.'
    ],
    steps: [
      { s: 5, f: 0, finger: 0, dur: 0.5, chord: 'Am', lyric: '50' },
      { s: 4, f: 2, finger: 2, dur: 0.5, lyric: '42' },
      { s: 3, f: 2, finger: 3, dur: 0.5, lyric: '32' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: '21' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 3, f: 2, finger: 3, dur: 0.5, lyric: '32' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: '21' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 2, f: 3, finger: 4, dur: 1.0, chord: 'E7', lyric: '23' },
      { s: 2, f: 0, finger: 0, dur: 1.0, lyric: '20' },

      { s: 5, f: 2, finger: 2, dur: 0.5, lyric: '52' },
      { s: 4, f: 2, finger: 3, dur: 0.5, lyric: '42' },
      { s: 3, f: 1, finger: 1, dur: 0.5, lyric: '31' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 2, f: 3, finger: 4, dur: 0.5, lyric: '23' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: '21' },
      { s: 1, f: 0, finger: 0, dur: 1.0, chord: 'Am', lyric: '10' },

      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 1, f: 1, finger: 1, dur: 0.5, lyric: '11' },
      { s: 1, f: 0, finger: 0, dur: 0.5, lyric: '10' },
      { s: 2, f: 3, finger: 4, dur: 0.5, chord: 'E7', lyric: '23' },
      { s: 2, f: 1, finger: 1, dur: 0.5, lyric: '21' },
      { s: 2, f: 0, finger: 0, dur: 0.5, lyric: '20' },
      { s: 3, f: 2, finger: 2, dur: 1.5, chord: 'Am', tech: 'v', lyric: '32!' }
    ]
  }
];

