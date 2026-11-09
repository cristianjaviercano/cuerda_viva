// ============================================================================
// js/chords-db.js
// Diccionario Completo de Acordes (Abiertos, Cejillas CAGED, Simplificados),
// Bajos Primario (B1) y Secundario (B2) según el Método "Entre Cuerdas" (Camavaro)
// y Renderizador SVG Interactivo con Colores Cromáticos Vivos.
// ============================================================================

import {
  NOTES,
  NOTES_ES,
  NOTE_COLORS,
  STRING_OPEN_MIDI,
  normalizeChordToAmerican,
  parseChord
} from './music-theory.js';

// frets: [6ª, 5ª, 4ª, 3ª, 2ª, 1ª] (-1 = muteada X, 0 = al aire, >0 = traste absoluto)
// fingers: [6ª, 5ª, 4ª, 3ª, 2ª, 1ª] (0 = aire/mute, 1=índice, 2=medio, 3=anular, 4=meñique)
// bass1: número de cuerda (6 a 1) del Bajo Primario (Fundamental)
// bass2: número de cuerda (6 a 1) del Bajo Secundario (Quinta / Alterno para Vallenato y Vals)

export const CHORDS_DB = {
  // ======================== MAYORES ========================
  'C': {
    nameEs: 'Do Mayor',
    category: 'Mayor',
    top12Rank: 2,
    tip: 'En Vallenato y Vals, alterna el Bajo 1 (5ª cuerda traste 3) subiendo el dedo 3 a la 6ª cuerda traste 3 (Sol) para un bajeo profundo.',
    voicings: [
      { label: 'Abierta Clásica', frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1, barre: null, bass1: 5, bass2: 4 },
      { label: 'Cejilla Forma A (Tr. 3)', frets: [-1, 3, 5, 5, 5, 3], fingers: [0, 1, 2, 3, 4, 1], baseFret: 3, barre: { fret: 3, from: 5, to: 1 }, bass1: 5, bass2: 6 },
      { label: 'Cejilla Forma E (Tr. 8)', frets: [8, 10, 10, 9, 8, 8], fingers: [1, 3, 4, 2, 1, 1], baseFret: 8, barre: { fret: 8, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'D': {
    nameEs: 'Re Mayor',
    category: 'Mayor',
    top12Rank: 3,
    tip: 'Forma un triángulo en las 3 primeras cuerdas. No toques la 6ª cuerda. Alterna Bajo 1 (4ª al aire) y Bajo 2 (5ª al aire).',
    voicings: [
      { label: 'Abierta Clásica', frets: [-1, 0, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1, barre: null, bass1: 4, bass2: 5 },
      { label: 'Cejilla Forma A (Tr. 5)', frets: [-1, 5, 7, 7, 7, 5], fingers: [0, 1, 2, 3, 4, 1], baseFret: 5, barre: { fret: 5, from: 5, to: 1 }, bass1: 5, bass2: 6 },
      { label: 'Cejilla Forma E (Tr. 10)', frets: [10, 12, 12, 11, 10, 10], fingers: [1, 3, 4, 2, 1, 1], baseFret: 10, barre: { fret: 10, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'E': {
    nameEs: 'Mi Mayor',
    category: 'Mayor',
    top12Rank: 10,
    tip: '¡Suenan las 6 cuerdas! Ideal para cantos alegres ("A edificar la iglesia"). Bajo 1 en 6ª cuerda, Bajo 2 en 5ª cuerda.',
    voicings: [
      { label: 'Abierta Completa', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1, barre: null, bass1: 6, bass2: 5 },
      { label: 'Cejilla Forma A (Tr. 7)', frets: [-1, 7, 9, 9, 9, 7], fingers: [0, 1, 2, 3, 4, 1], baseFret: 7, barre: { fret: 7, from: 5, to: 1 }, bass1: 5, bass2: 6 }
    ]
  },
  'F': {
    nameEs: 'Fa Mayor',
    category: 'Mayor',
    top12Rank: 8,
    tip: 'Si te cansa la cejilla completa, gira levemente el dedo 1 de costado cerca del riel metálico o usa la versión "Fa Fácil" (Posición 2).',
    voicings: [
      { label: 'Cejilla Completa (Tr. 1)', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1, barre: { fret: 1, from: 6, to: 1 }, bass1: 6, bass2: 5 },
      { label: 'Fa Fácil sin Cejilla (Reto 30 Días)', frets: [-1, -1, 3, 2, 1, 0], fingers: [0, 0, 3, 2, 1, 0], baseFret: 1, barre: null, bass1: 4, bass2: 3 },
      { label: 'Cejilla Forma A (Tr. 8)', frets: [-1, 8, 10, 10, 10, 8], fingers: [0, 1, 2, 3, 4, 1], baseFret: 8, barre: { fret: 8, from: 5, to: 1 }, bass1: 5, bass2: 6 }
    ]
  },
  'G': {
    nameEs: 'Sol Mayor',
    category: 'Mayor',
    top12Rank: 1,
    tip: '¡El acorde #1 más usado en todo el Cancionero Católico y el Paseo Vallenato! Bajo 1 en 6ª cuerda y Bajo 2 en 4ª o 5ª cuerda.',
    voicings: [
      { label: 'Abierta Clásica', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1, barre: null, bass1: 6, bass2: 4 },
      { label: 'Abierta 4 Dedos (Brillante)', frets: [3, 2, 0, 0, 3, 3], fingers: [2, 1, 0, 0, 3, 4], baseFret: 1, barre: null, bass1: 6, bass2: 4 },
      { label: 'Cejilla Forma E (Tr. 3)', frets: [3, 5, 5, 4, 3, 3], fingers: [1, 3, 4, 2, 1, 1], baseFret: 3, barre: { fret: 3, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'A': {
    nameEs: 'La Mayor',
    category: 'Mayor',
    top12Rank: 6,
    tip: 'Agrupa dedos 1, 2 y 3 en el traste 2 sin pisar la 1ª ni la 5ª cuerda. Bajo 1: 5ª al aire, Bajo 2: 6ª al aire (Mi).',
    voicings: [
      { label: 'Abierta Clásica', frets: [0, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1, barre: null, bass1: 5, bass2: 6 },
      { label: 'Cejilla Forma E (Tr. 5)', frets: [5, 7, 7, 6, 5, 5], fingers: [1, 3, 4, 2, 1, 1], baseFret: 5, barre: { fret: 5, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'B': {
    nameEs: 'Si Mayor',
    category: 'Mayor',
    tip: 'Cejilla desde la 5ª cuerda en traste 2. Muy común al tocar en tonalidad de Mi Mayor.',
    voicings: [
      { label: 'Cejilla Forma A (Tr. 2)', frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], baseFret: 2, barre: { fret: 2, from: 5, to: 1 }, bass1: 5, bass2: 4 },
      { label: 'Cejilla Forma E (Tr. 7)', frets: [7, 9, 9, 8, 7, 7], fingers: [1, 3, 4, 2, 1, 1], baseFret: 7, barre: { fret: 7, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },

  // ======================== MENORES ========================
  'Am': {
    nameEs: 'La Menor',
    category: 'Menor',
    top12Rank: 5,
    tip: 'Hermano gemelo de Mi Mayor una cuerda más abajo. Rey de "La Gota Fría", "La Piragua" y cantos de meditación.',
    voicings: [
      { label: 'Abierta Clásica', frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1, barre: null, bass1: 5, bass2: 6 },
      { label: 'Cejilla Forma Em (Tr. 5)', frets: [5, 7, 7, 5, 5, 5], fingers: [1, 3, 4, 1, 1, 1], baseFret: 5, barre: { fret: 5, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'Bm': {
    nameEs: 'Si Menor',
    category: 'Menor',
    top12Rank: 7,
    tip: 'Indispensable en cantos en Re Mayor ("Junto a ti María", "Dios está aquí"). Empieza practicando su versión sin cejilla si estás iniciando.',
    voicings: [
      { label: 'Cejilla Forma Am (Tr. 2)', frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], baseFret: 2, barre: { fret: 2, from: 5, to: 1 }, bass1: 5, bass2: 4 },
      { label: 'Bm Fácil sin Cejilla', frets: [-1, 2, 0, 4, 3, 2], fingers: [0, 1, 0, 4, 3, 2], baseFret: 1, barre: null, bass1: 5, bass2: 4 },
      { label: 'Cejilla Forma Em (Tr. 7)', frets: [7, 9, 9, 7, 7, 7], fingers: [1, 3, 4, 1, 1, 1], baseFret: 7, barre: { fret: 7, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'Cm': {
    nameEs: 'Do Menor',
    category: 'Menor',
    tip: 'Misma figura de Si menor corrida un traste adelante (traste 3).',
    voicings: [
      { label: 'Cejilla Forma Am (Tr. 3)', frets: [-1, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], baseFret: 3, barre: { fret: 3, from: 5, to: 1 }, bass1: 5, bass2: 4 }
    ]
  },
  'C#m': {
    nameEs: 'Do Sostenido Menor',
    category: 'Menor',
    tip: 'Relativo menor de Mi Mayor; aparece en "Dios Trino" y "Santo II".',
    voicings: [
      { label: 'Cejilla Forma Am (Tr. 4)', frets: [-1, 4, 6, 6, 5, 4], fingers: [0, 1, 3, 4, 2, 1], baseFret: 4, barre: { fret: 4, from: 5, to: 1 }, bass1: 5, bass2: 4 }
    ]
  },
  'Dm': {
    nameEs: 'Re Menor',
    category: 'Menor',
    top12Rank: 11,
    tip: 'Sonido nostálgico y solemne ("Señor ten piedad", "Carmen de Bolívar"). Bajo 1: 4ª al aire, Bajo 2: 5ª al aire.',
    voicings: [
      { label: 'Abierta Clásica', frets: [-1, 0, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1, barre: null, bass1: 4, bass2: 5 },
      { label: 'Cejilla Forma Am (Tr. 5)', frets: [-1, 5, 7, 7, 6, 5], fingers: [0, 1, 3, 4, 2, 1], baseFret: 5, barre: { fret: 5, from: 5, to: 1 }, bass1: 5, bass2: 4 }
    ]
  },
  'Em': {
    nameEs: 'Mi Menor',
    category: 'Menor',
    top12Rank: 4,
    tip: '¡El acorde más fácil de la guitarra (solo 2 dedos)! Base de "Alma Misionera" y "Un Pueblo que Camina".',
    voicings: [
      { label: 'Abierta Clásica', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1, barre: null, bass1: 6, bass2: 5 },
      { label: 'Cejilla Forma Am (Tr. 7)', frets: [-1, 7, 9, 9, 8, 7], fingers: [0, 1, 3, 4, 2, 1], baseFret: 7, barre: { fret: 7, from: 5, to: 1 }, bass1: 5, bass2: 4 }
    ]
  },
  'Fm': {
    nameEs: 'Fa Menor',
    category: 'Menor',
    tip: 'Úsalo para el intercambio modal nostálgico IV → IVm → I ("Bendita sea tu pureza").',
    voicings: [
      { label: 'Cejilla Traste 1', frets: [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1], baseFret: 1, barre: { fret: 1, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'F#m': {
    nameEs: 'Fa Sostenido Menor',
    category: 'Menor',
    tip: 'Relativo menor de La Mayor y III grado de Re Mayor ("Junto a ti María", "Canción del grano de trigo").',
    voicings: [
      { label: 'Cejilla Traste 2', frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], baseFret: 2, barre: { fret: 2, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'Gm': {
    nameEs: 'Sol Menor',
    category: 'Menor',
    tip: 'Muy usado en "Cien Ovejas" (G → Gm → D) y "Señor ten piedad".',
    voicings: [
      { label: 'Cejilla Traste 3', frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], baseFret: 3, barre: { fret: 3, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },

  // ======================== DOMINANTES 7 ========================
  'C7': {
    nameEs: 'Do Séptima',
    category: 'Dominante 7',
    tip: 'Agrega el meñique (dedo 4) en 3ª cuerda traste 3 sobre Do Mayor. Llama con fuerza a Fa Mayor (V7/IV) en "Pescador de Hombres".',
    voicings: [
      { label: 'Abierta Clásica', frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], baseFret: 1, barre: null, bass1: 5, bass2: 4 }
    ]
  },
  'D7': {
    nameEs: 'Re Séptima',
    category: 'Dominante 7',
    tip: 'Triángulo invertido respecto a Re Mayor. Dominante de Sol Mayor (Matilde Lina, Ausencia Sentimental) y V7/IV en "Dios está aquí".',
    voicings: [
      { label: 'Abierta Clásica', frets: [-1, 0, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], baseFret: 1, barre: null, bass1: 4, bass2: 5 }
    ]
  },
  'E7': {
    nameEs: 'Mi Séptima',
    category: 'Dominante 7',
    tip: '¡El alma de la Cumbia y el Vallenato menor ("La Gota Fría", "La Piragua")! Solo levanta el dedo 3 de Mi Mayor.',
    voicings: [
      { label: 'Abierta 2 Dedos', frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], baseFret: 1, barre: null, bass1: 6, bass2: 5 },
      { label: 'Con Re agudo (Rica)', frets: [0, 2, 2, 1, 3, 0], fingers: [0, 2, 3, 1, 4, 0], baseFret: 1, barre: null, bass1: 6, bass2: 5 }
    ]
  },
  'F7': {
    nameEs: 'Fa Séptima',
    category: 'Dominante 7',
    tip: 'Dominante de Sib Mayor.',
    voicings: [
      { label: 'Cejilla Traste 1', frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1], baseFret: 1, barre: { fret: 1, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'F#7': {
    nameEs: 'Fa# Séptima',
    category: 'Dominante 7',
    tip: 'Dominante de Si Menor ("Dulce Doncella", "El Señor es mi Pastor").',
    voicings: [
      { label: 'Cejilla Traste 2', frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], baseFret: 2, barre: { fret: 2, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'G7': {
    nameEs: 'Sol Séptima',
    category: 'Dominante 7',
    tip: 'Tensión brillante que pide resolver a Do Mayor (Alicia Adorada, Pescador de Hombres).',
    voicings: [
      { label: 'Abierta Clásica', frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], baseFret: 1, barre: null, bass1: 6, bass2: 4 }
    ]
  },
  'A7': {
    nameEs: 'La Séptima',
    category: 'Dominante 7',
    top12Rank: 9,
    tip: 'Deja la 3ª cuerda al aire en medio de La Mayor. Dominante de Re Mayor y Re Menor ("Cien Ovejas", "Obsesión").',
    voicings: [
      { label: 'Abierta Clásica', frets: [0, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0], baseFret: 1, barre: null, bass1: 5, bass2: 6 }
    ]
  },
  'B7': {
    nameEs: 'Si Séptima',
    category: 'Dominante 7',
    top12Rank: 12,
    tip: '¡Sin cejilla! Resuelve con fuerza a Mi Menor o Mi Mayor ("Cinco panes y dos peces", "A edificar la iglesia").',
    voicings: [
      { label: 'Abierta sin Cejilla', frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4], baseFret: 1, barre: null, bass1: 5, bass2: 4 }
    ]
  },

  // ======================== SÉPTIMAS MENORES / MAJ7 / SUS ========================
  'Am7': {
    nameEs: 'La Menor 7',
    category: ' Séptima / Color',
    tip: 'Acorde suave para Adoración y transiciones vallenatas.',
    voicings: [
      { label: 'Abierta Suave', frets: [0, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0], baseFret: 1, barre: null, bass1: 5, bass2: 4 }
    ]
  },
  'Bm7': {
    nameEs: 'Si Menor 7',
    category: 'Séptima / Color',
    tip: 'Alternativa más suave a Si menor.',
    voicings: [
      { label: 'Cejilla Traste 2', frets: [-1, 2, 4, 2, 3, 2], fingers: [0, 1, 3, 1, 2, 1], baseFret: 2, barre: { fret: 2, from: 5, to: 1 }, bass1: 5, bass2: 4 }
    ]
  },
  'Dm7': {
    nameEs: 'Re Menor 7',
    category: 'Séptima / Color',
    tip: 'Media cejilla pequeña con dedo 1 en 1ª y 2ª cuerda traste 1.',
    voicings: [
      { label: 'Abierta Media Cejilla', frets: [-1, 0, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1], baseFret: 1, barre: { fret: 1, from: 2, to: 1 }, bass1: 4, bass2: 5 }
    ]
  },
  'Em7': {
    nameEs: 'Mi Menor 7',
    category: 'Séptima / Color',
    tip: 'Muy usado en adoración contemporánea junto a Cadd9 y G.',
    voicings: [
      { label: 'Abierta Moderna', frets: [0, 2, 2, 0, 3, 0], fingers: [0, 1, 2, 0, 3, 0], baseFret: 1, barre: null, bass1: 6, bass2: 5 }
    ]
  },
  'Cmaj7': {
    nameEs: 'Do Maj7',
    category: 'Séptima / Color',
    tip: 'Sonido contemplativo celestial para momentos de oración.',
    voicings: [
      { label: 'Abierta Contemplativa', frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0], baseFret: 1, barre: null, bass1: 5, bass2: 4 }
    ]
  },
  'Fmaj7': {
    nameEs: 'Fa Maj7',
    category: 'Séptima / Color',
    tip: 'Sustituto hermoso de Fa Mayor sin cejilla para baladas lentas.',
    voicings: [
      { label: 'Abierta sin Cejilla', frets: [-1, -1, 3, 2, 1, 0], fingers: [0, 0, 3, 2, 1, 0], baseFret: 1, barre: null, bass1: 4, bass2: 3 }
    ]
  },
  'Dmaj7': {
    nameEs: 'Re Maj7',
    category: 'Séptima / Color',
    tip: 'Media cejilla en las 3 primeras cuerdas traste 2.',
    voicings: [
      { label: 'Media Cejilla Tr. 2', frets: [-1, 0, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 1, 1], baseFret: 1, barre: { fret: 2, from: 3, to: 1 }, bass1: 4, bass2: 5 }
    ]
  },
  'Gmaj7': {
    nameEs: 'Sol Maj7',
    category: 'Séptima / Color',
    tip: 'Acorde cálido para introducciones de comunión.',
    voicings: [
      { label: 'Abierta Cálida', frets: [3, 2, 0, 0, 0, 2], fingers: [3, 2, 0, 0, 0, 1], baseFret: 1, barre: null, bass1: 6, bass2: 4 }
    ]
  },
  'Cadd9': {
    nameEs: 'Do add9',
    category: 'Séptima / Color',
    tip: 'Mueve dedos 1 y 2 de Sol Mayor una cuerda abajo dejando 3 y 4 fijos: ¡cambios ultrarrápidos en Alabanza!',
    voicings: [
      { label: 'Abierta Moderna', frets: [-1, 3, 2, 0, 3, 3], fingers: [0, 2, 1, 0, 3, 4], baseFret: 1, barre: null, bass1: 5, bass2: 4 }
    ]
  },
  'Dsus4': {
    nameEs: 'Re sus4',
    category: 'Séptima / Color',
    tip: 'Agrega el meñique en 1ª cuerda traste 3 sobre Re Mayor para adornar finales de frase.',
    voicings: [
      { label: 'Abierta Adorno', frets: [-1, 0, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 3, 4], baseFret: 1, barre: null, bass1: 4, bass2: 5 }
    ]
  },
  'Asus2': {
    nameEs: 'La sus2',
    category: 'Séptima / Color',
    tip: 'Deja la 2ª cuerda al aire sobre La Mayor: sonido cristalino.',
    voicings: [
      { label: 'Abierta Cristalina', frets: [0, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0], baseFret: 1, barre: null, bass1: 5, bass2: 6 }
    ]
  },
  'Asus4': {
    nameEs: 'La sus4',
    category: 'Séptima / Color',
    tip: 'Suspensión luminosa que resuelve a La Mayor.',
    voicings: [
      { label: 'Abierta', frets: [0, 0, 2, 2, 3, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1, barre: null, bass1: 5, bass2: 6 }
    ]
  },

  // ======================== BEMOLES / SOSTENIDOS / SLASH ========================
  'A#': {
    nameEs: 'Si Bemol Mayor (Bb)',
    category: 'Mayor',
    tip: 'Aparece en "Alma de Cristo", "Tan Cerca de Mí" y "Resucitó el Señor".',
    voicings: [
      { label: 'Cejilla Forma A (Tr. 1)', frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 2, 3, 4, 1], baseFret: 1, barre: { fret: 1, from: 5, to: 1 }, bass1: 5, bass2: 4 },
      { label: 'Cejilla Forma E (Tr. 6)', frets: [6, 8, 8, 7, 6, 6], fingers: [1, 3, 4, 2, 1, 1], baseFret: 6, barre: { fret: 6, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'D#': {
    nameEs: 'Mi Bemol Mayor (Eb)',
    category: 'Mayor',
    tip: 'Cejilla forma A en traste 6.',
    voicings: [
      { label: 'Cejilla Forma A (Tr. 6)', frets: [-1, 6, 8, 8, 8, 6], fingers: [0, 1, 2, 3, 4, 1], baseFret: 6, barre: { fret: 6, from: 5, to: 1 }, bass1: 5, bass2: 4 }
    ]
  },
  'G#': {
    nameEs: 'La Bemol Mayor (Ab)',
    category: 'Mayor',
    tip: 'Cejilla forma E en traste 4.',
    voicings: [
      { label: 'Cejilla Forma E (Tr. 4)', frets: [4, 6, 6, 5, 4, 4], fingers: [1, 3, 4, 2, 1, 1], baseFret: 4, barre: { fret: 4, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'F#': {
    nameEs: 'Fa Sostenido Mayor',
    category: 'Mayor',
    tip: 'Cejilla forma E en traste 2 ("Jesús te seguiré").',
    voicings: [
      { label: 'Cejilla Forma E (Tr. 2)', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], baseFret: 2, barre: { fret: 2, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'C#': {
    nameEs: 'Do Sostenido Mayor',
    category: 'Mayor',
    tip: 'Cejilla forma A en traste 4.',
    voicings: [
      { label: 'Cejilla Forma A (Tr. 4)', frets: [-1, 4, 6, 6, 6, 4], fingers: [0, 1, 2, 3, 4, 1], baseFret: 4, barre: { fret: 4, from: 5, to: 1 }, bass1: 5, bass2: 4 }
    ]
  },
  'G#m': {
    nameEs: 'Sol Sostenido Menor',
    category: 'Menor',
    tip: 'Aparece en cantos en Mi Mayor ("Al despertar").',
    voicings: [
      { label: 'Cejilla Traste 4', frets: [4, 6, 6, 4, 4, 4], fingers: [1, 3, 4, 1, 1, 1], baseFret: 4, barre: { fret: 4, from: 6, to: 1 }, bass1: 6, bass2: 5 }
    ]
  },
  'G/B': {
    nameEs: 'Sol con Bajo en Si',
    category: 'Bajo Invertido',
    tip: 'Acorde puente precioso para caminar el bajo desde Do → Sol/Si → La menor ("Nadie te ama como yo", "Los Caminos de la Vida").',
    voicings: [
      { label: 'Puente Melódico', frets: [-1, 2, 0, 0, 3, 3], fingers: [0, 1, 0, 0, 3, 4], baseFret: 1, barre: null, bass1: 5, bass2: 4 }
    ]
  },
  'D/F#': {
    nameEs: 'Re con Bajo en Fa#',
    category: 'Bajo Invertido',
    tip: 'Caminata clásica Sol → Re/Fa# → Mi menor en Alabanza y Paseo Vallenato.',
    voicings: [
      { label: 'Puente Sol→Mim', frets: [2, 0, 0, 2, 3, 2], fingers: [1, 0, 0, 2, 4, 3], baseFret: 1, barre: null, bass1: 6, bass2: 4 }
    ]
  },
  'Am/G': {
    nameEs: 'La Menor con Bajo en Sol',
    category: 'Bajo Invertido',
    tip: 'Bajada emotiva de bajo: Am → Am/G → F.',
    voicings: [
      { label: 'Bajada Emotiva', frets: [3, 0, 2, 2, 1, 0], fingers: [4, 0, 2, 3, 1, 0], baseFret: 1, barre: null, bass1: 6, bass2: 4 }
    ]
  },
  // ======================== DISMINUIDOS (DIS. DE KEYNER RAMÍREZ) ========================
  'D#dim7': {
    nameEs: 'Re# Disminuido 7 (Dis.)',
    category: 'Disminuido',
    tip: 'Acorde de paso dramático usado en pasillos como "Oropel" ("si apuestas al amor..."). Pulsa solo las 4 primeras cuerdas.',
    voicings: [
      { label: 'Paso Clásico Tr. 1', frets: [-1, -1, 1, 2, 1, 2], fingers: [0, 0, 1, 3, 2, 4], baseFret: 1, barre: null, bass1: 4, bass2: 3 }
    ]
  },
  'Bdim7': {
    nameEs: 'Si Disminuido 7 (Dis.)',
    category: 'Disminuido',
    tip: 'Tensión simétrica de paso hacia Do o Mi menor.',
    voicings: [
      { label: 'Pasillo Tr. 1', frets: [-1, 2, 0, 1, 0, 1], fingers: [0, 3, 0, 1, 0, 2], baseFret: 1, barre: null, bass1: 5, bass2: 4 }
    ]
  },
  'F#dim7': {
    nameEs: 'Fa# Disminuido 7 (Dis.)',
    category: 'Disminuido',
    tip: 'Paso elegante entre Sol y Mi menor.',
    voicings: [
      { label: 'Posición Compacta', frets: [2, -1, 1, 2, 1, -1], fingers: [3, 0, 1, 4, 2, 0], baseFret: 1, barre: null, bass1: 6, bass2: 4 }
    ]
  }
};

// ============================================================================
// GENERADOR ALGORÍTMICO CAGED DE RESPALDO (100% cobertura en los 12 tonos)
// ============================================================================
function generateMovableChord(chordName) {
  const norm = normalizeChordToAmerican(chordName);
  const { root, suffix } = parseChord(norm);
  const rootIdx = NOTES.indexOf(root);
  if (rootIdx === -1) return CHORDS_DB['C'];

  const isDim = suffix.includes('dim');
  const isMinor = suffix.startsWith('m') && !suffix.startsWith('maj');
  const is7 = suffix.includes('7') && !suffix.includes('maj7');

  // Calcular traste en 6ª cuerda (E = índice 4)
  const fret6 = ((rootIdx - 4) % 12 + 12) % 12 || 12;
  let frets;
  let fingers;
  if (isDim) {
    const f4 = ((rootIdx - 2) % 12 + 12) % 12 || 1;
    return {
      nameEs: `${NOTES_ES[root] || root} Disminuido`,
      category: 'Disminuido',
      tip: 'Acorde simétrico disminuido: recorre la misma figura cada 3 trastes.',
      voicings: [{
        label: `Posición Dis. Traste ${f4}`,
        frets: [-1, -1, f4, f4 + 1, f4, f4 + 1],
        fingers: [0, 0, 1, 3, 2, 4],
        baseFret: f4,
        barre: null,
        bass1: 4,
        bass2: 3
      }]
    };
  } else if (isMinor && is7) {
    frets = [fret6, fret6 + 2, fret6, fret6, fret6, fret6];
    fingers = [1, 3, 1, 1, 1, 1];
  } else if (isMinor) {
    frets = [fret6, fret6 + 2, fret6 + 2, fret6, fret6, fret6];
    fingers = [1, 3, 4, 1, 1, 1];
  } else if (is7) {
    frets = [fret6, fret6 + 2, fret6, fret6 + 1, fret6, fret6];
    fingers = [1, 3, 1, 2, 1, 1];
  } else {
    frets = [fret6, fret6 + 2, fret6 + 2, fret6 + 1, fret6, fret6];
    fingers = [1, 3, 4, 2, 1, 1];
  }

  return {
    nameEs: `${NOTES_ES[root] || root} ${suffix || 'Mayor'}`,
    category: isMinor ? 'Menor' : (is7 ? 'Dominante 7' : 'Mayor'),
    tip: `Posición móvil sistema CAGED con cejilla en traste ${fret6}.`,
    voicings: [
      {
        label: `Cejilla Traste ${fret6}`,
        frets,
        fingers,
        baseFret: fret6,
        barre: { fret: fret6, from: 6, to: 1 },
        bass1: 6,
        bass2: 5
      }
    ]
  };
}

export function getChordData(chordName) {
  if (!chordName) return CHORDS_DB['C'];
  const norm = normalizeChordToAmerican(chordName);
  if (CHORDS_DB[norm]) return CHORDS_DB[norm];
  const mainOnly = norm.split('/')[0];
  if (CHORDS_DB[mainOnly]) return CHORDS_DB[mainOnly];
  return generateMovableChord(norm);
}

export function getChordMidiNotes(chordName, voicingIndex = 0) {
  const data = getChordData(chordName);
  const v = data.voicings[voicingIndex] || data.voicings[0];
  // Devuelve objeto con array completo por cuerda [6ª..1ª] (-1 si muteada) más info de bajos
  const stringMidis = v.frets.map((f, idx6To1) => (f >= 0 ? STRING_OPEN_MIDI[idx6To1] + f : -1));
  return {
    stringMidis,
    bass1StringIdx: 6 - (v.bass1 || 6),
    bass2StringIdx: 6 - (v.bass2 || 5),
    voicing: v
  };
}

// ============================================================================
// RENDERIZADOR SVG DE DIAGRAMA DE ACORDE ESTILO DUOLINGO VIVO
// ============================================================================
export function renderChordSVG(chordName, options = {}) {
  const {
    voicingIndex = 0,
    width = 175,
    height = 215,
    showBasses = true,
    compact = false
  } = options;

  const norm = normalizeChordToAmerican(chordName);
  const data = getChordData(norm);
  const v = data.voicings[voicingIndex] || data.voicings[0];
  const { root } = parseChord(norm);
  const rootColor = NOTE_COLORS[root] || NOTE_COLORS['C'];

  // Determinar traste inicial visible
  const positiveFrets = v.frets.filter(f => f > 0);
  const maxFret = positiveFrets.length ? Math.max(...positiveFrets) : 1;
  const minFret = positiveFrets.length ? Math.min(...positiveFrets) : 1;
  const startFret = maxFret <= 4 ? 1 : minFret;
  const numFrets = 4;

  const padLeft = 28;
  const padRight = 20;
  const padTop = compact ? 34 : 44;
  const padBottom = showBasses ? 32 : 18;
  const gridW = width - padLeft - padRight;
  const gridH = height - padTop - padBottom;
  const stringGap = gridW / 5;
  const fretGap = gridH / numFrets;

  let svg = `<svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" class="chord-svg" role="img" aria-label="Acorde ${norm}">`;

  // Encabezado con píldora de color de la raíz
  svg += `
    <rect x="${width / 2 - 42}" y="3" width="84" height="22" rx="11" fill="${rootColor.bg}" />
    <text x="${width / 2}" y="18" text-anchor="middle" fill="${rootColor.text}" font-family="Nunito, system-ui, sans-serif" font-weight="900" font-size="13">${norm} · ${NOTES_ES[root] || root}</text>
  `;

  // Cejuela (nut) gruesa si empieza en traste 1, o indicador "3fr" al costado
  if (startFret === 1) {
    svg += `<rect x="${padLeft - 2}" y="${padTop - 5}" width="${gridW + 4}" height="6" rx="3" fill="#334155" />`;
  } else {
    svg += `<text x="${padLeft - 8}" y="${padTop + fretGap * 0.65}" text-anchor="end" fill="#475569" font-weight="800" font-size="11">${startFret}fr</text>`;
  }

  // Líneas horizontales de trastes
  for (let f = 0; f <= numFrets; f++) {
    const y = padTop + f * fretGap;
    svg += `<line x1="${padLeft}" y1="${y}" x2="${padLeft + gridW}" y2="${y}" stroke="#CBD5E1" stroke-width="${f === 0 ? 2 : 1.5}" />`;
  }

  // Líneas verticales de las 6 cuerdas (6ª a la izquierda, 1ª a la derecha, calibre decreciente)
  for (let s = 0; s < 6; s++) {
    const x = padLeft + s * stringGap;
    const sw = 2.5 - s * 0.28;
    svg += `<line x1="${x}" y1="${padTop}" x2="${x}" y2="${padTop + gridH}" stroke="#64748B" stroke-width="${sw.toFixed(2)}" />`;
  }

  // Cejilla (barre) si aplica
  if (v.barre && v.barre.fret >= startFret) {
    const relFret = v.barre.fret - startFret + 1;
    const fromIdx = 6 - v.barre.from;
    const toIdx = 6 - v.barre.to;
    const x1 = padLeft + Math.min(fromIdx, toIdx) * stringGap;
    const x2 = padLeft + Math.max(fromIdx, toIdx) * stringGap;
    const cy = padTop + (relFret - 0.5) * fretGap;
    svg += `
      <rect x="${x1 - 7}" y="${cy - 8}" width="${x2 - x1 + 14}" height="16" rx="8" fill="${rootColor.bg}" opacity="0.88" stroke="${rootColor.border}" stroke-width="1.5" />
    `;
  }

  // Puntos de dedos, cuerdas al aire (O) y cuerdas apagadas (X)
  v.frets.forEach((fret, idx6To1) => {
    const x = padLeft + idx6To1 * stringGap;
    if (fret === -1) {
      svg += `<text x="${x}" y="${padTop - 10}" text-anchor="middle" fill="#EF4444" font-weight="900" font-size="12">✕</text>`;
    } else if (fret === 0) {
      const openMidi = STRING_OPEN_MIDI[idx6To1];
      const openNote = NOTES[openMidi % 12];
      const nc = NOTE_COLORS[openNote];
      svg += `<circle cx="${x}" cy="${padTop - 13}" r="5.5" fill="#FFFFFF" stroke="${nc.bg}" stroke-width="2.5" />`;
    } else {
      const relFret = fret - startFret + 1;
      if (relFret >= 1 && relFret <= numFrets) {
        const cy = padTop + (relFret - 0.5) * fretGap;
        const midi = STRING_OPEN_MIDI[idx6To1] + fret;
        const noteName = NOTES[midi % 12];
        const nc = NOTE_COLORS[noteName];
        const finger = v.fingers[idx6To1] || '';
        svg += `
          <circle cx="${x}" cy="${cy}" r="9.5" fill="${nc.bg}" stroke="${nc.border}" stroke-width="2" />
          <text x="${x}" y="${cy + 3.8}" text-anchor="middle" fill="${nc.text}" font-family="Nunito, sans-serif" font-weight="900" font-size="11">${finger}</text>
        `;
      }
    }
  });

  // Indicadores de Bajo Primario (B1) y Bajo Secundario (B2) abajo
  if (showBasses) {
    const b1Idx = 6 - (v.bass1 || 6);
    const b2Idx = 6 - (v.bass2 || 5);
    const yBass = padTop + gridH + 17;

    const x1 = padLeft + b1Idx * stringGap;
    svg += `
      <rect x="${x1 - 11}" y="${yBass - 10}" width="22" height="15" rx="6" fill="#1CB0F6" />
      <text x="${x1}" y="${yBass + 1}" text-anchor="middle" fill="#FFF" font-weight="900" font-size="9">B1</text>
    `;

    if (b2Idx !== b1Idx) {
      const x2 = padLeft + b2Idx * stringGap;
      svg += `
        <rect x="${x2 - 11}" y="${yBass - 10}" width="22" height="15" rx="6" fill="#00CD9C" />
        <text x="${x2}" y="${yBass + 1}" text-anchor="middle" fill="#FFF" font-weight="900" font-size="9">B2</text>
      `;
    }
  }

  svg += `</svg>`;
  return svg;
}
