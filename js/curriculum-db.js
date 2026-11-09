// ============================================================================
// js/curriculum-db.js
// Biblioteca Teórica Completa (THEORY_LIBRARY) + Ruta Gamificada Estilo Duolingo
// Expandida: 9 Unidades · 36 Lecciones · +150 Desafíos con Remediación Teórica
// + Reto Interactivo de 30 Días + Método Numérico Keyner Ramírez Mojica (10–60).
// ============================================================================

export const THEORY_LIBRARY = {
  guitar_anatomy: {
    id: 'guitar_anatomy',
    title: 'Anatomía y Partes de la Guitarra',
    badge: 'Organología · Keyner Ramírez & Camavaro',
    image: './assets/img/guitar_parts_diagram.jpg',
    summary: 'Conoce cada pieza acústica para afinar, pulsar y cuidar tu instrumento.',
    explanation: `• **Cabeza o Clavijero y Clavijas (6-5-4-3-2-1)**: alojan el mecanismo que tensa o afloja cada cuerda para afinar.\n• **Ceja / Cejuela (Traste 0)**: separa las cuerdas al aire del diapasón.\n• **Diapasón, Trastes y Espacios**: el diapasón es la madera frontal del mástil; los trastes son las barras metálicas y los espacios son las casillas donde pisan tus dedos.\n• **Caja de Resonancia (Tapa, Aros, Fondo, Boca y Puente)**: amplifica naturalmente la vibración; el hueso del puente transmite la energía hacia la tapa armónica.`,
    exampleTip: 'Recuerda: pisa con la yema en el ESPACIO justo detrás de la barra metálica del traste, nunca encima del metal.',
    demoChord: 'Em'
  },
  guitar_posture: {
    id: 'guitar_posture',
    title: 'Postura Ergonómica (Clásica vs. Popular)',
    badge: 'Biomecánica · Keyner Ramírez p.4',
    image: './assets/img/guitar_posture_styles.jpg',
    summary: 'Dos formas correctas de sentarte para tocar sin fatiga ni dolor lumbar.',
    explanation: `• **Posición Clásica (Académica)**: utiliza un banquito (15–18 cm) en el pie izquierdo; la cintura de la guitarra reposa en el muslo izquierdo y el mástil sube a ~45° para abrir la muñeca en punteos y cejillas.\n• **Posición Popular / Despreocupada**: la caja apoya en el muslo derecho y la cara frontal mira verticalmente hacia el frente ("nunca inclinada hacia el techo").\n• **Anclaje**: espalda recta, hombros relajados y codo izquierdo libre de tensiones.`,
    exampleTip: 'Nunca mires el diapasón doblando la tapa hacia arriba: inclinar la guitarra daña la muñeca izquierda.',
    demoChord: 'G'
  },
  hands_nails: {
    id: 'hands_nails',
    title: 'Numeración de Manos (1-2-3-4 / p-i-m-a) y Uñas',
    badge: 'Técnica Bimanual · Keyner Ramírez p.5',
    image: './assets/img/guitar_hands_numbering.jpg',
    summary: 'Cada mano cumple un rol complementario con preparación específica de uñas.',
    explanation: `• **Mano Izquierda (Diapasón)**: **1** Índice, **2** Medio, **3** Anular, **4** Meñique. El pulgar sirve de soporte **detrás del mástil**. Sus uñas deben estar **muy cortas y limadas** para pisar perpendicularmente.\n• **Mano Derecha (Pulsación)**: **p** Pulgar (bajos 6ª-5ª-4ª), **i** Índice (3ª), **m** Medio (2ª), **a** Anular (1ª), **ch/m** Meñique (solo rasgueos).\n• **Uñas mano derecha**: ligeramente más largas (1–2 mm) y redondeadas sin bordes ásperos para un ataque cálido.`,
    exampleTip: 'En mano derecha usa p-i-m-a-m-i sin tensionar la muñeca; en la izquierda pisa en "martillo".',
    demoNotes: [64, 59, 55, 50, 45, 40]
  },
  open_strings_colors: {
    id: 'open_strings_colors',
    title: 'Las 6 Cuerdas al Aire y su Afinación Estándar',
    badge: 'Lectura Sonora · E-B-G-D-A-E',
    summary: 'Identifica cuerda, nombre dual (Latino/Americano) y altura grave-aguda.',
    explanation: `Las cuerdas se numeran **de la más delgada/aguda abajo (1ª) hacia la más gruesa/grave arriba (6ª)**:\n• **1ª**: **E4 (Mi agudo)** 🟨  |  **2ª**: **B3 (Si)** 🟪  |  **3ª**: **G3 (Sol)** 🟩\n• **4ª**: **D3 (Re)** 🟧  |  **5ª**: **A2 (La)** 🟦  |  **6ª**: **E2 (Mi grave)** 🟨\nDos trastes forman 1 Tono, salvo **Mi–Fa** y **Si–Do** que están separados por **1 Semitono (1 traste)**.`,
    exampleTip: 'De Mi al aire a Fa solo avanzas al traste 1 (igual de Si al aire a Do). Entre todas las demás notas naturales hay 2 trastes.',
    demoNotes: [40, 45, 50, 55, 59, 64]
  },
  notation_dual: {
    id: 'notation_dual',
    title: 'Cifrado Americano, Latino y Simbología Keyner',
    badge: 'Teoría Universal + Keyner Ramírez',
    summary: 'Traduce al instante entre DO-RE-MI, C-D-E-F-G-A-B y la clave DO+/LA-/5ª.',
    explanation: `• **Equivalencia alfabética**: **A=La**, **B=Si**, **C=Do**, **D=Re**, **E=Mi**, **F=Fa**, **G=Sol**.\n• **Cualidad**: Letra sola = Mayor (**G** / **SOL+**); **m** = Menor (**Am** / **LA-**); **7** = Dominante con 7ª.\n• **Clave Keyner Ramírez**: escribe **+** para Mayor (\` + '\`LA+\`' + \` = \` + '\`A\`' + \`), **-** para Menor (\` + '\`LA-\`' + \` = \` + '\`Am\`' + \`), y llama **5ª DE...** al acorde dominante de una tonalidad (\` + '\`5ª LA\`' + \` = \` + '\`E7\`' + \`, dominante de La).`,
    exampleTip: 'Recuerda: 5ª DE DO = G7, 5ª DE SOL = D7, 5ª DE LA = E7, 5ª DE RE = A7, 5ª DE MI = B7.',
    demoChord: 'E7'
  },
  keyner_numeric_grid: {
    id: 'keyner_numeric_grid',
    title: 'Método Numérico de Keyner Ramírez (10–60)',
    badge: 'Haga Música con la Guitarra · p.6–8',
    image: './assets/img/keyner_numeric_fretboard.jpg',
    summary: 'Sistema colombiano de 2 o 3 dígitos que indica cuerda exacta + traste sin saber solfeo.',
    explanation: `Cada posición del diapasón se escribe uniendo dos números:\n• **Primer dígito (1 a 6)** = Número de la **cuerda**.\n• **Dígito(s) siguientes (0 a 22)** = Número del **espacio/traste** (\` + '\`0\`' + \` = al aire).\nEjemplos reales del libro:\n• \` + '\`10, 20, 30, 40, 50, 60\`' + \` = cuerdas 1ª a 6ª al aire.\n• \` + '\`43\`' + \` = **4ª cuerda, espacio 3** (nota Fa).\n• \` + '\`112\`' + \` = **1ª cuerda, espacio 12** (nota Mi octava alta).`,
    exampleTip: 'Regla de dedo en Keyner: si termina en 1→Dedo 1, en 2→Dedo 2, en 3→Dedo 3, en 4→Dedo 4 (en posición I).',
    demoNotes: [53, 55, 57, 59, 60]
  },
  keyner_semichords_scale: {
    id: 'keyner_semichords_scale',
    title: 'Semi-Acordes (21/32), Asterisco (*) y Escala Do a 2 Octavas',
    badge: 'Lectura Numérica Avanzada · Keyner',
    image: './assets/img/keyner_numeric_fretboard.jpg',
    summary: 'Dobles cuerdas para pasillos, bajos de enlace (*) y escala diatónica completa.',
    explanation: `• **Semi-acordes (\` + '\`21/32\`' + \`)**: barra inclinada \`/\` indica pulsar **dos cuerdas simultáneamente** en terceras o sextas (clásico en duetos de tiple/guitarra).\n• **Asterisco (\` + '\`*\`' + \` como \` + '\`53*\`' + \`)**: señala un **bajeo melódico de paso** con el pulgar conectando un acorde con el siguiente.\n• **Escala de Do Mayor (2 octavas, Keyner p.7)**: \` + '\`53-40-42-43-30-32-20-21-23-10-11-13-15-17-18\`' + \`.`,
    exampleTip: 'En nuestra pestaña "🎯 Tablaturas", selecciona "Mostrar → Método Keyner (10-60)" para estudiar cualquier punteo en este código.',
    demoNotes: [48, 50, 52, 53, 55, 57, 59, 60]
  },
  tab_reading_techniques: {
    id: 'tab_reading_techniques',
    title: 'Lectura de Tablatura (TAB) y Signos de Expresión',
    badge: 'Notación Moderna · h, p, /, v',
    summary: 'Domina las 6 líneas horizontales de la TAB moderna y sus articulaciones expresivas.',
    explanation: `• En la TAB, la **línea superior es la 1ª cuerda (Mi agudo)** y la inferior es la **6ª (Mi grave)** — igual como ves la guitarra desde arriba.\n• Los números indican el traste exacto (\` + '\`0\`' + \` aire).\n• **Articulaciones**: **h** (*hammer-on* / ligado ascendente), **p** (*pull-off* / ligado descendente), **/** (*slide* o arrastre entre trastes), **v** (*vibrato* expresivo).`,
    exampleTip: 'Un hammer-on (ligado h) suena más fluido en punteos vallenatos porque imita el fuelle continuo del acordeón.',
    demoNotes: [64, 65, 67]
  },
  minor_open_chords: {
    id: 'minor_open_chords',
    title: 'Tríadas Menores Abiertas (Em, Am, Dm)',
    badge: 'Acordes Base · Tensión Emotiva',
    summary: 'La tercera menor (b3) crea el carácter recogido y profundo de baladas y cumbias.',
    explanation: `Una tríada menor se forma por **Tónica + 3ª menor (3 semitonos) + 5ª justa (7 semitonos)**:\n• **Mi menor (Em \` + '\`022000\`' + \`)**: solo 2 dedos (5ª tr.2 y 4ª tr.2). Suenan las 6 cuerdas.\n• **La menor (Am \` + '\`x02210\`' + \`)**: misma forma bajando todo 1 cuerda e incluyendo 2ª traste 1.\n• **Re menor (Dm \` + '\`xx0231\`' + \`)**: triángulo agudo desde la 4ª cuerda al aire.`,
    exampleTip: 'Observa el parecido visual entre Am y E Mayor: tienen exactamente la misma figura separada por 1 cuerda.',
    demoChord: 'Am'
  },
  major_open_chords: {
    id: 'major_open_chords',
    title: 'Acordes Mayores Abiertos (C, D, G, A, E) y Dedo Pivote',
    badge: 'Vocabulario Esencial · Top 12 Litúrgico',
    summary: 'Cambia de acorde en menos de medio segundo usando dedos guía o pivote.',
    explanation: `• Un acorde Mayor suena **luminoso, firme y resuelto** (Tónica + 3ª Mayor + 5ª Justa).\n• **Truco del Dedo Pivote**: al pasar de **G → D**, deja quieto el **dedo 3 en 2ª cuerda traste 3**. De **C → Am**, deja quietos **dedos 1 y 2** y mueve solo el dedo 3.\n• Cuidado con los bajos: en **D** evita rozar la 6ª cuerda; en **C** toca desde la 5ª.`,
    exampleTip: 'G, D, Em y C te permiten acompañar más del 65% de las alabanzas de misa.',
    demoChord: 'G'
  },
  harmonic_circle_basic: {
    id: 'harmonic_circle_basic',
    title: 'El Círculo Armónico y Progresión I – VIm – IIm – V7',
    badge: 'Armonía Circular · Alabanza & Serenata',
    summary: 'Por qué cuatro acordes encadenados generan un ciclo continuo tan agradable.',
    explanation: `• **Grado I (Tónica)**: sensación de hogar (**C**).\n• **Grado VIm (Relativo menor)**: tónica emotiva (**Am**).\n• **Grado IIm (Subdominante)**: prepara el viaje (**Dm**).\n• **Grado V7 (Dominante)**: máxima tensión que pide volver al I (**G7** → **C**).\nEn tonalidad de Sol Mayor equivale exactamente a **G → Em → Am → D7**.`,
    exampleTip: 'Cada paso en el círculo cae por intervalos naturales de cuarta/quinta, creando gravedad sonora hacia la tónica.',
    demoChord: 'G7'
  },
  strumming_44_engine: {
    id: 'strumming_44_engine',
    title: 'El Motor Constante en 4/4 y el Péndulo de Muñeca',
    badge: 'Mano Derecha · Vaivén Mecánico',
    summary: 'El secreto para no perder jamás el ritmo al cantar o cambiar de acorde.',
    explanation: `• Tu antebrazo/muñeca derecha funciona como un **péndulo ininterrumpido**: baja en los pulsos **1, 2, 3, 4** y sube en los contratiempos **"y"**.\n• Cuando aparece un símbolo **· (Aire)** en \` + '\`↓ · ↓ ↑ · ↑ ↓ ↑\`' + \`, **NO frenes la mano**: la mano pasa rozando el aire para caer justo a tiempo en la siguiente subida.\n• Sílabas mágicas: **"VOY — PIE-DRA — TA-PIE-DRA"**.`,
    exampleTip: 'Incluso si tu mano izquierda llega medio segundo tarde al acorde, NUNCA detengas tu mano derecha.',
    demoChord: 'C'
  },
  slap_percussion_24: {
    id: 'slap_percussion_24',
    title: 'El Chasquido Percusivo (✕) y Marchas Litúrgicas (2/4)',
    badge: 'Percusión en Guitarra · Coritos de Alabanza',
    summary: 'Convierte tu guitarra en batería simulando el redoblante en los tiempos débiles.',
    explanation: `• **Chasquido o Apagado (✕)**: mientras las uñas de \` + '\`i-m-a\`' + \` rozan las cuerdas agudas hacia abajo, el **borde lateral de la palma** (eminencia hipotenar) apaga instantáneamente las cuerdas contra el puente.\n• En alabanzas festivas 4/4 va en tiempos **2 y 4** (\` + '\`↓ · ✕ ↑ · ↑ ✕ ↑\`' + \`).\n• En coritos en **2/4** ("Alabaré", "A Edificar") marca **B1 ↑ ✕ ↑ | B2 ↑ ↓ ↑** con pulso vivo.`,
    exampleTip: 'El apagado debe sonar como un "CHAK" seco de caja de percusión sin dejar resonar notas falsas.',
    demoChord: 'E'
  },
  meters_34_68_bolero: {
    id: 'meters_34_68_bolero',
    title: 'Compases Ternarios (Vals 3/4, 6/8) y Bolero (4/4)',
    badge: 'Métrica & Expresión · Misa & Serenata',
    summary: 'Distingue el vals de 3 tiempos, el mecido binario de 6/8 y el bolero romántico.',
    explanation: `• **Vals 3/4**: acento fuerte en el **tiempo 1 (Bajo B1)** seguido de dos pulsos ligeros (**UN-dos-tres**). Ideal para "Eran Cien Ovejas" y cantos marianos.\n• **Seis por Ocho (6/8)**: 6 corcheas agrupadas en **2 bloques de 3** (**UN**-dos-tres **CUA**-tro-cinco-seis). Es el mecido de "Pescador de Hombres" y el Merengue Vallenato.\n• **Bolero 4/4**: combina bajo grave en 1, chasquido en 3 y rasgueo ligado hacia el bajo alterno.`,
    exampleTip: 'Si puedes contar "UN-dos-tres, UN-dos-tres" valseado es 3/4; si sientes 2 pulsos grandes subdivididos en 3 ("TÁ-ca-ta TÁ-ca-ta") es 6/8.',
    demoChord: 'D7'
  },
  classical_arpeggios: {
    id: 'classical_arpeggios',
    title: 'Arpegios Clásicos (p-i-m-a-m-i) de Carulli',
    badge: 'Cuadernillo Medina & Caliva · Comunión',
    summary: 'Asigna cada cuerda a su dedo natural para tocar arpegios fluidos sin mirar.',
    explanation: `• **Regla de Oro Clásica**: Pulgar (**p**) toca las **cuerdas 6, 5 o 4** (según el bajo del acorde); **i** toca la **3ª**, **m** la **2ª**, y **a** la **1ª**.\n• En el patrón estrella **p - i - m - a - m - i** (8 o 6 pasos) la mano queda flotando estable sin brincar.\n• Flexiona desde los nudillos hacia la palma, nunca jalando las cuerdas hacia afuera.`,
    exampleTip: 'Este arpegio transforma inmediatamente cantos como "Nadie te ama como yo" en momentos de adoración profunda.',
    demoChord: 'Cmaj7'
  },
  bass_alternation_b1_b2: {
    id: 'bass_alternation_b1_b2',
    title: 'Bajos Alternos (B1 Fundamental y B2 Quinta) — "Entre Cuerdas"',
    badge: 'Técnica Caribeña · Vallenato, Vals & Cumbia',
    summary: 'El pulgar alterna entre la raíz del acorde y su 5ª nota para simular un bajista real.',
    explanation: `• **Bajo 1 (B1)**: nota raíz que da nombre al acorde (**6ª** en G/E/F; **5ª** en C/A/Am; **4ª** en D/Dm).\n• **Bajo 2 (B2)**: quinta del acorde en cuerda vecina (**6ª↔5ª** o **5ª↔4ª**).\n• **Truco estrella en Do Mayor (C)**: toca B1 en **5ª cuerda traste 3 (Do)** y sube el dedo 3 a **6ª cuerda traste 3 (Sol)** para obtener un **B2 súper profundo** muy usado en vallenato.`,
    exampleTip: 'En cualquier canción, sin un buen diálogo B1 → B2 el vallenato suena plano aunque los acordes agudos estén bien.',
    demoChord: 'C'
  },
  vallenato_airs: {
    id: 'vallenato_airs',
    title: 'Los 4 Aires del Vallenato: Paseo, Merengue, Son y Puya',
    badge: 'Folclor del Caribe · Valledupar & Sabana',
    summary: 'Diferencia métrica, función del bajo y relación con caja y guacharaca.',
    explanation: `• **Paseo (4/4)**: rey lírico (\` + '\`Los Caminos de la Vida\`' + \`). Base guitarra: **B1 ↑ ✕ ↓ B2 · ↓ ↑**.\n• **Merengue (6/8)**: fiestero, vivo y bailable (\` + '\`La Casa en el Aire\`' + \`). Compás rápido de 6 golpes.\n• **Son (4/4 lento)**: nostálgico donde el **bajo pulsa y responde** con síncopas de peso antes que los rasgueos.\n• **Puya**: aire vertiginoso de competencia acordeonera.`,
    exampleTip: 'Imita la caja vallenata marcando el golpe seco (✕) mientras la subida simula el raspado de la guacharaca.',
    demoChord: 'A7'
  },
  pasillo_bambuco_guabina: {
    id: 'pasillo_bambuco_guabina',
    title: 'Pasillo, Bambuco y Guabina — Repertorio de Keyner Ramírez',
    badge: 'Folclor Andino Colombiano · 3/4 y 6/8',
    summary: 'Domina el chasquido sincopado del pasillo y la polirritmia del bambuco.',
    explanation: `• **Pasillo Colombiano (3/4 vivo)**: rasgueo elegante con apagado acentuado en el tiempo 2 (\` + '\`Espumas\`' + \`, \` + '\`Oropel\`' + \`, \` + '\`Pescador, Lucero y Río\`' + \`).\n• **Bambuco (6/8 ↔ 3/4)**: alterna acentos en 3 y 6 con apagado percusivo (B1 ↓ ✕ B2 ↓ ✕).\n• **Guabina (3/4 dulce)**: cadencia cantable andina muy favorable para alternar B1 y B2 con dulzura.`,
    exampleTip: 'Casi todos los grandes pasillos colombianos alternan una estrofa nostálgica en Modo Menor con un coro brillante en su Homónimo Mayor.',
    demoChord: 'A'
  },
  cumbia_porro_groove: {
    id: 'cumbia_porro_groove',
    title: 'Cumbia Tradicional y Porro Sabanero ("Carmen de Bolívar")',
    badge: 'Folclor Costeño · Alegre, Llamador & Sabana',
    summary: 'Aprende el contratiempo inmortal del tambor llamador y las modulaciones de Lucho Bermúdez.',
    explanation: `• **Cumbia (4/4)**: **B1 ↑ ✕ ↑ B2 ↑ ✕ ↑**. El secreto costeño está en el **contratiempo constante de subida (y)**: imita el golpe del tambor llamador ("tapa-CHÁ").\n• **Porro Sabanero (4/4 alegre)**: sincopa el chasquido entre los tiempos 2 y 3 con bajos potentes.\n• **Fórmula de Oro de Lucho Bermúdez**: estrofa en Tono Menor (\` + '\`Dm\`' + \` o \` + '\`Am\`' + \`) y coro en Homónimo Mayor (\` + '\`D\`' + \` o \` + '\`A\`' + \`).`,
    exampleTip: 'En "El Año Viejo" solo necesitas 2 acordes: Am y E7 (LA- y 5ª LA) manteniendo firme el contratiempo de cumbia.',
    demoChord: 'Dm'
  },
  homonymous_modulation_dim: {
    id: 'homonymous_modulation_dim',
    title: 'Modulación Homónima (Menor ↔ Mayor) y Acorde Disminuido (DIS.)',
    badge: 'Armonía Expresiva · Keyner & Folclor',
    summary: 'Cómo dar un giro dramático entre melancolía y alegría usando la misma nota tónica.',
    explanation: `• **Modulación Homónima**: pasa de una tonalidad **Menor** a **Mayor manteniendo el mismo nombre** (**Am → A** en *Pueblito Viejo* y *Al Sur*; **Em → E** en *Oropel*; **Dm → D** en *Carmen de Bolívar*).\n• **Acorde Disminuido 7 (DIS.)**: súper tensión simétrica por terceras menores (**D#dim7** en *Oropel*) que crea drama antes de caer al acorde dominante (**B7 / 5ª de Mi**).`,
    exampleTip: 'Cambia de LA- a LA+ cuando quieras abrir la canción hacia la luz, ¡sin cambiar de centro tonal!',
    demoChord: 'D#dim7'
  },
  keyner_harmonic_relations: {
    id: 'keyner_harmonic_relations',
    title: 'Relaciones Armónicas de Keyner ("5ª de...", Primitivo y Relativo)',
    badge: 'Tabla Maestra · Keyner Ramírez p.5',
    summary: 'Comprende la familia natural de acordes de cualquier tonalidad antes de tocar de oído.',
    explanation: `En la página 5 de Keyner Ramírez se estructuran 6 pilares para cada tono:\n• **1. Tono Primitivo (I)**: acorde principal (ej. **Do Mayor** / **La Menor**).\n• **2. Relativo (VIm o III)**: comparten exactamente las mismas notas de la escala (**C ↔ Am**, **G ↔ Em**, **D ↔ Bm**).\n• **3. 5ª Siguiente (Dominante V7)**: acorde con 7ª que llama directamente al Primitivo (**5ª de Do = G7**, **5ª de Sol = D7**, **5ª de La = E7**).\n• **4. Subdominante (IV)**: abre el camino armónico (**F** en Do, **C** en Sol, **Dm** en Am).`,
    exampleTip: 'Si ves "5ª RE" en el libro de Keyner, recuerda contar 5 notas desde Re (Re-Mi-Fa-Sol-La): ¡su 5ª Dominante es LA7 (A7)!',
    demoChord: 'G'
  },
  secondary_dominants: {
    id: 'secondary_dominants',
    title: 'Dominantes Secundarios (V7/IV, V7/VI, V7/V) y Adornos Modales',
    badge: 'Armonía Intermedia · Cancionero Digital',
    summary: 'Explica los acordes "fuera de escala" que disparan la emoción en los coros.',
    explanation: `• **V7/IV ("Pase al Coro")**: convertir el I grado en Dominante 7 para empujar al IV (**G → G7 → C** en *Alma Misionera*; **D → D7 → G** en *Dios Está Aquí*).\n• **V7/VI**: Dominante que empuja al relativo menor (**B7 → Em** en *Cinco Panes y Dos Peces*).\n• **Intercambio Modal (IV → IVm)**: volver menor el 4º grado justo antes de regresar a casa (**G → Gm → D** en *Cien Ovejas*).`,
    exampleTip: 'Cuando escuches una canción subir de intensidad justo antes del coro, busca un acorde con "7" que no pertenecía a la escala original.',
    demoChord: 'B7'
  },
  slash_chords_capo: {
    id: 'slash_chords_capo',
    title: 'Bajos Invertidos (Slash Chords) y Transporte con Capotraste',
    badge: 'Arreglo Inteligente · Cejilla Móvil',
    summary: 'Camina por grados conjuntos con el bajo (`G/B`, `D/F#`) y adapta tonos con el Capo.',
    explanation: `• **Slash Chords (\`G/B\`, \`D/F#\`)**: a la izquierda va el **acorde**, a la derecha la **nota más grave del bajo** (\`C → G/B → Am\` crea una línea suave **Do - Si - La**).\n• **Física del Capotraste**: cada traste donde pones el Capo **sube +1 semitono real** la guitarra. Por tanto, si tocas figuras de **G** con Capo en el traste 2, está sonando **A Mayor (+2 st)**!`,
    exampleTip: 'Si una alabanza está en A y te cuesta Bm/F#m, pon Capo en traste 2 y tócala usando figuras abiertas de Sol (G - D - Em - C).',
    demoChord: 'G/B'
  },
  barre_chords_biomechanics: {
    id: 'barre_chords_biomechanics',
    title: 'Biomecánica de la Cejilla Sin Dolor (Fa, Si menor y Móviles)',
    badge: 'Nivel Intermedio · Fran Cordón',
    summary: 'Gira el índice 15° y usa el peso del brazo en vez de estrangular el mástil.',
    explanation: `1. **Borde lateral óseo**: gira sutilmente el dedo índice hacia el clavijero para pisar con el costado recto, no con las almohadillas arrugadas.\n2. **Proximidad al metal**: coloca el índice milímetros detrás del traste y acerca el codo izquierdo a tus costillas.\n3. **Contrapeso**: tira levemente hacia atrás con el peso del hombro izquierdo mientras el antebrazo derecho equilibra la caja.`,
    exampleTip: 'Atajo temporal útil mientras fortaleces la mano: usa Fmaj7 (`xx3210`) en lugar de F, y Bm7 abierto en pasajes lentos.',
    demoChord: 'F'
  },
  spider_independence_caged: {
    id: 'spider_independence_caged',
    title: 'La Arañita 1-2-3-4 (Iván Becerra) y Sistema Móvil CAGED',
    badge: 'Técnica & Geometría Total · Becerra / CAGED',
    summary: 'Despierta el meñique y transporta los 5 moldes abiertos a los 12 tonos del diapasón.',
    explanation: `• **Arañita 1-2-3-4**: camina por trastes 1-2-3-4 **manteniendo presionado cada dedo** mientras sube el siguiente.\n• **Sistema CAGED**: las 5 formas abiertas (**C-A-G-E-D**) se convierten en acordes móviles al añadir cejilla con el índice.\n  - Forma **E** con cejilla en traste 1 = **F**; traste 3 = **G**; traste 5 = **A (\`577655\`)**; traste 8 = **C**.\n  - Forma **A** con cejilla en traste 2 = **B**; traste 3 = **C**; traste 5 = **D**.`,
    exampleTip: 'Si memorizas las notas de la 6ª y 5ª cuerda hasta el traste 12, ¡puedes construir cualquier acorde Mayor o Menor al instante!',
    demoChord: 'F#m'
  },
  scales_improvisation_mixolydian: {
    id: 'scales_improvisation_mixolydian',
    title: 'Escala Pentatónica, Modo Mixolidio y Menor Armónica',
    badge: 'Improvisación & Punteo · Folclor + Alabanza',
    summary: 'Tres mapas sonoros para inventar intros, respuestas melódicas y pases de acordeón.',
    explanation: `• **Pentatónica Menor / Mayor (5 notas)**: elimina las tensiones difíciles (4ª y 7ª). La Caja 1 de **Am (traste 5: 5-8, 5-7, 5-7, 5-7, 5-8, 5-8)** funciona sobre **Am Y Do Mayor (C)**.\n• **Modo Mixolidio (\`1-2-3-4-5-6-b7\`)**: añade la **séptima bemol**; es la firma melódica del Vallenato sobre acordes V7.\n• **Menor Armónica**: eleva un semitono la 7ª nota (\`Sol → Sol#\` en La menor = \`3ª cuerda traste 1\`) justo cuando suena **E7** en cumbias y vallenatos.`,
    exampleTip: 'En La Gota Fría y La Piragua, esa nota Sol# (`31` en Keyner) sobre E7 es la que da todo el sabor latino tradicional.',
    demoNotes: [57, 60, 62, 64, 67, 69]
  }
};

export const SKILL_UNITS = [
  // ============================================================================
  // UNIDAD 1: ANATOMÍA, POSTURA, MANOS Y CUERDAS AL AIRE (4 LECCIONES)
  // ============================================================================
  {
    id: 'unit_1',
    number: 1,
    title: 'Despegue: Anatomía, Postura y Nomenclatura',
    subtitle: 'Partes de la guitarra, postura clásica/popular, numeración bimanual, cuerdas y cifrados',
    color: '#58CC02',
    borderColor: '#46A302',
    icon: '🎸',
    sourceBook: 'Keyner Ramírez (p.4–5) & Camavaro',
    lessons: [
      {
        id: 'u1_l1',
        title: 'Partes de la Guitarra y Postura Sin Tensión',
        icon: '📐',
        xp: 25,
        summary: 'Reconoce cada parte acústica del instrumento y domina las 2 posturas correctas.',
        steps: [
          {
            type: 'theory',
            theoryId: 'guitar_anatomy',
            badge: 'Anatomía · Keyner Ramírez p.4',
            title: 'Conoce tu instrumento de la Cabeza al Puente',
            image: './assets/img/guitar_parts_diagram.jpg',
            body: `Antes de tocar una sola nota, identifica las piezas clave que aparecen en el diagrama:\n• **Clavijero y Clavijas (6-5-4-3-2-1)**: ajustan la tensión exacta para afinar.\n• **Ceja o Cejuela** y **Trastes / Espacios**: los trastes son las barritas metálicas; tus dedos pisan los **espacios** justo detrás del metal.\n• **Boca, Tapa Armónica, Aros, Puente y Hueso**: proyectan el sonido de tu guitarra hacia afuera.`,
            highlightBox: 'Recuerda revisar nuestra nueva pestaña "📐 Guitarra 3D" para rotar la guitarra y hacer clic sobre cada pieza en 3D.',
            actionTarget: { tab: 'guitar3d', itemId: 'anatomy', label: 'Explorar Anatomía en Guitarra 3D' }
          },
          {
            type: 'theory',
            theoryId: 'guitar_posture',
            badge: 'Ergonomía · Keyner Ramírez p.4',
            title: 'Postura Clásica vs. Postura Popular',
            image: './assets/img/guitar_posture_styles.jpg',
            body: `Puedes estudiar en **Posición Clásica** (guitarra en muslo izquierdo + banquito bajo el pie izquierdo, mástil elevado a **~45°**) o en **Posición Popular / Despreocupada** (cintura apoyada en muslo derecho, ideal en Misa o parranda).\n• Regla de oro en ambos casos: **la cara frontal de la guitarra debe mirar al frente**, nunca acostada hacia el techo para espiar las cuerdas.`,
            highlightBox: 'Si te inclinas hacia el diapasón encorvas la espalda y bloqueas los dedos. Lleva la guitarra hacia ti.',
            demoChord: 'Em'
          },
          {
            type: 'quiz',
            theoryId: 'guitar_anatomy',
            question: '¿Cómo se llaman las barritas metálicas transversales del diapasón y dónde exactamente debe pisar el dedo?',
            options: [
              'Clavijas; debes pisar justo encima del metal',
              'Trastes; debes pisar en el espacio justo detrás (antes) de la barra metálica',
              'Cejuelas; se pisa exactamente en el centro geométrico del diapasón',
              'Aros; se pisa con el nudillo del dedo índice'
            ],
            correctIndex: 1,
            explanation: '¡Correcto! Los metalitos se llaman trastes y los dedos pisan los espacios milímetros detrás del traste para que la nota suene limpia sin trasteo.'
          },
          {
            type: 'quiz',
            theoryId: 'guitar_posture',
            question: 'En la Posición Clásica recomendada para punteos exigentes y estudio técnico, ¿sobre qué pierna reposa la cintura de la guitarra?',
            options: [
              'Muslo derecho con la cabeza completamente horizontal',
              'Muslo izquierdo (elevado con banquito), subiendo el mástil ~45°',
              'En el suelo apoyando el botón trasero',
              'Acostada plana sobre ambas rodillas mirando al techo'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! El apoyo en el muslo izquierdo con un ángulo de 45° alinea la muñeca izquierda naturalmente sin doblarla.'
          },
          {
            type: 'quiz',
            theoryId: 'guitar_anatomy',
            question: '¿Qué pieza blanca junto al puente transmite la vibración de las cuerdas hacia la tapa de la caja acústica?',
            options: [
              'La cejuela de la cabeza',
              'El hueso del puente (selleta)',
              'La placa contra arañazos (golpeador)',
              'El talón del cuello'
            ],
            correctIndex: 1,
            explanation: '¡Muy bien! El hueso del puente acopla mecánicamente la vibración de las 6 cuerdas a la tapa armónica.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'guitar_posture',
            title: 'Chequeo de Postura y Limpieza: Mi Menor (Em)',
            instruction: 'Mantén la cara frontal vertical, arquea dedos 2 y 3 en "martillo" y haz sonar limpias las 6 cuerdas.',
            chord: 'Em'
          }
        ]
      },
      {
        id: 'u1_l2',
        title: 'Numeración de Manos, PIMA y Uñas',
        icon: '🖐️',
        xp: 25,
        summary: 'Asigna cada número de dedo (1–4) y letra derecha (p-i-m-a) con técnica profesional.',
        steps: [
          {
            type: 'theory',
            theoryId: 'hands_nails',
            badge: 'Técnica Bimanual · Keyner Ramírez p.5',
            title: 'Dos manos, dos códigos y el secreto de las uñas',
            image: './assets/img/guitar_hands_numbering.jpg',
            body: `• **Mano Izquierda (Diapasón)**: **1 (Índice)**, **2 (Medio)**, **3 (Anular)**, **4 (Meñique)**. El **pulgar** nunca pisa cuerdas adelante: es tu **ancla detrás del mástil**.\n• **Uñas mano izquierda**: **cortas y limadas** al ras para que la yema pise perpendicular sin tocar cuerdas vecinas.\n• **Mano Derecha (Pulsación)**: **p (Pulgar)**, **i (Índice)**, **m (Medio)**, **a (Anular)**, **ch/m (Meñique)**. Uñas redondeadas (1–2 mm) para ataque nítido.`,
            highlightBox: 'Si la uña del dedo izquierdo es larga, obliga a aplastar el dedo plano y apaga la cuerda de abajo.',
            demoNotes: [40, 55, 59, 64]
          },
          {
            type: 'quiz',
            theoryId: 'hands_nails',
            question: 'En los diagramas de acordes y tablaturas, ¿qué número corresponde al dedo ANULAR de la mano izquierda?',
            options: ['Dedo 1', 'Dedo 2', 'Dedo 3', 'Dedo 4'],
            correctIndex: 2,
            explanation: '¡Bien! 1 = Índice, 2 = Medio, 3 = Anular y 4 = Meñique (el pulgar izquierdo no lleva número porque va detrás del mástil).'
          },
          {
            type: 'quiz',
            theoryId: 'hands_nails',
            question: 'Según Keyner Ramírez y los conservatorios clásicos, ¿cómo deben mantenerse las uñas de la mano IZQUIERDA?',
            options: [
              'Largas (3–4 mm) para presionar el diapasón',
              'Bien cortas y limadas para pisar con la punta en martillo sin aplastar otras cuerdas',
              'Dejando largo solo el dedo 4 (meñique)',
              'Da exactamente igual el largo de ambas manos'
            ],
            correctIndex: 1,
            explanation: '¡Correcto! La mano izquierda necesita uñas cortas para pisar verticalmente; la mano derecha usa 1–2 mm redondeados si tocas arpegios sin púa.'
          },
          {
            type: 'quiz',
            theoryId: 'hands_nails',
            question: 'En arpegios de mano derecha ("p - i - m - a"), ¿cuál es la función principal del dedo Pulgar (p)?',
            options: [
              'Tocar únicamente la 1ª cuerda aguda',
              'Pulsar los bajos del acorde en las cuerdas gruesas 6ª, 5ª y 4ª',
              'Sujetar el borde de la boca de la guitarra sin moverse',
              'Tapar la 3ª cuerda durante todo el canto'
            ],
            correctIndex: 1,
            explanation: '¡Perfecto! El pulgar gobierna los bordones graves (cuerdas 6ª, 5ª y 4ª) mientras i-m-a atienden las primas 3ª-2ª-1ª.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'hands_nails',
            question: 'Ubica dónde se apoya el Dedo 1 al tocar Do (C) en la 2ª cuerda traste 1:',
            targetString: 2,
            targetFret: 1,
            hint: '2ª cuerda desde abajo, primer espacio detrás de la cejuela.'
          }
        ]
      },
      {
        id: 'u1_l3',
        title: 'Las 6 Cuerdas al Aire y Semitonos Naturales',
        icon: '🌈',
        xp: 30,
        summary: 'Memoriza los nombres, colores cromáticos y la ley física de los trastes (Mi-Fa / Si-Do).',
        steps: [
          {
            type: 'theory',
            theoryId: 'open_strings_colors',
            badge: 'Cuerdas & Frecuencias · Cromático',
            title: 'De abajo arriba (1ª a 6ª) y el mapa de semitonos',
            body: `• **1ª (abajo, aguda)**: **Mi (E4 · 329.6 Hz)** 🟨\n• **2ª**: **Si (B3 · 246.9 Hz)** 🟪\n• **3ª**: **Sol (G3 · 196.0 Hz)** 🟩\n• **4ª**: **Re (D3 · 146.8 Hz)** 🟧\n• **5ª**: **La (A2 · 110.0 Hz)** 🟦\n• **6ª (arriba, grave)**: **Mi (E2 · 82.4 Hz)** 🟨\n**Ley de los Semitonos**: Cada traste suma **1 semitono**. Entre **Mi→Fa** y **Si→Do** hay **1 solo traste**; entre todas las demás notas naturales hay **2 trastes (1 tono)**.`,
            highlightBox: 'Por eso en la 1ª cuerda (Mi al aire), ¡Fa está en el traste 1 y Sol en el traste 3!',
            demoNotes: [64, 59, 55, 50, 45, 40]
          },
          {
            type: 'quiz',
            theoryId: 'open_strings_colors',
            question: 'Si la 2ª cuerda al aire es SI (B), ¿en qué traste de esa misma 2ª cuerda encuentras la nota DO (C)?',
            options: [
              'Traste 1 (por la ley de semitono natural Si → Do)',
              'Traste 2',
              'Traste 3',
              'Traste 5'
            ],
            correctIndex: 0,
            explanation: '¡Brillante! De Si a Do solo hay medio tono (1 traste). De Do a Re avanzas 2 trastes hasta el traste 3.'
          },
          {
            type: 'quiz',
            theoryId: 'open_strings_colors',
            question: '¿Cuál de estas parejas de cuerdas al aire tiene exactamente dos octavas de diferencia (misma nota grave y aguda)?',
            options: [
              '5ª cuerda y 2ª cuerda',
              '6ª cuerda (E2) y 1ª cuerda (E4)',
              '4ª cuerda y 1ª cuerda',
              '3ª cuerda y 6ª cuerda'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! Ambas son Mi (E): la 6ª da el Mi más grave y la 1ª el Mi dos octavas arriba.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'open_strings_colors',
            question: 'Encuentra la nota FA natural en la 1ª cuerda (Mi agudo al aire + 1 semitono):',
            targetString: 1,
            targetFret: 1,
            hint: '1ª cuerda abajo, un solo espacio después de aire.'
          },
          {
            type: 'play_guitar_note',
            theoryId: 'open_strings_colors',
            title: 'Afinación en Vivo: Toca la 5ª cuerda al aire (La · A2)',
            instruction: 'Enciende el micrófono/línea arriba o valida con la referencia virtual pulsando la 5ª cuerda libre.',
            targetMidi: 45,
            targetLabel: 'A2 (La · 5ª cuerda al aire)'
          }
        ]
      },
      {
        id: 'u1_l4',
        title: 'Cifrado Americano, Español y Clave Keyner (+ / - / 5ª)',
        icon: '🔤',
        xp: 30,
        summary: 'Traduce instantáneamente entre A-G, Do-Re-Mi y la notación clásica de Keyner Ramírez.',
        steps: [
          {
            type: 'theory',
            theoryId: 'notation_dual',
            badge: 'Lectura Universal · Cifrado Triple',
            title: 'Un mismo acorde escrito en 3 idiomas musicales',
            body: `En nuestra app y en libros físicos verás 3 sistemas equivalentes:\n• **Americano**: **C = Do**, **D = Re**, **E = Mi**, **F = Fa**, **G = Sol**, **A = La**, **B = Si**. Letra + \`m\` = menor (\`Am\`), \`7\` = dominante (\`G7\`).\n• **Español**: \`Do, Rem, Sol7\`.\n• **Clave Keyner Ramírez**: \`DO+\` = Do Mayor, \`LA-\` = La Menor, y **5ª DE...** señala el dominante con 7ª de esa tonalidad (**5ª DO = G7**, **5ª LA = E7**, **5ª RE = A7**, **5ª MI = B7**).`,
            highlightBox: '¡No te confundas con "5ª LA"! No es La5, es el acorde dominante de La Mayor/Menor: ¡Mi Séptima (E7)!',
            demoChord: 'E7'
          },
          {
            type: 'quiz',
            theoryId: 'notation_dual',
            question: 'Si en el cancionero de una parroquia lees la secuencia "G - Em - C - D7", ¿cómo la traduce el sistema latino?',
            options: [
              'Sol Mayor - Mi menor - Do Mayor - Re7',
              'Sol menor - Mi Mayor - Do7 - Re menor',
              'Fa Mayor - Mi menor - Si Mayor - Re7',
              'La Mayor - Re menor - Do Mayor - Mi7'
            ],
            correctIndex: 0,
            explanation: '¡Excelente! G = Sol Mayor, Em = Mi menor, C = Do Mayor y D7 = Re dominante con séptima.'
          },
          {
            type: 'quiz',
            theoryId: 'notation_dual',
            question: 'En "Haga Música con la Guitarra" de Keyner Ramírez, la canción "El Año Viejo" usa "LA-" y "5ª DE LA". ¿Qué acordes son en cifrado americano?',
            options: [
              'La Mayor (A) y La7 (A7)',
              'La Menor (Am) y Mi Séptima (E7)',
              'La Menor (Am) y La5 (A5)',
              'Re Menor (Dm) y Sol7 (G7)'
            ],
            correctIndex: 1,
            explanation: '¡Dominado! LA- es La menor (Am) y su 5ª Dominante (La-Si-Do-Re-Mi) es Mi Séptima (E7).'
          },
          {
            type: 'quiz',
            theoryId: 'notation_dual',
            question: '¿Cómo escribe Keyner Ramírez el acorde DOMINANTE de Sol Mayor (Re Séptima / D7)?',
            options: ['RE+', '5ª SOL', 'SOL-', '5ª RE'],
            correctIndex: 1,
            explanation: '¡Exacto! D7 cumple función de 5ª de Sol, por eso en el libro figura como "5ª SOL".'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'notation_dual',
            title: 'Práctica: La Menor (Am / LA-)',
            instruction: 'Arma Am (0-0-2-2-1-0 en cifras estándar) y hazlo sonar limpio.',
            chord: 'Am'
          }
        ]
      }
    ]
  },

  // ============================================================================
  // UNIDAD 2: MÉTODO NUMÉRICO KEYNER RAMÍREZ (10–60) Y TABLATURA (4 LECCIONES)
  // ============================================================================
  {
    id: 'unit_2',
    number: 2,
    title: 'Método Numérico Keyner (10–60) y Tablaturas',
    subtitle: 'Lee melodías al instante con dígitos de Cuerda+Espacio y tablaturas interactivas',
    color: '#A55EEA',
    borderColor: '#7C3AED',
    icon: '🔢',
    sourceBook: 'Haga Música con la Guitarra — Keyner Ramírez',
    lessons: [
      {
        id: 'u2_l1',
        title: 'La Matriz Numérica 10–60 (Cuerda + Espacio)',
        icon: '🧭',
        xp: 30,
        summary: 'Descifra el código de dos dígitos del libro de Keyner Ramírez sin dudar.',
        steps: [
          {
            type: 'theory',
            theoryId: 'keyner_numeric_grid',
            badge: 'Método Keyner · Pág. 6–7',
            title: 'La regla simple: Primer dígito = Cuerda, Resto = Espacio',
            image: './assets/img/keyner_numeric_fretboard.jpg',
            body: `En el método de **Keyner Ramírez Mojica**, cualquier nota del mástil tiene una coordenada numérica exacta:\n• **Primer dígito (1 a 6)**: indica la **cuerda**.\n• **Segundo dígito (o últimos dos, de 0 a 22)**: indica el **espacio/traste**.\nPor ejemplo:\n• **10, 20, 30, 40, 50, 60**: todas terminan en \`0\` → son las cuerdas 1ª a 6ª **al aire**.\n• **43**: **4ª cuerda en el espacio 3** (nota Fa).\n• **112**: **1ª cuerda en el espacio 12** (no es "cuerda 11" porque solo existen 6 cuerdas!).`,
            highlightBox: '¡Truco infalible! Siempre lee primero el PRIMER dígito del 1 al 6; todo lo que queda a la derecha es el número de traste.',
            demoNotes: [53, 55, 57, 59, 60]
          },
          {
            type: 'quiz',
            theoryId: 'keyner_numeric_grid',
            question: 'En el código numérico de Keyner Ramírez, ¿qué significa el número "32"?',
            options: [
              '2ª cuerda en el espacio 3',
              '3ª cuerda (Sol) en el espacio/traste 2 (nota La)',
              'Tocar 3 veces el espacio 2 en cualquier cuerda',
              'Traste 32 de una guitarra especial'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! Primer dígito = 3 (3ª cuerda); segundo dígito = 2 (espacio/traste 2).'
          },
          {
            type: 'quiz',
            theoryId: 'keyner_numeric_grid',
            question: 'En "Pueblito Viejo" aparece el código "115" (115-114...). ¿Dónde pisas exactamente cuando hay 3 cifras empezando por 1?',
            options: [
              '11ª cuerda traste 5',
              '1ª cuerda (Mi agudo) en el espacio/traste 15',
              'Cuerdas 1 y 5 simultáneas al aire',
              '5ª cuerda espacio 11'
            ],
            correctIndex: 1,
            explanation: '¡Brillante! Como solo hay 6 cuerdas (1 a 6), un código de 3 cifras como 115 siempre se parte en: Cuerda 1 + Traste 15.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'keyner_numeric_grid',
            question: 'Haz clic en la posición correspondiente al código Keyner "43" (4ª cuerda, traste 3):',
            targetString: 4,
            targetFret: 3,
            hint: 'Cuenta hasta la 4ª cuerda (Re) y pulsa el espacio 3 (nota Fa).'
          },
          {
            type: 'fretboard_find',
            theoryId: 'keyner_numeric_grid',
            question: 'Ahora ubica el código Keyner "21" (2ª cuerda, traste 1 — nota Do central):',
            targetString: 2,
            targetFret: 1,
            hint: '2ª cuerda desde abajo, espacio 1.'
          }
        ]
      },
      {
        id: 'u2_l2',
        title: 'Semi-Acordes (21/32), Asterisco (*) y Escala de Do',
        icon: '🎼',
        xp: 35,
        summary: 'Lee dobles cuerdas armónicas, bajeos de enlace y la escala de 2 octavas de la pág. 7.',
        steps: [
          {
            type: 'theory',
            theoryId: 'keyner_semichords_scale',
            badge: 'Simbología Completa · Keyner p.7–9',
            title: 'Doble cuerda, el asterisco (*) y los dedos por traste',
            image: './assets/img/keyner_numeric_fretboard.jpg',
            body: `Además de notas sueltas, el método Keyner utiliza tres recursos súper prácticos:\n• **Semi-acordes con barra (\`21/32\`, \`10/21\`)**: se pisan y pulsan **ambas notas al mismo tiempo** para hacer duetos dulces de terceras.\n• **Asterisco (\`*\`)**: indica un **bajo de paso** (\`53*-52*-50*-63*\`) que camina con el pulgar entre dos acordes.\n• **Regla de dedos**: en primera posición, el segundo dígito sugiere tu dedo: espacio \`1\` → **Dedo 1**, espacio \`2\` → **Dedo 2**, \`3\` → **Dedo 3**, \`4\` → **Dedo 4**.`,
            highlightBox: 'Escala de Do Mayor de Keyner (p.7): 53-40-42-43-30-32-20-21-23-10-11-13-15-17-18.',
            actionTarget: { tab: 'tabs', itemId: 'tab_keyner_escala_do', label: 'Tocar Escala Do de Keyner en TAB' }
          },
          {
            type: 'quiz',
            theoryId: 'keyner_semichords_scale',
            question: 'Si ves escrito en una canción de pasillo "21/32" separado por una diagonal "/", ¿qué debes hacer?',
            options: [
              'Elegir solo uno de los dos números al azar',
              'Pulsar simultáneamente la 2ª cuerda en traste 1 (Do) y la 3ª cuerda en traste 2 (La)',
              'Tocar 21 veces el traste 32',
              'Poner el capotraste en el traste 2'
            ],
            correctIndex: 1,
            explanation: '¡Muy bien! La barra "/" agrupa notas de un semi-acorde o intervalo simultáneo, típico en pasillos y requintos.'
          },
          {
            type: 'quiz',
            theoryId: 'keyner_semichords_scale',
            question: 'En primera posición bajo el método de Keyner, si aparece el código "43" seguido de "42", ¿qué dedos debes asignar respectivamente?',
            options: [
              'Dedo 4 para ambos',
              'Dedo 3 en el 43 (espacio 3) y Dedo 2 en el 42 (espacio 2)',
              'Solo el pulgar izquierdo',
              'Dedo 1 en el 43 y Dedo 4 en el 42'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! Un dedo por espacio (1-2-3-4) ahorra movimientos innecesarios y mejora la afinación de cada nota.'
          },
          {
            type: 'quiz',
            theoryId: 'keyner_semichords_scale',
            question: '¿Qué indica un asterisco (*) junto a un código de cuerda grave como "53*" o "52*"?',
            options: [
              'Que la cuerda está desafinada',
              'Un bajo melódico de enlace o bordoneo ejecutado con el pulgar',
              'Que la canción terminó completamente',
              'Silencio absoluto de 4 compases'
            ],
            correctIndex: 1,
            explanation: '¡Correcto! Es un bajo de paso característico que une acordes sin interrumpir el canto.'
          },
          {
            type: 'play_guitar_note',
            theoryId: 'keyner_semichords_scale',
            title: 'Práctica: Toca la nota "53" (Do Central grave · Inicio de la Escala Keyner)',
            instruction: 'Pisa con el Dedo 3 la 5ª cuerda en el espacio 3 (53 = Do3) y hazla sonar clara.',
            targetMidi: 48,
            targetLabel: 'C3 (Do · Cód. Keyner 53)'
          }
        ]
      },
      {
        id: 'u2_l3',
        title: 'Tablatura Moderna vs. Keyner y Expresión (h / p / slide)',
        icon: '🎯',
        xp: 35,
        summary: 'Conecta las 6 líneas horizontales de cualquier tablatura de internet con los números Keyner.',
        steps: [
          {
            type: 'theory',
            theoryId: 'tab_reading_techniques',
            badge: 'TAB + Expresión · Ligados y Slides',
            title: 'Cómo leer cualquier tablatura y darle sabor de acordeón/voz',
            body: `• **Tablatura (6 líneas)**: arriba está la **1ª cuerda (Mi agudo)** y abajo la **6ª (Mi grave)**.\n• **Equivalencia total**: un \`3\` dibujado sobre la 2ª línea equivale exactamente al código Keyner **23**.\n• **Técnicas de fraseo**:\n  - **h (Hammer-on)**: tocas una nota y martillas el traste superior sin volver a pulsar derecha.\n  - **p (Pull-off)**: pellizcas hacia abajo soltando hacia una nota más grave.\n  - **/ (Slide)**: deslizas el dedo por la cuerda sin levantar la presión.`,
            highlightBox: 'Prueba cambiar el selector "Mostrar → Método Keyner (10-60) / Traste+Nota" dentro de la pestaña Tablaturas.',
            demoNotes: [64, 65, 67]
          },
          {
            type: 'quiz',
            theoryId: 'tab_reading_techniques',
            question: 'En una tablatura horizontal estándar, ¿qué cuerda representa la LÍNEA SUPERIOR (más arriba en la pantalla)?',
            options: [
              'La 6ª cuerda (Mi grave, la más gruesa)',
              'La 1ª cuerda (Mi agudo, la más delgada)',
              'La 3ª cuerda (Sol)',
              'Depende de si es música católica o vallenata'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! La 1ª cuerda está arriba en la tablatura porque simula cómo miras el mástil desde arriba mientras tocas.'
          },
          {
            type: 'quiz',
            theoryId: 'tab_reading_techniques',
            question: 'Si en un punteo vallenato ves "15h17" o "21/23", ¿qué técnicas indican "h" y "/"?',
            options: [
              'Hammer-on (ligado martillado sin volver a pulsar) y Slide (arrastre deslizante)',
              'Hacer silencio y parar',
              'Rasgueo fuerte y apagado de palma',
              'Afinar medio tono abajo y arriba'
            ],
            correctIndex: 0,
            explanation: '¡Brillante! Ligados (h/p) y arrastres (/) imitan el glissando y las apoyaturas del acordeón vallenato y el requinto.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'tab_reading_techniques',
            question: 'Convierte la nota escrita en TAB como "3ª cuerda · Traste 2" (código Keyner 32 = La) haciéndole clic:',
            targetString: 3,
            targetFret: 2,
            hint: '3ª cuerda desde abajo, traste 2 (Espacio 2).'
          },
          {
            type: 'play_guitar_note',
            theoryId: 'tab_reading_techniques',
            title: 'Verifica la 4ª cuerda al aire (40 en Keyner = Re3)',
            instruction: 'Toca la 4ª cuerda libre con tu pulgar o dedo índice sin pisar ningún traste.',
            targetMidi: 50,
            targetLabel: 'D3 (Re · Cód. 40)'
          }
        ]
      },
      {
        id: 'u2_l4',
        title: 'Primeras Intros Reales: "Pueblito Viejo" y "El Año Viejo"',
        icon: '🎶',
        xp: 40,
        summary: 'Aplica los códigos 10–60 tocando dos introducciones colombianas auténticas del libro.',
        steps: [
          {
            type: 'theory',
            theoryId: 'keyner_numeric_grid',
            badge: 'Repertorio Libro Keyner · p.23 y p.40',
            title: 'Descifrando introducciones clásicas nota por nota',
            body: `En el libro físico de **Keyner Ramírez**, las introducciones comienzan con frases limpias en primera posición:\n• **"Pueblito Viejo" (p.23, en Am)**: arranca con **\`32 - 21 - 20 - 32 - 30 - 43\`** (La-Do-Si-La-Sol-Fa).\n• **"El Año Viejo" (p.40, en Am)**: construye la melodía arpegiando el propio acorde de La menor: **\`50 - 42 - 32 - 21 - 20 - 32 - 21 - 20 - 23\`**.`,
            highlightBox: 'Observa que en "El Año Viejo", 42-32-21 son exactamente los dedos que forman Am (La Menor).',
            actionTarget: { tab: 'tabs', itemId: 'tab_keyner_el_ano_viejo', label: 'Abrir Intro El Año Viejo en TAB' }
          },
          {
            type: 'quiz',
            theoryId: 'keyner_numeric_grid',
            question: 'Al iniciar la intro de "Pueblito Viejo" (`32 - 21 - 20 - 32`), ¿qué notas musicales estás tocando exactamente?',
            options: [
              'Sol - Mi - Re - Sol',
              'La - Do - Si - La',
              'Do - Mi - Fa - Sol',
              'Re - La - Si - Do'
            ],
            correctIndex: 1,
            explanation: '¡Oído fino! 32 (3ª tr.2) = La, 21 (2ª tr.1) = Do, 20 (2ª aire) = Si, 32 = La.'
          },
          {
            type: 'quiz',
            theoryId: 'keyner_semichords_scale',
            question: 'En "El Año Viejo" (`50 - 42 - 32 - 21`), ¿qué figura de acorde de mano izquierda ya forma automáticamente las notas 42, 32 y 21?',
            options: [
              'Sol Mayor (G)',
              'La Menor (Am)',
              'Do Mayor (C)',
              'Re Mayor (D)'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! Si dejas armado La Menor (Am), ya tienes pisadas 42 (dedo 2), 32 (dedo 3) y 21 (dedo 1), junto al bajo 50 al aire.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'keyner_numeric_grid',
            question: 'Ubica la nota final de esa frase en "Pueblito Viejo": código "43" (Fa grave en 4ª cuerda):',
            targetString: 4,
            targetFret: 3,
            hint: '4ª cuerda, traste 3.'
          },
          {
            type: 'play_guitar_note',
            theoryId: 'open_strings_colors',
            title: 'Toca la nota "32" (La3 · inicio de Pueblito Viejo)',
            instruction: 'Pisa 3ª cuerda espacio 2 (Dedo 2) y hazla sonar con micrófono/línea o validación virtual.',
            targetMidi: 57,
            targetLabel: 'A3 (La · Cód. Keyner 32)'
          }
        ]
      }
    ]
  },

  // ============================================================================
  // UNIDAD 3: ACORDES ABIERTOS Y CÍRCULOS DE ALABANZA (4 LECCIONES)
  // ============================================================================
  {
    id: 'unit_3',
    number: 3,
    title: 'Acordes Base y Círculos de Alabanza',
    subtitle: 'Tríadas menores, mayores con dedo pivote, círculo armónico y tus primeras misas',
    color: '#1CB0F6',
    borderColor: '#148AC2',
    icon: '🙌',
    sourceBook: 'Cancionero Digital (Bono 1) & Fran Cordón',
    lessons: [
      {
        id: 'u3_l1',
        title: 'Tríadas Menores (Em, Am, Dm) y Arco Limpio',
        icon: '🌙',
        xp: 30,
        summary: 'Domina los 3 acordes menores abiertos sin que trasteen ni apaguen las primas.',
        steps: [
          {
            type: 'theory',
            theoryId: 'minor_open_chords',
            badge: 'Acordes Menores · Recogimiento & Cumbia',
            title: 'Tres amigos menores en primera posición',
            body: `Los acordes menores llevan **1ª, 3ª menor y 5ª justa**, dándoles color íntimo y expresivo:\n• **Em (\`022000\`)**: el acorde más sencillo; suenan las 6 cuerdas.\n• **Am (\`x02210\`)**: baja los dedos 2 y 3 una cuerda y añade el dedo 1 en \`21\`. Toca desde la **5ª cuerda**.\n• **Dm (\`xx0231\`)**: triángulo en las 3 primeras cuerdas; toca desde la **4ª cuerda al aire**.`,
            highlightBox: 'Si la 1ª cuerda suena apagada en Am o Dm, sube un milímetro el arco de tus nudillos y pega las uñas bien cortas.',
            demoChord: 'Dm'
          },
          {
            type: 'quiz',
            theoryId: 'minor_open_chords',
            question: 'Al pasar de Mi menor (Em) a La menor (Am), ¿cuál es la relación visual de las 4ª y 3ª cuerdas frente a 5ª y 4ª?',
            options: [
              'No tienen ningún parecido',
              'Bajas el bloque exactamente una cuerda hacia el piso y agregas el dedo 1 en 2ª cuerda traste 1 (21)',
              'Se invierten hacia el traste 7',
              'Solo cambia el bajo de la 6ª a la 1ª cuerda'
            ],
            correctIndex: 1,
            explanation: '¡Correcto! Esta simetría visual te permite cambiar entre E/Em y A/Am de forma casi automática.'
          },
          {
            type: 'quiz',
            theoryId: 'minor_open_chords',
            question: 'Desde qué cuerda debes rasguear para que el acorde de Re menor (Dm) tenga su bajo fundamental limpio:',
            options: [
              'Desde la 6ª cuerda (Mi) con toda fuerza',
              'Desde la 4ª cuerda al aire (Re), evitando golpear la 6ª',
              'Únicamente la 1ª y 2ª cuerda',
              'Desde el traste 5'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! El bajo primario de Dm y D es la 4ª cuerda (Re). Tocar la 6ª cuerda (Mi) ensuciaría la base del acorde.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'minor_open_chords',
            title: 'Toca Re Menor (Dm / RE-) limpio',
            instruction: 'Dedo 1 en 11, Dedo 2 en 32 y Dedo 3 en 23. Rasguea desde la 4ª cuerda.',
            chord: 'Dm'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'minor_open_chords',
            title: 'Toca La Menor (Am / LA-) limpio',
            instruction: 'Cambia de Dm a Am con suavidad y deja sonar desde la 5ª cuerda.',
            chord: 'Am'
          }
        ]
      },
      {
        id: 'u3_l2',
        title: 'Acordes Mayores (G, D, C, A, E) y Dedo Pivote',
        icon: '☀️',
        xp: 35,
        summary: 'El truco biomecánico del dedo ancla para cambiar de acorde a gran velocidad.',
        steps: [
          {
            type: 'theory',
            theoryId: 'major_open_chords',
            badge: 'Velocidad de Cambio · Dedo Pivote',
            title: 'Nunca levantes TODOS los dedos si un dedo puede servir de puente',
            body: `En la guitarra inteligente ahorramos 50% de movimiento usando **dedos pivote** y **dedos en común**:\n• **G (versión 4 dedos) ↔ D**: deja el **Dedo 3 fijo en \`23\` (2ª cuerda traste 3)** como eje giratorio.\n• **C ↔ Am**: deja quietos **Dedo 1 (\`21\`) y Dedo 2 (\`42\`)** y mueve solo el Dedo 3 entre \`53\` (Do) y \`32\` (Am).\n• **A ↔ E**: desliza ligeramente y abre 1 cuerda hacia arriba.`,
            highlightBox: 'Practica 10 cambios seguidos C ↔ Am manteniendo los dedos 1 y 2 pegados como imanes.',
            demoChord: 'C'
          },
          {
            type: 'quiz',
            theoryId: 'major_open_chords',
            question: '¿Qué dos dedos permanecen prácticamente inmóviles en el mástil al cambiar de DO MAYOR (C) a LA MENOR (Am)?',
            options: [
              'Ninguno, hay que levantar toda la mano',
              'El Dedo 1 (2ª tr.1) y el Dedo 2 (4ª tr.2): solo mueves el Dedo 3',
              'Solo el dedo 4 meñique',
              'Los dedos 3 y 4 en la 1ª cuerda'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! Como C (Do-Mi-Sol) y Am (La-Do-Mi) comparten 2 notas idénticas, ¡tus dedos 1 y 2 no tienen por qué despegarse!'
          },
          {
            type: 'quiz',
            theoryId: 'major_open_chords',
            question: 'Al cambiar entre SOL MAYOR (4 dedos) y RE MAYOR, ¿qué dedo sirve como pivote anclado en la 2ª cuerda traste 3 (cód. 23)?',
            options: ['Dedo 1 (Índice)', 'Dedo 2 (Medio)', 'Dedo 3 (Anular)', 'Pulgar'],
            correctIndex: 2,
            explanation: '¡Brillante! Dejar anclado el Dedo 3 en el traste 3 de la 2ª cuerda (nota Re) estabiliza el salto G ↔ D al instante.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'major_open_chords',
            title: 'Toca Sol Mayor (G / SOL+) con brillo',
            instruction: '6ª tr.3 (Dedo 2), 5ª tr.2 (Dedo 1) y 1ª tr.3 (Dedo 3 o 4). ¡El acorde #1 de la misa!',
            chord: 'G'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'major_open_chords',
            title: 'Ahora pivotea a Re Mayor (D / RE+)',
            instruction: 'Forma el triángulo en las 3 primas dejando el Dedo 3 anclado en 2ª tr.3.',
            chord: 'D'
          }
        ]
      },
      {
        id: 'u3_l3',
        title: 'El Círculo Armónico (I – VIm – IIm – V7)',
        icon: '🔄',
        xp: 35,
        summary: 'Aprende la progresión circular más famosa de la música sacra, bolero y balada.',
        steps: [
          {
            type: 'theory',
            theoryId: 'harmonic_circle_basic',
            badge: 'Armonía Funcional · Grados I - VIm - IIm - V7',
            title: 'Cuatro funciones que cuentan una historia musical completa',
            body: `Miles de alabanzas y serenatas siguen exactamente esta secuencia cíclica de 4 acordes:\n• **En Do Mayor**: **\`C (I)\` → \`Am (VIm)\` → \`Dm (IIm)\` → \`G7 (V7)\`**\n• **En Sol Mayor**: **\`G (I)\` → \`Em (VIm)\` → \`Am (IIm)\` → \`D7 (V7)\`**\n• **En Re Mayor**: **\`D (I)\` → \`Bm (VIm)\` → \`Em (IIm)\` → \`A7 (V7)\`**\nCada paso prepara la tensión del **V7**, que cae resuelta en el **I**.`,
            highlightBox: 'Entrena el Círculo de Do y el de Sol antes de dormir: automatizarás los cambios más comunes de toda la guitarra.',
            demoChord: 'G7'
          },
          {
            type: 'quiz',
            theoryId: 'harmonic_circle_basic',
            question: 'En el Círculo Armónico clásico de SOL MAYOR (I - VIm - IIm - V7), ¿qué 4 acordes corresponden exactamente?',
            options: [
              'G - C - D - G',
              'G - Em - Am - D7',
              'G - Am - Bm - C',
              'C - Am - Dm - G7'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! Sol (I), Mi menor (VIm relativo), La menor (IIm) y Re Séptima (V7).'
          },
          {
            type: 'quiz',
            theoryId: 'harmonic_circle_basic',
            question: 'En el círculo de Do (`C - Am - Dm - G7`), ¿qué acorde aporta la mayor tensión ("suspenso") pidiendo volver a descansar en Do?',
            options: ['Am', 'Dm', 'G7 (el V grado Dominante)', 'C'],
            correctIndex: 2,
            explanation: '¡Correcto! La presencia del intervalo tritono dentro de G7 (Si + Fa) exige resolver hacia Do Mayor (Do + Mi).'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'harmonic_circle_basic',
            title: 'Resolución Dominante: Toca Sol Séptima (G7 / 5ª DO)',
            instruction: '3-2-0-0-0-1. Siente el brillo de la nota Fa en 1ª traste 1 pidiendo ir a Do.',
            chord: 'G7'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'harmonic_circle_basic',
            title: 'Y resuelve a casa en Do Mayor (C / DO+)',
            instruction: 'Deja que la tensión de G7 descanse en Do Mayor desde la 5ª cuerda.',
            chord: 'C'
          }
        ]
      },
      {
        id: 'u3_l4',
        title: 'Repertorio Vivo: Dios Está Aquí, Alma Misionera y Alabaré',
        icon: '⛪',
        xp: 40,
        summary: 'Toca tus primeras alabanzas completas conectando progresiones reales del Cancionero.',
        steps: [
          {
            type: 'theory',
            theoryId: 'major_open_chords',
            badge: 'Cancionero Digital Católico · Alabanzas Clásicas',
            title: 'Tres progresiones inmortales de la Liturgia Católica',
            body: `• **"Alabaré a mi Señor" (en G)**: solo usa **G, Em, C y D7** (o aún más simple: **G - D7 - C - G**).\n• **"Alma Misionera" (en G)**: estrofa contemplativa **G → D → Em → C → D** y empuje al coro con **G7 → C**.\n• **"Dios Está Aquí" (en D)**: sigue **D → A → Bm (o Bm7) → D7 → G → A → D**.`,
            highlightBox: 'Abre "🎶 Canciones" y usa la Línea de Tiempo Viva de colores para anticipar cada cambio de acorde.',
            actionTarget: { tab: 'songs', itemId: 'ms_dios_esta_aqui', label: 'Abrir "Dios Está Aquí" en Canciones' }
          },
          {
            type: 'quiz',
            theoryId: 'harmonic_circle_basic',
            question: 'En "Alma Misionera" en tono de Sol (G), ¿qué acorde aparece justo antes del coro ("Señor, toma mi vida nueva") para llevar con fuerza hacia DO Mayor?',
            options: ['Em', 'G7 (Dominante Secundario V7/IV)', 'A7', 'Dm'],
            correctIndex: 1,
            explanation: '¡Excelente oído teórico! Al agregar el 7 a G (G7 = 5ª de Do), proyectas la armonía directo hacia Do Mayor.'
          },
          {
            type: 'quiz',
            theoryId: 'major_open_chords',
            question: '¿Qué grupo de 4 acordes permite acompañar sin cejilla alabanzas de entrada como "Alabaré" o "Vive Jesús"?',
            options: [
              'F#m - C#m - B - G#m',
              'G - Em - C - D7',
              'Bb - Eb - Ab - Db',
              'F - Bb - Cm - Eb7'
            ],
            correctIndex: 1,
            explanation: '¡Correcto! La familia de Sol Mayor sin cejilla (G - Em - C - D7) es amigable y luminosa para cantar en grupo.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'major_open_chords',
            title: 'Práctica Real: Toca La Mayor (A) del verso de Dios Está Aquí',
            instruction: 'Agrupa dedos 1-2-3 (o 2-1-3) en traste 2 de las cuerdas 4ª, 3ª y 2ª. Rasguea desde la 5ª.',
            chord: 'A'
          }
        ]
      }
    ]
  },

  // ============================================================================
  // UNIDAD 4: RASGUEOS LITÚRGICOS, CHASQUIDO Y ARPEGIOS (4 LECCIONES)
  // ============================================================================
  {
    id: 'unit_4',
    number: 4,
    title: 'Mano Derecha: Rasgueos, Chasquido y Arpegios',
    subtitle: 'El péndulo constante 4/4, chasquido percusivo (✕), vals 3/4, 6/8 y arpegios p-i-m-a',
    color: '#FF9600',
    borderColor: '#D67B00',
    icon: '🥁',
    sourceBook: 'Cancionero Digital (Bono 2) & Medina/Caliva',
    lessons: [
      {
        id: 'u4_l1',
        title: 'El Motor Constante 4/4 (Balada Básica y Fluida)',
        icon: '🌊',
        xp: 35,
        summary: 'Interioriza el vaivén sin frenos "VOY PIE-DRA TA-PIE-DRA" de todo canto contemporáneo.',
        steps: [
          {
            type: 'theory',
            theoryId: 'strumming_44_engine',
            badge: 'Mano Derecha · Balada Básica',
            title: 'El movimiento en "Aire" (·) es el secreto del ritmo perfecto',
            body: `Patrón de **Balada Básica (Pop Litúrgico)** en 8 corcheas de 4/4:\n\`1 (↓)  y (·) | 2 (↓)  y (↑) | 3 (·)  y (↑) | 4 (↓)  y (↑)\`\n• Aunque los tiempos marcados con \`·\` no tocan cuerdas, **tu muñeca sigue bajando o subiendo en el aire**.\n• En **Balada Fluida de Adoración**, sustituye el primer \`↓\` por **Bajo 1 (B1)** con el pulgar para dar profundidad.`,
            highlightBox: 'Prueba "🥁 Rasgueos → Balada Básica" a 60 BPM usando sílabas habladas antes de tocar rápido.',
            actionTarget: { tab: 'rhythms', itemId: 'pop_folk', label: 'Practicar Balada 4/4 en Laboratorio' }
          },
          {
            type: 'quiz',
            theoryId: 'strumming_44_engine',
            question: 'En la notación rítmica de CuerdaViva! `↓ · ↓ ↑ · ↑ ↓ ↑`, ¿qué debes hacer físicamente en los espacios marcados con un punto (·)?',
            options: [
              'Congelar por completo la mano derecha en el aire',
              'Seguir moviendo la mano sin rozar las cuerdas para mantener el péndulo del pulso intacto',
              'Pisar un traste con la mano derecha',
              'Soltar la guitarra un segundo'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! El péndulo continuo garantiza que todas las subidas (↑) caigan exactamente en los contratiempos.'
          },
          {
            type: 'quiz',
            theoryId: 'strumming_44_engine',
            question: 'En qué se diferencia principalmente la "Balada de Adoración Fluida" (`B1 · ↓ ↑ · ↑ ↓ ↑`) de la Balada Básica:',
            options: [
              'Se toca mucho más lento con cejilla',
              'Sustituye la primera bajada completa por el pulgar en el Bajo Primario (B1), dando calidez al inicio del compás',
              'Elimina por completo las cuerdas agudas',
              'Solo usa la mano izquierda'
            ],
            correctIndex: 1,
            explanation: '¡Muy bien! Empezar el compás con el peso limpio del bajo crea respiro antes de rasguear las primas.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'strumming_44_engine',
            title: 'Aplica el Péndulo 4/4 sobre Sol Mayor (G)',
            instruction: 'Marca el compás completo ↓ · ↓ ↑ · ↑ ↓ ↑ lentamente manteniendo el pulso uniforme.',
            chord: 'G'
          }
        ]
      },
      {
        id: 'u4_l2',
        title: 'El Chasquido Percusivo (✕) y Marchas de Alabanza',
        icon: '💥',
        xp: 35,
        summary: 'Imita la caja o redoblante en cantos alegres de júbilo y entrada litúrgica.',
        steps: [
          {
            type: 'theory',
            theoryId: 'slap_percussion_24',
            badge: 'Percusión Acústica · Coritos & Entrada',
            title: 'Cómo sonar como guitarra + percusión al mismo tiempo',
            body: `En cantos alegres ("A edificar la iglesia", "El Dios de la Vida"), la mano derecha integra golpes apagados (**✕**):\n• **Técnica del Chasquido**: haz coincidir el borde lateral externo de la palma con las uñas rozando las cuerdas para cortar la vibración de golpe.\n• **Alabanza con Apagado (4/4)**: \`↓ · ✕ ↑ · ↑ ✕ ↑\` (el golpe seco cae en pulsos **2 y 4**).\n• **Corito / Marcha (2/4)**: \`B1 ↑ ✕ ↑ | B2 ↑ ↓ ↑\`.`,
            highlightBox: 'Si el chasquido te cuesta, empieza practicando solo golpear suavemente las cuerdas con los nudillos cerrados en los tiempos 2 y 4.',
            demoChord: 'E'
          },
          {
            type: 'quiz',
            theoryId: 'slap_percussion_24',
            question: 'En el rasgueo de Alabanza Alegre 4/4 (`↓ · ✕ ↑ · ↑ ✕ ↑`), ¿sobre qué tiempos del compás cae el chasquido percusivo (✕)?',
            options: [
              'En los tiempos 1 y 3 (los mismos que el bajo)',
              'En los tiempos 2 y 4 (donde tradicionalmente pega la caja o redoblante)',
              'Únicamente en el último contratiempo',
              'Nunca lleva chasquido la alabanza festiva'
            ],
            correctIndex: 1,
            explanation: '¡Brillante! Acentuar 2 y 4 con chasquido le da un groove irresistible y alegre a toda la asamblea.'
          },
          {
            type: 'quiz',
            theoryId: 'slap_percussion_24',
            question: '¿Qué movimiento físico produce un chasquido (✕) limpio sin lastimar el puente?',
            options: [
              'Golpear la madera de la tapa con fuerza usando el codo',
              'Dejar caer el borde blando lateral de la palma sobre las cuerdas justo cuando las uñas rozan hacia abajo',
              'Soltar la púa dentro de la boca de la guitarra',
              'Pisar los trastes con el pulgar'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! El apagado combina el roce breve de las uñas con la amortiguación inmediata de la palma.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'slap_percussion_24',
            title: 'Práctica de Júbilo: Mi Mayor (E) en Corito de Alabanza',
            instruction: 'Prepara E (022100) y alterna B1 (6ª) con chasquido percusivo alegre.',
            chord: 'E'
          }
        ]
      },
      {
        id: 'u4_l3',
        title: 'Métricas Ternarias: Vals 3/4, 6/8 y Bolero',
        icon: '🕊️',
        xp: 40,
        summary: 'Domina el balanceo solemne de Comunión en 6/8, el Vals mariano y el Bolero.',
        steps: [
          {
            type: 'theory',
            theoryId: 'meters_34_68_bolero',
            badge: 'Métricas Ternarias & Serenata',
            title: 'No confundas jamás 3/4 con 6/8',
            body: `Aunque ambos dividen en grupos de 3, su acento rítmico es completamente distinto:\n• **Vals (3/4)**: tiene **3 pulsos** iguales (**UN**-dos-tres: **B1 · ↓ ↑ ↓ ·**). Clásico en "Eran Cien Ovejas" y música andina.\n• **Seis por Ocho (6/8)**: tiene **2 pulsos ternarios** (**UN**-dos-tres **CUÁ**-tro-cinco-seis: **B1 ↓ ↑ ↓ ↓ ↑**). Es el mecido de "Pescador de Hombres" y el Merengue.\n• **Bolero Clásico (4/4)**: **B1 · ↓ ↑ ✕ ↑ B2 ↓** con rubato elegante.`,
            highlightBox: 'Escucha y compara "Vals 3/4" vs "Adoración 6/8" en nuestro Laboratorio de Rasgueos para entrenar el oído.',
            actionTarget: { tab: 'rhythms', itemId: 'seis_ocho', label: 'Comparar 6/8 en Rasgueos' }
          },
          {
            type: 'quiz',
            theoryId: 'meters_34_68_bolero',
            question: '¿Cuántos acentos principales grandes sientes dentro de un compás de Adoración en 6/8 ("Pescador de Hombres")?',
            options: [
              'Cuatro pulsos secos',
              'Dos grandes pulsos balanceados (en las corcheas 1 y 4), cada uno subdividido en 3 ("1-2-3, 4-5-6")',
              'Tres pulsos secos tipo marcha',
              'Uno solo cada diez segundos'
            ],
            correctIndex: 1,
            explanation: '¡Perfecto! El 6/8 es un compás binario de subdivisión ternaria: su vaivén mecido acentúa los tiempos 1 y 4.'
          },
          {
            type: 'quiz',
            theoryId: 'meters_34_68_bolero',
            question: 'En el Vals Litúrgico y Popular en 3/4, ¿qué ocurre exactamente en el Tiempo 1?',
            options: [
              'Se hace un apagado mudo sin sonido',
              'El pulgar marca un Bajo profundo (B1 o B2), y los tiempos 2 y 3 responden con rasgueos suaves en primas',
              'Se suben todas las cuerdas de la 1ª a la 6ª rápido',
              'Solo entra la guitarra en el tiempo 3'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! El típico "BUM - chas - chas" del vals nace de separar el Bajo (tiempo 1) de los acompañamientos en 2 y 3.'
          },
          {
            type: 'quiz',
            theoryId: 'meters_34_68_bolero',
            question: '¿Qué combinación integra el Bolero Clásico de Serenata (`B1 · ↓ ↑ ✕ ↑ B2 ↓`)?',
            options: [
              'Únicamente cuerdas al aire en 3/4',
              'Bajo en 1, chasquido en 3 y regreso ligado hacia el Bajo Alterno B2 en el tiempo 4',
              'Tres chasquidos seguidos al empezar',
              'Velocidad extrema arriba de 180 BPM'
            ],
            correctIndex: 1,
            explanation: '¡Excelente! Esa caída sobre el Bajo Secundario en el 4º tiempo le da al bolero su balanceo cadencioso tan reconocible.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'meters_34_68_bolero',
            title: 'Práctica en 3/4: Re Séptima (D7) para Vals / Pasillo',
            instruction: 'Pulsa B1 en 4ª cuerda al aire y responde con dos toques suaves en las primas.',
            chord: 'D7'
          }
        ]
      },
      {
        id: 'u4_l4',
        title: 'Arpegios Clásicos de Carulli (p-i-m-a-m-i)',
        icon: '🕯️',
        xp: 40,
        summary: 'Aprende el estudio clásico de Medina & Caliva para Hora Santa, Comunión y baladas.',
        steps: [
          {
            type: 'theory',
            theoryId: 'classical_arpeggios',
            badge: 'Estudio Carulli · Medina & Caliva p.32',
            title: 'El arte de hacer cantar cada cuerda por separado',
            body: `En el **Estudio en Do Mayor de Carulli** la mano derecha adopta un orden invariable:\n• **p (Pulgar)**: cuerda del **bajo del acorde** (5ª en C/Am, 4ª en Dm, 6ª en G/Em).\n• **i (Índice)**: siempre atiende la **3ª cuerda**.\n• **m (Medio)**: siempre la **2ª cuerda**.\n• **a (Anular)**: siempre la **1ª cuerda**.\nLa fórmula **\`p - i - m - a - m - i\`** llena cualquier momento de adoración con serenidad.`,
            highlightBox: 'Procura que tu muñeca derecha permanezca arqueada a ~2 cm de la tapa, sin tensar el meñique.',
            actionTarget: { tab: 'tabs', itemId: 'tab_carulli_arpegio', label: 'Practicar Estudio de Carulli en TAB' }
          },
          {
            type: 'quiz',
            theoryId: 'classical_arpeggios',
            question: 'En la digitación clásica estándar de arpegios, ¿qué dedo de la mano derecha atiende la 2ª cuerda (Si)?',
            options: ['Pulgar (p)', 'Índice (i)', 'Medio (m)', 'Anular (a)'],
            correctIndex: 2,
            explanation: '¡Exacto! p = bajos (6/5/4), i = 3ª cuerda, m = 2ª cuerda y a = 1ª cuerda.'
          },
          {
            type: 'quiz',
            theoryId: 'classical_arpeggios',
            question: '¿Por qué es un error técnico jalar las cuerdas hacia afuera (lejos de la tapa) al arpegiar?',
            options: [
              'Porque las cuerdas azotan contra los trastes generando zumbido metálico y haciendo brincar toda la mano',
              'Porque la guitarra suena demasiado dulce',
              'Porque el arpegio solo funciona sin uñas',
              'Porque cambia la afinación de 440Hz a 330Hz'
            ],
            correctIndex: 0,
            explanation: '¡Bien! El movimiento correcto nace de flexionar las falanges de i-m-a en dirección hacia la palma, obteniendo volumen cálido y control.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'classical_arpeggios',
            title: 'Arpegio Contemplativo: Do Maj7 (Cmaj7)',
            instruction: 'Levanta el dedo 1 de Do Mayor (`x32000`) y arpegia p(5ª)-i(3ª)-m(2ª)-a(1ª)-m(2ª)-i(3ª).',
            chord: 'Cmaj7'
          }
        ]
      }
    ]
  },

  // ============================================================================
  // UNIDAD 5: BAJO ALTERNO (B1/B2) Y FOLCLOR COLOMBIANO (4 LECCIONES)
  // ============================================================================
  {
    id: 'unit_5',
    number: 5,
    title: 'Bajo Alterno (B1/B2), Vallenato y Aire Andino',
    subtitle: 'El bajeo B1/B2, Paseo, Merengue, Son Vallenato y Pasillo/Bambuco Colombiano',
    color: '#00CD9C',
    borderColor: '#00A37B',
    icon: '🪗',
    sourceBook: 'Haga Música con la Guitarra & Entre Cuerdas',
    lessons: [
      {
        id: 'u5_l1',
        title: 'Geometría de Bajos Primario (B1) y Secundario (B2)',
        icon: '🎸',
        xp: 35,
        summary: 'Mapea al instante dónde están B1 y B2 en todos los acordes para sonar como un dúo.',
        steps: [
          {
            type: 'theory',
            theoryId: 'bass_alternation_b1_b2',
            badge: 'Fundamento del Folclor · Camavaro',
            title: 'Cómo construir tu propio bajista usando solo el Pulgar',
            body: `Sin alternancia de bajos no hay Vallenato, Vals ni Cumbia:\n• **G / Em / E / F**: **B1 = 6ª cuerda**, **B2 = 5ª o 4ª cuerda**.\n• **C / Am / A / B7**: **B1 = 5ª cuerda**, **B2 = 4ª cuerda** (¡o en Do Mayor sube el dedo 3 a la **6ª traste 3 = Sol** para un B2 más grave!).\n• **D / Dm / D7**: **B1 = 4ª al aire (Re)**, **B2 = 5ª al aire (La)**.`,
            highlightBox: 'Todos nuestros diagramas de acorde marcan B1 en azul claro y B2 en turquesa debajo de las cuerdas.',
            demoChord: 'C'
          },
          {
            type: 'quiz',
            theoryId: 'bass_alternation_b1_b2',
            question: 'En los acordes de RE MAYOR (D) y RE MENOR (Dm), ¿cuáles son respectivamente el Bajo Primario (B1) y Secundario (B2)?',
            options: [
              'B1 = 6ª al aire y B2 = 1ª al aire',
              'B1 = 4ª cuerda al aire (Re) y B2 = 5ª cuerda al aire (La)',
              'B1 = 3ª al aire y B2 = 2ª al aire',
              'Solo usa 6ª cuerda traste 3'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! La 4ª es Re (Tónica del acorde) y la 5ª es La (su 5ª justa); alternar 4ª y 5ª al aire suena limpio y profundo.'
          },
          {
            type: 'quiz',
            theoryId: 'bass_alternation_b1_b2',
            question: 'En Vallenato y Vals sobre DO MAYOR (C), ¿qué movimiento hace el dedo 3 para conseguir el Bajo Secundario más grave y sabroso?',
            options: [
              'Levanta todos los dedos en cada golpe',
              'Pasa de 5ª cuerda traste 3 (Do = cód. 53) a pisar la 6ª cuerda traste 3 (Sol = cód. 63)',
              'Pisa la 1ª cuerda traste 5',
              'Pisa la 4ª cuerda traste 1'
            ],
            correctIndex: 1,
            explanation: '¡Truco profesional! Como Sol es la 5ª de Do, subir el dedo 3 a `63` da un contraste potente de bajos entre Do y Sol grave.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'bass_alternation_b1_b2',
            question: 'Marca el Bajo Secundario profundo de Do Mayor ("63" = 6ª cuerda traste 3 = Sol):',
            targetString: 6,
            targetFret: 3,
            hint: '6ª cuerda arriba, traste 3.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'bass_alternation_b1_b2',
            title: 'Alterna B1(5ª) y B2(6ª/4ª) sobre Do Mayor (C)',
            instruction: 'Arma Do Mayor y practica tocar B1 y luego B2 antes de rasguear.',
            chord: 'C'
          }
        ]
      },
      {
        id: 'u5_l2',
        title: 'El Paseo Vallenato: Guitarra, Caja y Guacharaca',
        icon: '🥁',
        xp: 40,
        summary: 'Combina el bajo alterno y el chasquido en el ritmo emblemático de Valledupar.',
        steps: [
          {
            type: 'theory',
            theoryId: 'vallenato_airs',
            badge: 'Paseo Vallenato 4/4 · Maestro de Parranda',
            title: 'Anatomía del Paseo Clásico (Los Caminos de la Vida, Matilde Lina)',
            body: `En el Paseo Vallenato la guitarra asume el papel de la **sección rítmica completa**:\n\`B1 (1) · ↑ (y) · ✕ (2) · ↓ (y) | B2 (3) · - (y) · ↓ (4) · ↑ (y)\`\n• **B1 y B2**: imitan el tono grave del parche de la **Caja Vallenata**.\n• **✕ (Chasquido en 2)**: imita el fustazo seco de la caja.\n• **↑ y ↓ rasgados**: reproducen el chas-chas continuo de la **Guacharaca**.`,
            highlightBox: 'Abre "🥁 Rasgueos → Paseo Vallenato Clásico" para tocar junto a nuestra Caja y Guacharaca sintetizadas.',
            actionTarget: { tab: 'rhythms', itemId: 'paseo_vallenato', label: 'Sonar Caja & Guacharaca en Paseo' }
          },
          {
            type: 'quiz',
            theoryId: 'vallenato_airs',
            question: 'En el Paseo Vallenato clásico ejecutado en guitarra (`B1 ↑ ✕ ↓ B2 · ↓ ↑`), ¿qué dos instrumentos de percusión típicos reemplaza la mano derecha?',
            options: [
              'Triángulo y piano de cola',
              'La Caja Vallenata (en los bajos y chasquidos) y la Guacharaca (en los roces de arriba/abajo)',
              'Clarinete y saxofón',
              'La armónica únicamente'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! B1/B2/✕ reproducen los golpes graves y secos de la caja; las subidas y bajadas mantienen el raspado de la guacharaca.'
          },
          {
            type: 'quiz',
            theoryId: 'vallenato_airs',
            question: '¿En qué compás se construye el Paseo Vallenato tradicional frente al Merengue Vallenato?',
            options: [
              'Paseo es binario 4/4 (caminado y romántico), mientras Merengue es 6/8 más acelerado',
              'Paseo es siempre 3/4 y Merengue 7/8',
              'Ambos son exactamente el mismo rasgueo sin diferencia',
              'Paseo no usa bajos en absoluto'
            ],
            correctIndex: 0,
            explanation: '¡Brillante! El Paseo camina en 4/4 (`Los Caminos de la Vida`), permitiendo frases largas cantables y líricas.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'vallenato_airs',
            title: 'Práctica de Paseo Vallenato en Sol Séptima (G7)',
            instruction: 'Marca G7 y haz sonar el B1 (6ª tr.3) seguido del chasquido en el tiempo 2.',
            chord: 'G7'
          }
        ]
      },
      {
        id: 'u5_l3',
        title: 'Merengue Vallenato (6/8) y Son con Bordoneo (* Keyner)',
        icon: '🔥',
        xp: 40,
        summary: 'Diferencia la alegría rápida del Merengue 6/8 y el peso profundo del Son Vallenato.',
        steps: [
          {
            type: 'theory',
            theoryId: 'vallenato_airs',
            badge: 'Aires Vallenatos · Escalona & Alejo Durán',
            title: 'Del frenesí festivo del Merengue al sentimiento del Son',
            body: `• **Merengue Vallenato (6/8)**: 6 golpes rápidos (\` + '\`B1 ↓ ↑ ✕ ↑ B2\`' + \`). Muy bailable y alegre ("La Casa en el Aire").\n• **Son Vallenato (4/4 lento)**: ritmo cadencioso de juglares (Alejo Durán, Pacho Rada). Destaca por **bordoneos cromáticos (\`*\`)** en las cuerdas 5ª y 6ª (ej. \`53-52-50-63\`) antes de cambiar de acorde.\n• **Puya**: virtuosismo rápido sobre acentos de 6/8.`,
            highlightBox: 'Si ves en libros colombianos notas como `53* - 52* - 50* - 63*`, tócalas firme con el pulgar para anunciar el acorde que entra.',
            demoChord: 'A7'
          },
          {
            type: 'quiz',
            theoryId: 'vallenato_airs',
            question: '¿Qué aire vallenato es famoso por su cadencia pausada donde el BAJO y los bordoneos (`*`) tienen el protagonismo absoluto?',
            options: ['La Puya acelerada', 'El Son Vallenato', 'El Vals vienés', 'El Merengue rápido'],
            correctIndex: 1,
            explanation: '¡Muy bien! El Son Vallenato respira lento para destacar el diálogo melódico de los bordones en la 5ª y 6ª cuerda.'
          },
          {
            type: 'quiz',
            theoryId: 'vallenato_airs',
            question: '¿Qué secuencia numérica Keyner construye una bajada de bajo clásica ("bordoneo") para ir de DO MAYOR (C) hacia SOL MAYOR (G)?',
            options: [
              '10 - 11 - 12 - 13',
              '53 (Do) → 52 (Si) → 50 (La) → 63 (Sol)',
              '30 - 32 - 34 - 35',
              '20 - 21 - 23 - 10'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! Bajas escala grado a grado desde Do en la 5ª cuerda hasta aterrizar justo en la raíz Sol de la 6ª traste 3.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'bass_alternation_b1_b2',
            question: 'Ubica la nota de paso "52" (Si en 5ª cuerda traste 2) dentro de esa bajada Do → Sol:',
            targetString: 5,
            targetFret: 2,
            hint: '5ª cuerda, espacio 2.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'vallenato_airs',
            title: 'Práctica de Merengue 6/8 en Am / E7',
            instruction: 'Toca La Séptima (A7) o Mi7 (E7) sintiendo los 6 pulsos vivos del Merengue.',
            chord: 'A7'
          }
        ]
      },
      {
        id: 'u5_l4',
        title: 'Pasillo Andino, Bambuco y Guabina ("Espumas" y "Oropel")',
        icon: '🏔️',
        xp: 45,
        summary: 'Incorpora el alma andina de "Haga Música con la Guitarra" al repertorio de tu mano derecha.',
        steps: [
          {
            type: 'theory',
            theoryId: 'pasillo_bambuco_guabina',
            badge: 'Folclor Andino Colombiano · Keyner Ramírez',
            title: 'Cómo acompañar Pasillos y Bambucos como un maestro huilense',
            body: `Gran parte del tesoro del libro de **Keyner Ramírez** pertenece al folclor andino colombiano:\n• **Pasillo Colombiano (3/4 vivo)**: \`B1 ↑ ✕ ↑ B2 ↓\` — el **chasquido (✕) en el pulso 2** le da ese corte elegante e inconfundible (*Espumas*, *Oropel*, *Pescador, Lucero y Río*, *Las Acacias*).\n• **Bambuco (6/8 sincopado)**: \`B1 ↓ ✕ B2 ↓ ✕\` — cruza acentos de 3/4 contra 6/8.\n• **Guabina (3/4 dulce)**: suave y cantable con alternancia de bajos B1/B2.`,
            highlightBox: 'Explora nuestras canciones "Espumas", "Oropel" y "Al Sur" con el rasgueo de Pasillo Andino ya activado.',
            actionTarget: { tab: 'songs', itemId: 'col_espumas', label: 'Estudiar "Espumas" (Jorge Villamil)' }
          },
          {
            type: 'quiz',
            theoryId: 'pasillo_bambuco_guabina',
            question: '¿Qué distingue rítmicamente el PASILLO COLOMBIANO (`B1 ↑ ✕ ↑ B2 ↓`) de un Vals tradicional lento?',
            options: [
              'El Pasillo suele ir más vivo e inserta un corte o chasquido marcado (✕) sobre el 2º pulso del 3/4',
              'El Pasillo no utiliza acordes menores jamás',
              'El Pasillo se toca en 4/4 con caja vallenata',
              'No usa el pulgar en los bajos'
            ],
            correctIndex: 0,
            explanation: '¡Exacto! Ese corte apagado en el segundo pulso diferencia inmediatamente el Pasillo de Jorge Villamil/José A. Morales del Vals europeo.'
          },
          {
            type: 'quiz',
            theoryId: 'pasillo_bambuco_guabina',
            question: 'En qué región y compás nace el Bambuco Colombiano tradicional (`B1 ↓ ✕ B2 ↓ ✕`):',
            options: [
              'Región Andina, caracterizado por una sabrosa síncopa en 6/8',
              'Música electrónica europea en 2/4',
              'Canto gregoriano sin ritmo',
              'Únicamente en tonalidad disminuida'
            ],
            correctIndex: 0,
            explanation: '¡Muy bien! La síncopa 6/8 con los apagados en 3 y 6 define el pulso del Bambuco.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'pasillo_bambuco_guabina',
            title: 'Práctica de Pasillo: La Mayor (A / LA+) de Espumas',
            instruction: 'Toca La Mayor marcando el tiempo 1 con la 5ª cuerda al aire y rasgueo brillante en primas.',
            chord: 'A'
          }
        ]
      }
    ]
  },

  // ============================================================================
  // UNIDAD 6: CUMBIA, PORRO, MODULACIONES Y DISMINUIDOS (4 LECCIONES)
  // ============================================================================
  {
    id: 'unit_6',
    number: 6,
    title: 'Cumbia, Porro y Modulaciones Colombianas',
    subtitle: 'El contratiempo costeño, Carmen de Bolívar, modulación homónima y acorde DIS.',
    color: '#FF4B4B',
    borderColor: '#D33131',
    icon: '🌴',
    sourceBook: 'Folclor del Caribe & Haga Música con la Guitarra',
    lessons: [
      {
        id: 'u6_l1',
        title: 'Cumbia Tradicional: El Contratiempo del Tambor Llamador',
        icon: '🥁',
        xp: 40,
        summary: 'Siente el "tapa-CHÁ" de La Piragua y Yo Me Llamo Cumbia en la palma derecha.',
        steps: [
          {
            type: 'theory',
            theoryId: 'cumbia_porro_groove',
            badge: 'Cumbia Costeña · 4/4 en Contratiempo',
            title: 'Por qué el rasgueo sube en "y" y apaga en 2 y 4',
            body: `En la Cumbia tradicional, el tambor llamador entra siempre **después del tiempo fuerte ("en la y")**.\nTu guitarra imita ese juego folclórico completo:\n\`1 (B1) · y (↑) · 2 (✕) · y (↑) | 3 (B2) · y (↑) · 4 (✕) · y (↑)\`\n• Nota clave de sabor costeño: en acordes como **E7**, el contraste de la 3ª cuerda traste 1 (**Sol# = cód. 31**) junto a **Am** o **Dm** crea el color inconfundible de la cumbia.`,
            highlightBox: 'En "🎶 Canciones" abre "La Piragua" o "El Año Viejo" para ensayar con nuestra percusión de Alegre, Llamador y Maracón.',
            actionTarget: { tab: 'songs', itemId: 'col_la_piragua', label: 'Tocar "La Piragua" con Cumbia' }
          },
          {
            type: 'quiz',
            theoryId: 'cumbia_porro_groove',
            question: 'En la secuencia rítmica de Cumbia (`B1 ↑ ✕ ↑ B2 ↑ ✕ ↑`), ¿qué hace el rasgueo exactamente en las sílabas débiles ("y")?',
            options: [
              'Sube suavemente en las primas imitando el golpe del tambor llamador a contratiempo',
              'Toca siempre el bajo de la 6ª cuerda',
              'Guarda silencio absoluto todo el compás',
              'Apaga las cuerdas con la mano izquierda'
            ],
            correctIndex: 0,
            explanation: '¡Exacto! Las subidas continuas en contratiempo amarran el ritmo con los bajos B1/B2 y los apagados ✕ en 2 y 4.'
          },
          {
            type: 'quiz',
            theoryId: 'cumbia_porro_groove',
            question: 'En "El Año Viejo" (pág. 40 del libro Keyner), ¿qué únicos dos acordes alternas en toda la canción?',
            options: [
              'G - C - D',
              'Am (LA-) y E7 (5ª de La)',
              'F - Bb - C7',
              'Bm - F#m'
            ],
            correctIndex: 1,
            explanation: '¡Correcto! La menor (LA-) y Mi Séptima (5ª LA) bastan para acompañar de principio a fin este clásico decembrino.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'cumbia_porro_groove',
            title: 'Práctica Costeña: Mi Séptima (E7 / 5ª LA)',
            instruction: 'Solo 2 dedos: 5ª tr.2 (Dedo 2) y 3ª tr.1 (Dedo 1). Rasguea las 6 cuerdas con fuego.',
            chord: 'E7'
          }
        ]
      },
      {
        id: 'u6_l2',
        title: 'Porro Sabanero ("Carmen de Bolívar" y "Colombia Tierra Querida")',
        icon: '🎺',
        xp: 45,
        summary: 'Toca la síncopa brillante de las bandas de viento adaptada a guitarra.',
        steps: [
          {
            type: 'theory',
            theoryId: 'cumbia_porro_groove',
            badge: 'Porro Pelayero / Sabanero · Lucho Bermúdez',
            title: 'El estallido alegre del Porro en la guitarra acompañante',
            body: `• **Patrón Porro Sabanero**: \`B1 · ↓ ↑ ✕ ↑ B2 ↓\` — mezcla un bajo amplio inicial con dos golpes sincopados de aire sabanero.\n• En **"Carmen de Bolívar"** (libro de Keyner p.41 en \`LA+\`), alternas **A (LA+)** y **E7 (5ª LA)** mientras el requinto/vientos cantan \`22-22-23-10 · 24-10-12-10\`.`,
            highlightBox: 'Puedes practicar la introducción exacta de "Carmen de Bolívar" en números Keyner dentro de la pestaña Tablaturas.',
            actionTarget: { tab: 'tabs', itemId: 'tab_keyner_carmen_bolivar', label: 'Abrir TAB Carmen de Bolívar (Keyner)' }
          },
          {
            type: 'quiz',
            theoryId: 'cumbia_porro_groove',
            question: 'En el Porro Sabanero ("Carmen de Bolívar" en el libro de Keyner), ¿qué papel juega el rasgueo sincopado `↓ ↑ ✕ ↑ B2 ↓`?',
            options: [
              'Sostener una balada fúnebre ultra lenta',
              'Responder a los metales con un golpe firme en B1, síncopa en el centro y rebote rítmico hacia el siguiente compás',
              'Tocar solo cuerdas muteadas sin nota',
              'Eliminar la 1ª y 2ª cuerda'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! El porro combina el peso del bombo de banda (B1/B2) con la respuesta chispeante de platillos y redoblante.'
          },
          {
            type: 'quiz',
            theoryId: 'keyner_numeric_grid',
            question: 'En la intro de "Carmen de Bolívar" (`22-22-23-10 · 24-10-12-10`), ¿qué significa "24" seguido de "10"?',
            options: [
              '2ª cuerda traste 4 (Re#) seguido de 1ª cuerda al aire (Mi)',
              '4ª cuerda traste 2 seguido de 1ª traste 10',
              '24 veces 1ª cuerda al aire',
              'Cuerda 6 traste 4'
            ],
            correctIndex: 0,
            explanation: '¡Lectura Keyner ágil! 24 = 2ª cuerda traste 4 (nota de paso cromática Re# hacia Mi al aire = 10).'
          },
          {
            type: 'fretboard_find',
            theoryId: 'keyner_numeric_grid',
            question: 'Encuentra la nota "24" (2ª cuerda traste 4 = Re#) de la melodía de Carmen de Bolívar:',
            targetString: 2,
            targetFret: 4,
            hint: '2ª cuerda desde abajo, traste 4.'
          }
        ]
      },
      {
        id: 'u6_l3',
        title: 'Modulación Homónima: De Menor a Mayor (Am → A / Dm → D)',
        icon: '🌅',
        xp: 45,
        summary: 'El recurso estrella colombiano para abrir el cielo en los estribillos de folclor.',
        steps: [
          {
            type: 'theory',
            theoryId: 'homonymous_modulation_dim',
            badge: 'Armonía Express · Pueblito Viejo, Al Sur, Colombia Tierra Querida',
            title: 'De la nostalgia menor al sol del homónimo mayor',
            body: `Observa cuántas joyas colombianas comparten exactamente esta arquitectura:\n• **"Pueblito Viejo"**: Estrofa en **Am (\`LA-\`)** → Estribillo en **A (\`LA+\`)**.\n• **"Al Sur"**: Estrofa en **Am (\`LA-\`)** → Coro ("¡Al sur!") en **A (\`LA+\`)**.\n• **"Colombia Tierra Querida"**: Estrofa en **Am** → Coro en **A**.\n• **"Carmen de Bolívar" / "Pescador, Lucero y Río"**: alternan entre **Dm (\`RE-\`)** y **D (\`RE+\`)**.\nCambia solo **1 nota del acorde** (la 3ª menor sube 1 traste para ser 3ª Mayor) ¡y el paisaje emocional entero se ilumina!`,
            highlightBox: 'Para modular de Am (x02210) a A (x02220), solo subes 1 traste la 2ª cuerda de traste 1 (Do) a traste 2 (Do#)!',
            demoChord: 'A'
          },
          {
            type: 'quiz',
            theoryId: 'homonymous_modulation_dim',
            question: '¿Qué significa que "Pueblito Viejo" y "Al Sur" modulen de LA MENOR (Am) a su HOMÓNIMO MAYOR (La Mayor / A)?',
            options: [
              'Que cambian de tonalidad manteniendo la MISMA nota tónica (La), pero volviendo Mayor la 3ª (de Do a Do#)',
              'Que bajan a Sol Menor',
              'Que cambian de guitarra acústica a bajo eléctrico',
              'Que pasan del traste 1 al traste 12 de golpe'
            ],
            correctIndex: 0,
            explanation: '¡Brillante! "Homónimo" significa "mismo nombre": ambos comparten el centro tonal LA (A) y comparten además el mismo acorde Dominante E7 (5ª de La)!'
          },
          {
            type: 'quiz',
            theoryId: 'homonymous_modulation_dim',
            question: '¿Qué único acorde sirve como puente natural común entre La Menor (LA-) y La Mayor (LA+)?',
            options: [
              'Fa Mayor',
              'Mi Séptima (E7 · 5ª DE LA), que es el V7 dominante de ambos modos',
              'Do Mayor',
              'Si bemol Mayor'
            ],
            correctIndex: 1,
            explanation: '¡Oído de compositor! Porque E7 (Mi-Sol#-Si-Re) resuelve con igual magnetismo tanto hacia Am como hacia A Mayor.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'homonymous_modulation_dim',
            title: 'Práctica de Contraste: Toca La Mayor (A / LA+)',
            instruction: 'Siente cómo cambia de luz frente a La Menor al subir la 2ª cuerda del espacio 1 al 2.',
            chord: 'A'
          }
        ]
      },
      {
        id: 'u6_l4',
        title: 'El Acorde Disminuido (DIS.) en "Oropel" y Cantos Andinos',
        icon: '💎',
        xp: 45,
        summary: 'Usa el acorde D#dim7 ("DIS." en Keyner) para enlazar tensiones dramáticas de pasillo.',
        steps: [
          {
            type: 'theory',
            theoryId: 'homonymous_modulation_dim',
            badge: 'Color Dramático · Libro Keyner p.20 (Oropel)',
            title: 'Por qué los pasillos usan el misterioso acorde DIS.',
            body: `En la página 20 de *Haga Música con la Guitarra* ("Oropel" de Jorge Villamil), justo en *"Si apuestas al amor... cuántas traiciones"*, aparece marcado el símbolo **\`DIS.\`** (**Disminuido 7**, en este tono **D#dim7**):\n• Se construye apilando **terceras menores exactas** (\` + '\`0 - 3 - 6 - 9\`' + \`).\n• Su simetría le da una tensión cinematográfica irresistible que pide resolver medio tono arriba hacia **E / Em** o **B7**.\n• En guitarra: pisa \`xx1212\` en las 4 primeras cuerdas.`,
            highlightBox: 'Si deslizas la figura de `xx1212` exactamente 3 trastes hacia arriba (`xx4545`), obtienes exactamente LAS MISMAS 4 NOTAS invertidas!',
            demoChord: 'D#dim7'
          },
          {
            type: 'quiz',
            theoryId: 'homonymous_modulation_dim',
            question: 'En "Oropel" (pág. 20 de Keyner Ramírez), ¿qué simboliza la abreviatura "DIS." sobre la palabra "Si apuestas al amor"?',
            options: [
              'Disminuir el volumen casi a cero',
              'Acorde Disminuido 7 (ej. D#dim7 · xx1212), puente de máxima tensión dramática',
              'Disponer el capotraste en traste 4',
              'Descanso de 2 compases'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! El acorde disminuido añade ese clímax nostálgico clásico de los pasillos y boleros latinoamericanos.'
          },
          {
            type: 'quiz',
            theoryId: 'homonymous_modulation_dim',
            question: '¿Por qué es única la geometría del acorde Disminuido 7 (dim7) en el diapasón de la guitarra?',
            options: [
              'Porque solo usa cuerdas al aire',
              'Porque está formado por terceras menores simétricas (3 semitonos): ¡si lo corres 3 trastes son las mismas 4 notas en distinto orden!',
              'Porque lleva 7 cejillas simultáneas',
              'Porque nunca aparece en música colombiana'
            ],
            correctIndex: 1,
            explanation: '¡Así es! Cada 3 trastes en la guitarra repites el mismo acorde disminuido, lo que sirve para hacer adornos ascendentes bellísimos.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'homonymous_modulation_dim',
            title: 'Toca tu primer Acorde Disminuido: D#dim7 (DIS.)',
            instruction: 'Pisa solo las 4 primeras cuerdas (`xx1212`: dedos 1-3-2-4) y escúchalo resolver a Mi.',
            chord: 'D#dim7'
          }
        ]
      }
    ]
  },

  // ============================================================================
  // UNIDAD 7: ARMONÍA FUNCIONAL, TABLA KEYNER, DOMINANTES Y CAPO (4 LECCIONES)
  // ============================================================================
  {
    id: 'unit_7',
    number: 7,
    title: 'Armonía Aplicada: Familias, Dominantes y Capo',
    subtitle: 'Tabla de Relaciones de Keyner, Dominantes Secundarios, Slash Chords y Capotraste',
    color: '#FF78C4',
    borderColor: '#E052A0',
    icon: '🧠',
    sourceBook: 'Cordantonopulos, Keyner (p.5) & Cancionero Digital',
    lessons: [
      {
        id: 'u7_l1',
        title: 'Tabla "Relaciones Armónicas" de Keyner (Primitivo, Relativo, 5ª)',
        icon: '🔗',
        xp: 45,
        summary: 'Comprende cómo nacen las familias de acordes para sacar cualquier canción de oído.',
        steps: [
          {
            type: 'theory',
            theoryId: 'keyner_harmonic_relations',
            badge: 'Tabla Maestra · Keyner Ramírez p.5',
            title: 'Los pilares armónicos de todo tono Mayor y Menor',
            body: `En la tabla de Keyner cada tonalidad se rodea de acompañantes naturales:\n• **1. Tono Primitivo (I)**: la casa musical (ej. **Sol Mayor / G**).\n• **2. Relativo (VIm)**: su pareja emotiva que comparte la misma armadura (**Mi menor / Em** para Sol; **La menor / Am** para Do).\n• **3. 5ª Siguiente (Dominante V7)**: prepara el regreso a casa (**D7** para Sol; **G7** para Do; **A7** para Re).\n• **4. Subdominante (IV)**: abre el horizonte antes de volver al V7 (**C** en Sol; **F** en Do).`,
            highlightBox: 'Si una canción está en G y escuchas que "cambia de color" suavemente hacia la tristeza sin salirse del tono, casi seguro fue a su Relativo Em.',
            demoChord: 'G'
          },
          {
            type: 'quiz',
            theoryId: 'keyner_harmonic_relations',
            question: 'Según las Relaciones Armónicas de los Tonos, si el Tono Primitivo es RE MAYOR (D), ¿cuál es su Relativo Menor y su 5ª Dominante?',
            options: [
              'Relativo Am y 5ª G7',
              'Relativo Si Menor (Bm) y 5ª Dominante La Séptima (A7)',
              'Relativo Em y 5ª E7',
              'Relativo Cm y 5ª F7'
            ],
            correctIndex: 1,
            explanation: '¡Dominio total! En D Mayor: VI grado = Bm (Relativo menor) y V7 grado = A7 (5ª de Re).'
          },
          {
            type: 'quiz',
            theoryId: 'keyner_harmonic_relations',
            question: '¿Cómo encuentras al instante el Relativo Menor (VIm) desde cualquier acorde Mayor en la guitarra?',
            options: [
              'Subes una cuerda y listo',
              'Bajas 3 semitonos (3 trastes atrás) desde la nota Tónica Mayor: Do → (3 trastes atrás) = La menor',
              'Avanzas 5 trastes hacia el puente',
              'Pones cejilla siempre en el traste 1'
            ],
            correctIndex: 1,
            explanation: '¡Regla geométrica infalible! C -3st → Am; G -3st → Em; D -3st → Bm; A -3st → F#m.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'keyner_harmonic_relations',
            title: 'Toca la pareja inseparable de Do: La Menor (Am) y Do (C)',
            instruction: 'Haz sonar Do Mayor y escucha la hermandad tonal inmediata frente a La Menor.',
            chord: 'C'
          }
        ]
      },
      {
        id: 'u7_l2',
        title: 'Dominantes Secundarios (V7/IV y V7/VI)',
        icon: '🚀',
        xp: 45,
        summary: 'El truco detrás de "Cinco Panes y Dos Peces" y "Dios Está Aquí" para empujar el coro.',
        steps: [
          {
            type: 'theory',
            theoryId: 'secondary_dominants',
            badge: 'Armonía Intermedia · Empuje Emocional',
            title: 'Pedir prestado un Dominante 7 para resaltar otro acorde de paso',
            body: `Un **Dominante Secundario** consiste en anteponer la "5ª de..." a un acorde distinto de la tónica:\n• **V7/IV ("El Pase al Coro")**: en tono de **D**, haces **D7** para lanzar al oído hacia **G** ("Dios Está Aquí"). En **G**, haces **G7 → C** ("Alma Misionera").\n• **V7/VI**: en tono de **G**, el acorde **B7** (en vez de Bm) empuja con dramatismo hacia **Em** ("Dale de comer a mis hermanos" en *Cinco Panes y Dos Peces*).`,
            highlightBox: 'Si ves un acorde Mayor7 que no debería existir en la escala (como B7 en tono de Sol o E7 en tono de Do), revisa si 1 compás después cae una 5ª abajo: ¡es un Dominante Secundario!',
            demoChord: 'B7'
          },
          {
            type: 'quiz',
            theoryId: 'secondary_dominants',
            question: 'En "Cinco Panes y Dos Peces" (tonalidad Sol Mayor), ¿qué función cumple el acorde B7 justo antes de Mi menor ("dale de comer a mis hermanos")?',
            options: [
              'Es un error de impresión del cancionero',
              'Dominante Secundario (V7/VI): actúa como 5ª Dominante temporal de Em para darle fuerza emotiva',
              'Subdominante de Do',
              'Acorde disminuido de paso'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! B7 (Si-Re#-Fa#-La) contiene la sensible Re# que apunta directo a Mi menor.'
          },
          {
            type: 'quiz',
            theoryId: 'secondary_dominants',
            question: 'Si estás tocando "Dios Está Aquí" en Re Mayor (D) y ves "D → D7 → G", ¿por qué se transforma D en D7 justo antes de G?',
            options: [
              'Porque D7 es el V7/IV ("5ª de Sol"): prepara con expectativa la llegada del Subdominante Sol (G)',
              'Para volver la canción menor',
              'Para bajar el volumen',
              'Para afinar la 6ª cuerda'
            ],
            correctIndex: 0,
            explanation: '¡Perfecto! Añadir esa 7ª menor (Do natural) rompe la estabilidad de D y empuja directo hacia Sol Mayor.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'secondary_dominants',
            title: 'Práctica de V7/VI: Si Séptima (B7) sin cejilla',
            instruction: 'Arma B7 abierto (`x21202`: dedos 2-1-3-0-4) y resuélvelo hacia Em!',
            chord: 'B7'
          }
        ]
      },
      {
        id: 'u7_l3',
        title: 'Slash Chords (G/B, D/F#) e Intercambio Modal (IV → IVm)',
        icon: '🌉',
        xp: 45,
        summary: 'Construye bajos caminantes melódicos y usa el giro nostálgico G → Gm → D.',
        steps: [
          {
            type: 'theory',
            theoryId: 'slash_chords_capo',
            badge: 'Bajo Invertido & Color Modal',
            title: 'Acordes con barra: qué toca arriba y qué nota pisa el bajo',
            body: `• **Acorde con Bajo Invertido (Slash Chord)**: en **\`G/B\`**, tocas el acorde de **Sol Mayor**, pero tu nota más grave es **Si** (5ª traste 2). Así caminas suave: **\`C (bajo Do) → G/B (bajo Si) → Am (bajo La)\`** ("Tan Cerca de Mí", "Nadie te ama como yo").\n• **En tono de G**: **\`G (Sol) → D/F# (Fa#) → Em (Mi)\`** crea una línea descendente de bajo increíble.\n• **Intercambio Modal (IV → IVm)**: en "Eran Cien Ovejas", **\`G → Gm → D\`** pinta la tristeza del rebaño perdido.`,
            highlightBox: 'Un Slash Chord NO son "dos acordes a la vez": es Acorde a la izquierda / Nota del Bajo a la derecha.',
            demoChord: 'G/B'
          },
          {
            type: 'quiz',
            theoryId: 'slash_chords_capo',
            question: 'Cuando encuentras escrito `D/F#` ("Re con bajo en Fa#") entre `G` y `Em`, ¿qué debe sonar como nota más grave del acorde?',
            options: [
              'La nota Re al aire únicamente',
              'La nota Fa sostenido (6ª cuerda traste 2 pisada con dedo 1 o pulgar), manteniendo arriba la tríada de Re Mayor',
              'Una mezcla confusa de Re Mayor y Fa# Mayor',
              'Solamente la 1ª cuerda'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! El bajo camina cromáticamente Sol (63) → Fa# (62) → Mi (60) creando fluidez coral.'
          },
          {
            type: 'quiz',
            theoryId: 'secondary_dominants',
            question: 'En "Eran Cien Ovejas" (`...al contarlas [G]todas, [Gm]le faltaba [D]una`), ¿cómo se llama el recurso armónico de pasar de Sol Mayor (IV) a Sol Menor (IVm)?',
            options: [
              'Intercambio Modal (tomar prestado el IV menor del modo menor homónimo)',
              'Afinación Drop D',
              'Círculo pentatónico',
              'Sustitución de cejilla abierta'
            ],
            correctIndex: 0,
            explanation: '¡Análisis de nivel superior! El Intercambio Modal IV → IVm → I es uno de los colores más emotivos de la armonía moderna y sacra.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'slash_chords_capo',
            title: 'Práctica de Puentes: Sol con Bajo en Si (G/B)',
            instruction: 'Pisa 5ª tr.2 (Dedo 1) y 2ª/1ª tr.3 (Dedos 3 y 4) evitando la 6ª cuerda.',
            chord: 'G/B'
          }
        ]
      },
      {
        id: 'u7_l4',
        title: 'Transporte Inteligente y Matemática del Capotraste',
        icon: '🎚️',
        xp: 45,
        summary: 'Adapta cualquier canto o vallenato a la altura exacta de tu voz en segundos.',
        steps: [
          {
            type: 'theory',
            theoryId: 'slash_chords_capo',
            badge: 'Herramienta de Cantante · Capotraste',
            title: 'Sube el tono sin perder la comodidad de tus acordes favoritos',
            body: `El **Capotraste** funciona como una cejuela portátil que sube **+1 semitono por cada traste** hacia la boca:\n• Si colocas el **Capo en Traste 2** y tocas figura de **Sol (G)**, el acorde real que suena es **La Mayor (A)** (+2 semitonos: G → G# → A).\n• Si pones el **Capo en Traste 1** para tocar *"La Gota Fría"* usando figuras abiertas de **Am - E7**, ¡estarás sonando en **Bbm - F7** igual que la grabación de Carlos Vives!`,
            highlightBox: 'Nuestro botón "Transportar Tono + Calculadora de Capo" en la pestaña Canciones hace este cálculo por ti al instante.',
            demoChord: 'A#'
          },
          {
            type: 'quiz',
            theoryId: 'slash_chords_capo',
            question: 'Si una alabanza está escrita en SI BEMOL (Bb) con muchas cejillas difíciles, ¿dónde colocas el Capotraste para tocarla usando las figuras abiertas de LA (A - D - E7)?',
            options: [
              'Capo en Traste 5',
              'Capo en Traste 1 (La + 1 semitono = La#/Bb)',
              'Capo en Traste 7',
              'No existe forma con capotraste'
            ],
            correctIndex: 1,
            explanation: '¡Cálculo perfecto! La (A) más 1 traste hacia adelante es Si bemol (Bb). O también Capo 3 tocando figuras de Sol (G).'
          },
          {
            type: 'quiz',
            theoryId: 'slash_chords_capo',
            question: 'Si tienes el Capotraste puesto en el TRASTE 3 y formas la figura visual de Mi Menor (Em), ¿qué acorde REAL está escuchando el público?',
            options: [
              'Mi menor igual',
              'Sol Menor (Gm · E + 3 semitonos = F → F# → G)',
              'La Menor',
              'Do Mayor'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! Mi + 1 = Fa, + 2 = Fa#, + 3 = Sol. Estás tocando Sol menor con la comodidad de Em abierto.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'slash_chords_capo',
            question: 'Verifica en la 6ª cuerda dónde queda Sol (G) al contar +3 trastes desde Mi abierto (60 → 63):',
            targetString: 6,
            targetFret: 3,
            hint: '6ª cuerda, traste 3.'
          }
        ]
      }
    ]
  },

  // ============================================================================
  // UNIDAD 8: NIVEL INTERMEDIO — CEJILLA, ARAÑITA, CAGED Y COLORES (4 LECCIONES)
  // ============================================================================
  {
    id: 'unit_8',
    number: 8,
    title: 'Nivel Intermedio: Cejilla, Arañita y Sistema CAGED',
    subtitle: 'Biomecánica de la cejilla sin fatiga, independencia 1-2-3-4 y acordes móviles en todo el mástil',
    color: '#6C63FF',
    borderColor: '#4E46D9',
    icon: '💪',
    sourceBook: 'Fran Cordón, Iván Becerra (Método 1) & CAGED',
    lessons: [
      {
        id: 'u8_l1',
        title: 'Física de la Cejilla Sin Dolor (F, Bm, F#m) y Atajos',
        icon: '🦴',
        xp: 45,
        summary: 'El giro de 15° del índice y el contrapeso de brazo que eliminan los trasteos en Fa y Bm.',
        steps: [
          {
            type: 'theory',
            theoryId: 'barre_chords_biomechanics',
            badge: 'Biomecánica · Fran Cordón',
            title: 'Deja de apretar con fuerza bruta entre el pulgar y el índice',
            body: `Si la 2ª o 3ª cuerda suena muerta cuando armas **Fa (\`133211\`)** o **Si menor (\`x24432\`)**, corrige esto hoy:\n1. **Gira el dedo índice 15° hacia el clavijero**: apoya su **borde óseo lateral** en vez de los pliegues blandos de frente.\n2. **Alineado al riel**: pega el índice milímetros detrás del traste metálico y baja el **codo izquierdo hacia tu cintura**.\n3. **Peso gravitacional**: deja caer suavemente el peso del brazo izquierdo hacia atrás equilibrado con el antebrazo derecho.`,
            highlightBox: 'Para entrenar sin agotarte, practica primero la misma forma en Traste 5 (A / Dm) donde la tensión de cuerdas es más suave.',
            demoChord: 'Bm'
          },
          {
            type: 'quiz',
            theoryId: 'barre_chords_biomechanics',
            question: '¿Qué parte del dedo índice debe presionar las cuerdas en una cejilla limpia y sin dolor?',
            options: [
              'La parte carnosa frontal donde se doblan las articulaciones',
              'El borde óseo lateral del índice (girando ~15° hacia el clavijero) pegado detrás del metal del traste',
              'Solo la punta doblada del dedo',
              'Pisar montando el dedo medio siempre sobre la 1ª cuerda'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! El costado lateral del índice es rígido y plano, evitando que las cuerdas del medio queden hundidas en un pliegue.'
          },
          {
            type: 'quiz',
            theoryId: 'barre_chords_biomechanics',
            question: 'Si estás cansado en medio de una canción rápida y aparece un FA MAYOR (F), ¿qué sustituto abierto sin cejilla conserva el color dulce de Fa?',
            options: ['Fmaj7 (`xx3210`) o Fa fácil', 'C#m7', 'Bb mayor', 'Em7 al aire'],
            correctIndex: 0,
            explanation: '¡Bien! Fmaj7 (`xx3210`) comparte las notas clave de Fa sin exigir cejilla completa en traste 1.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'barre_chords_biomechanics',
            title: 'Reto Intermedio 1: Fa Mayor (F)',
            instruction: 'Aplica el giro lateral del índice en traste 1 (`133211`) y rasguea claro.',
            chord: 'F'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'barre_chords_biomechanics',
            title: 'Reto Intermedio 2: Si Menor (Bm)',
            instruction: 'Cejilla desde la 5ª cuerda en traste 2 (`x24432`): ¡indispensable en Re Mayor!',
            chord: 'Bm'
          }
        ]
      },
      {
        id: 'u8_l2',
        title: 'Independencia "La Arañita 1-2-3-4" (Becerra) y Ligados',
        icon: '🕷️',
        xp: 45,
        summary: 'Despierta el meñique (dedo 4) y gana velocidad para punteos con el ejercicio clásico.',
        steps: [
          {
            type: 'theory',
            theoryId: 'spider_independence_caged',
            badge: 'Técnica Diaria · Iván Becerra (Método 1)',
            title: '5 minutos de Arañita transforman tu agilidad en 2 semanas',
            body: `El ejercicio **1 - 2 - 3 - 4** entrena independencia neurológica y elasticidad:\n• Empieza en 6ª cuerda trastes 1, 2, 3 y 4.\n• **Regla crucial**: **no levantes el dedo anterior** cuando apoyes el siguiente hasta completar las 4 notas de la cuerda.\n• Alterna **\`i - m\` (índice - medio)** o púa alternada abajo-arriba en mano derecha sin repetir dedo.`,
            highlightBox: 'Cuando te resulte fácil en posición 1, prueba permutaciones como 1-3-2-4 y 4-3-2-1 bajando de cuerda en cuerda.',
            actionTarget: { tab: 'tabs', itemId: 'tab_aranita_becerra', label: 'Practicar La Arañita en TAB + Micrófono' }
          },
          {
            type: 'quiz',
            theoryId: 'spider_independence_caged',
            question: 'Durante el ejercicio cromático "La Arañita" (1-2-3-4), ¿qué debes vigilar con tus dedos izquierdos mientras avanzas por la misma cuerda?',
            options: [
              'Levantar bruscamente cada dedo lo más lejos posible del diapasón',
              'Dejar apoyados con suavidad los dedos anteriores detrás de su traste hasta completar la cuerda, evitando que "salten por los aires"',
              'Tocar los 4 trastes con un único dedo índice',
              'Apretar lo más fuerte posible hasta doblar el cuello'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! Mantener la mano económica (cerca de las cuerdas, sin dedos voladores) es el secreto de toda velocidad limpia.'
          },
          {
            type: 'quiz',
            theoryId: 'hands_nails',
            question: 'En la mano derecha durante escalas o punteos como "La Arañita", ¿qué técnica da mayor fluidez y velocidad?',
            options: [
              'Repetir el dedo pulgar únicamente para todas las cuerdas primas',
              'Alternar estrictamente Índice y Medio (i - m - i - m) "caminando" sobre las cuerdas',
              'Usar el meñique para las notas rápidas',
              'Tocar solo hacia abajo con la uña del anular'
            ],
            correctIndex: 1,
            explanation: '¡Perfecto! Alternar `i-m` dobla tu velocidad máxima de inmediato y mantiene regular el ritmo.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'spider_independence_caged',
            question: 'Entrena el alcance de tu meñique (Dedo 4) pulsando el código "44" (4ª cuerda traste 4 = Fa#):',
            targetString: 4,
            targetFret: 4,
            hint: '4ª cuerda, espacio 4 (Dedo 4).'
          }
        ]
      },
      {
        id: 'u8_l3',
        title: 'Sistema Móvil CAGED: Todo Acorde en Todo el Mástil',
        icon: '🗺️',
        xp: 50,
        summary: 'Multiplica tus posiciones usando los 5 moldes móviles C-A-G-E-D con cejilla.',
        steps: [
          {
            type: 'theory',
            theoryId: 'spider_independence_caged',
            badge: 'Geometría del Mástil · Sistema CAGED',
            title: 'Convierte 5 figuras abiertas en los 12 tonos del universo',
            body: `Cualquier acorde se puede tocar en varias zonas del mástil usando los **moldes CAGED**:\n• **Molde Forma E** (bajo en 6ª cuerda): en tr.1 = **F**; tr.3 = **G**; tr.5 = **A (\`577655\`)**; tr.8 = **C**.\n• **Molde Forma A** (bajo en 5ª cuerda): en tr.2 = **B**; tr.3 = **C (\`x35553\`)**; tr.5 = **D**.\n• **Molde Forma Em / Am**: da todos los acordes menores móviles (**Fm, Gm, Am en tr.5** o **Bm, Cm, Dm en tr.5**).`,
            highlightBox: 'Si conoces dónde están las notas en la 6ª y 5ª cuerda, puedes acompañar en tonos altos con sonido cristalino.',
            actionTarget: { tab: 'fretboard', itemId: 'caged', label: 'Explorar Posiciones CAGED en Mástil' }
          },
          {
            type: 'quiz',
            theoryId: 'spider_independence_caged',
            question: 'Si tomas el molde móvil de "MI MAYOR" (6ª en cejilla) y colocas tu índice en el TRASTE 8 (donde la 6ª cuerda da DO), ¿qué acorde suena?',
            options: [
              'Sol Mayor',
              'Do Mayor en posición aguda (`8-10-10-9-8-8`)',
              'Fa Menor',
              'Re Séptima'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! E (0) → F (1) → G (3) → A (5) → B (7) → C (8). Tocar C arriba suena brillante en arreglos de dos guitarras.'
          },
          {
            type: 'quiz',
            theoryId: 'spider_independence_caged',
            question: '¿En qué traste colocas el molde de LA MENOR (Forma Am con raíz en 5ª cuerda) para tocar RE MENOR (`x57765`)?',
            options: [
              'Traste 2',
              'Traste 3',
              'Traste 5 (donde la 5ª cuerda es Re = D)',
              'Traste 7'
            ],
            correctIndex: 2,
            explanation: '¡Exacto! En la 5ª cuerda al aire es A (0) → B (2) → C (3) → D (5). Por tanto forma Am en traste 5 es Dm.'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'spider_independence_caged',
            title: 'Toca Fa# Menor (F#m) — Molde Em en Traste 2',
            instruction: 'Cejilla completa en traste 2 con dedos 3 y 4 en 5ª/4ª traste 4 (`244222`).',
            chord: 'F#m'
          }
        ]
      },
      {
        id: 'u8_l4',
        title: 'Acordes de Color Moderno: Cadd9, Dsus4 y Em7 en Adoración',
        icon: '✨',
        xp: 50,
        summary: 'Suaviza la adoración contemporánea dejando 2 cuerdas ancladas en la parte aguda.',
        steps: [
          {
            type: 'theory',
            theoryId: 'secondary_dominants',
            badge: 'Adoración Contemporánea · Colores Modales',
            title: 'El paquete de 4 acordes cristalinos con Dedos 3 y 4 fijos',
            body: `En adoración moderna verás la familia ultra fluida de **Sol Mayor** dejando los dedos **3 y 4 anclados** en \`23\` y \`13\`:\n• **G**: \`320033\`  →  **Cadd9**: \`x32033\` (¡solo bajas dedos 1 y 2 una cuerda!)\n• **Em7**: \`022033\`  →  **D / Dsus4**: \`xx0233\` → \`xx0232\`\nSuena celestial, sin saltos bruscos y llena el templo con armónicos ricos.`,
            highlightBox: 'Juega intercalando `Dsus4` (meñique en 1ª tr.3) antes de caer a `D` al final de una frase.',
            demoChord: 'Cadd9'
          },
          {
            type: 'quiz',
            theoryId: 'secondary_dominants',
            question: 'Qué ventaja física y sonora brinda cambiar entre `G`, `Cadd9`, `Em7` y `Dsus4` en baladas contemporáneas:',
            options: [
              'Hay que mover los 4 dedos en cada acorde',
              'Los dedos 3 y 4 permanecen anclados en el traste 3 de las cuerdas 1ª y 2ª creando continuidad armónica',
              'Elimina las cuerdas graves',
              'Solo sirve para Merengue rápido'
            ],
            correctIndex: 1,
            explanation: '¡Así es! Esas dos notas agudas fijas (Re y Sol) funcionan como un pedal campanilleante súper armónico.'
          },
          {
            type: 'quiz',
            theoryId: 'secondary_dominants',
            question: 'En `Dsus4` ("Re suspendido cuatro"), ¿qué nota reemplaza temporalmente a la 3ª Mayor (Fa#) antes de resolver a Re Mayor?',
            options: [
              'La 4ª justa (Sol · 1ª cuerda traste 3 = cód. 13)',
              'La 7ª menor (Do)',
              'Mi grave',
              'Si bemol'
            ],
            correctIndex: 0,
            explanation: '¡Teoría precisa! "sus4" sustituye la 3ª por la 4ª del acorde (Sol), generando suspensión luminosa que resuelve bajando al traste 2 (Fa#).'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'secondary_dominants',
            title: 'Práctica Moderna: Toca Do add9 (Cadd9)',
            instruction: 'Baja un paso los dedos 1 y 2 desde Sol Mayor manteniendo 3 y 4 anclados (`x32033`).',
            chord: 'Cadd9'
          }
        ]
      }
    ]
  },

  // ============================================================================
  // UNIDAD 9: ESCALAS, IMPROVISACIÓN Y PUNTEOS COMPLETOS (4 LECCIONES)
  // ============================================================================
  {
    id: 'unit_9',
    number: 9,
    title: 'Escalas, Improvisación y Punteos Completos',
    subtitle: 'Pentatónica Am/C, Modo Mixolidio Vallenato, Menor Armónica y montaje de repertorio completo',
    color: '#CE82FF',
    borderColor: '#A55EEA',
    icon: '🚀',
    sourceBook: 'Fran Cordón, Keyner Ramírez & Repertorio Maestro',
    lessons: [
      {
        id: 'u9_l1',
        title: 'La Caja 1 Pentatónica (Traste 5: Am ↔ Do Mayor)',
        icon: '🧭',
        xp: 50,
        summary: 'Domina el mapa maestro de 2 notas por cuerda donde ninguna nota choca con el acorde.',
        steps: [
          {
            type: 'theory',
            theoryId: 'scales_improvisation_mixolydian',
            badge: 'Improvisación Segura · Caja Traste 5',
            title: 'Cinco notas mágicas que sirven tanto en La Menor como en Do Mayor',
            body: `La **Escala Pentatónica Menor** (\` + '\`1 - b3 - 4 - 5 - b7\`' + \`) elimina los semitonos más tensos de la escala mayor.\nEn el **Traste 5** construyes un dibujo simétrico de **2 notas por cuerda**:\n• 6ª: \`5 - 8\` | 5ª: \`5 - 7\` | 4ª: \`5 - 7\` | 3ª: \`5 - 7\` | 2ª: \`5 - 8\` | 1ª: \`5 - 8\`.\nComo **Am** y **C** son relativos, ¡este único dibujo improvisa solos para "Los Caminos de la Vida", "La Gota Fría" Y cantos en Do Mayor!`,
            highlightBox: 'Si terminas tu frase en el traste 5 (cuerda 6ª o 1ª = La) reposa en Am; si terminas en traste 8 o 5 de 3ª (= Do) reposa en C.',
            actionTarget: { tab: 'tabs', itemId: 'tab_mapa_pentatonico', label: 'Practicar Mapa Pentatónico en TAB' }
          },
          {
            type: 'quiz',
            theoryId: 'scales_improvisation_mixolydian',
            question: '¿Por qué las notas de la Pentatónica Menor de La (`A - C - D - E - G`) funcionan tan bien sobre una canción en DO MAYOR (`C - G - Am - F`)?',
            options: [
              'Por casualidad acústica sin explicación',
              'Porque Do Mayor (C) y La Menor (Am) son tonalidades relativas y sus escalas pentatónicas contienen exactamente las mismas 5 notas',
              'Porque solo tiene notas con sostenidos',
              'Porque la guitarra se desafina automáticamente'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! Lo único que cambia entre Pentatónica Mayor de C y Menor de Am es sobre cuál nota descansa el final de tus frases.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'scales_improvisation_mixolydian',
            question: 'Ubica la Tónica LA (A) que inicia la Caja 1 Pentatónica en la 6ª cuerda traste 5:',
            targetString: 6,
            targetFret: 5,
            hint: '6ª cuerda arriba del diapasón, traste 5.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'scales_improvisation_mixolydian',
            question: 'Ubica la nota DO (C) aguda en la esquina de la Caja 1 (1ª cuerda traste 8 · código 18):',
            targetString: 1,
            targetFret: 8,
            hint: '1ª cuerda abajo, traste 8 (uno después del punto guía del traste 7).'
          },
          {
            type: 'play_guitar_note',
            theoryId: 'scales_improvisation_mixolydian',
            title: 'Verifica la Nota Base: La4 en la 1ª cuerda traste 5 ("15")',
            instruction: 'Pisa 1ª cuerda espacio 5 con el dedo 1 y hazla vibrar limpia.',
            targetMidi: 69,
            targetLabel: 'A4 (La 440 Hz · Cód. 15)'
          }
        ]
      },
      {
        id: 'u9_l2',
        title: 'Modo Mixolidio Vallenato y Menor Armónica (E7 → Am)',
        icon: '🪗',
        xp: 50,
        summary: 'Captura el sabor diatónico del acordeón de Diomedes/Escalona y la sensible de Cumbia.',
        steps: [
          {
            type: 'theory',
            theoryId: 'scales_improvisation_mixolydian',
            badge: 'ADN Melódico Colombiano · Escalas Modales',
            title: 'Las dos alteraciones que separan a un novato del sonido vallenato real',
            body: `• **Modo Mixolidio (\`1 - 2 - 3 - 4 - 5 - 6 - b7\`)**: igual a la escala Mayor salvo la **7ª bemol (b7)**. Suena igual a un acordeón diatónico haciendo pases sobre acordes V7 (ej. nota **Fa natural** cuando improvisas en **Sol**).\n• **Escala Menor Armónica**: en tonalidad de **Am**, cuando entra el acorde dominante **E7**, sustituye **Sol natural por Sol sostenido (\`3ª cuerda traste 1\` = cód. 31)** para que el punteo abrace perfectamente la tensión!`,
            highlightBox: 'Comprueba esa magia en el paso #15 de nuestra TAB de "La Gota Fría": la nota Sol# sobre E7 electriza toda la frase.',
            actionTarget: { tab: 'fretboard', itemId: 'scales', label: 'Ver Modo Mixolidio en el Mástil' }
          },
          {
            type: 'quiz',
            theoryId: 'scales_improvisation_mixolydian',
            question: 'En comparación con la Escala Mayor clásica (`1-2-3-4-5-6-7`), ¿qué única nota cambia en el Modo Mixolidio típico del acordeón vallenato?',
            options: [
              'La 3ª se vuelve menor',
              'La 7ª se rebaja medio tono (7ª bemol / b7)',
              'Se elimina la 5ª justa',
              'La 2ª se vuelve aumentada'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! Esa séptima menor (`b7`) coincide con el acorde dominante `V7`, dando el sabor caribeño brillante del vallenato mayor.'
          },
          {
            type: 'quiz',
            theoryId: 'scales_improvisation_mixolydian',
            question: 'Cuando tocas "La Gota Fría" o "La Piragua" en LA MENOR (`Am`) y entra el acorde E7 (`5ª de La`), ¿qué nota clave de la Escala Menor Armónica debes pisar?',
            options: [
              'Sol sostenido (G# · 3ª cuerda traste 1 = código 31)',
              'Do sostenido',
              'Fa natural',
              'Mi bemol'
            ],
            correctIndex: 0,
            explanation: '¡Oído agudo! Sol# es la 3ª mayor de E7 y la nota sensible que tira con fuerza de regreso hacia La Menor.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'scales_improvisation_mixolydian',
            question: 'Marca esa nota sensible SOL# (G#) en 3ª cuerda traste 1 (código Keyner 31):',
            targetString: 3,
            targetFret: 1,
            hint: '3ª cuerda desde abajo, primer traste.'
          }
        ]
      },
      {
        id: 'u9_l3',
        title: 'Montaje de Punteos: "Los Caminos de la Vida" y "La Gota Fría"',
        icon: '⚡',
        xp: 55,
        summary: 'Une escalas, ligados y cambios de posición en las dos intros vallenatas más queridas.',
        steps: [
          {
            type: 'theory',
            theoryId: 'tab_reading_techniques',
            badge: 'Repertorio Estrella · Punteo Vallenato',
            title: 'Cómo estudiar un punteo rápido sin frustrarte',
            body: `Para dominar intros largas como **"Los Caminos de la Vida"** (trastes 8→1 en 1ª cuerda) o **"Espumas"** (trastes 0→2→3):\n1. **Divide en micro-frases**: marca un **Loop A–B** en la pestaña Tablaturas cada 4–6 notas.\n2. **Velocidad 50% o 75%**: hasta que los dedos caigan solos sin mirar.\n3. Activa **🎸 Practicar con mi Guitarra (Espera mi Guitarra)** conectando tu guitarra/micrófono: la app no avanza hasta que la nota suene afinada.`,
            highlightBox: 'Cambia el timbre del Reproductor TAB a "Acordeón Vallenato" o "Requinto Acústico" para afinar tu oído frase a frase.',
            actionTarget: { tab: 'tabs', itemId: 'tab_caminos_vida', label: 'Ensayar TAB "Los Caminos de la Vida"' }
          },
          {
            type: 'quiz',
            theoryId: 'tab_reading_techniques',
            question: 'En el inicio del punteo de "Los Caminos de la Vida" (`10 → 18 → 17 → 15 → 13 → 11` en 1ª cuerda), ¿qué notas recorre esa cascada descendente?',
            options: [
              'Mi al aire → Do → Si → La → Sol → Fa (descendiendo sobre Am → Dm)',
              'Do sostenido → Re# → Fa#',
              'Sol → Si → Re exclusivamente',
              'Mi grave → La grave'
            ],
            correctIndex: 0,
            explanation: '¡Exacto! Salta a la octava alta Do (tr.8 = 18) y desciende diatónicamente por toda la 1ª cuerda hasta resolver en Fa sobre Dm.'
          },
          {
            type: 'quiz',
            theoryId: 'keyner_semichords_scale',
            question: 'Cuál es la técnica más efectiva cuando un pasaje de tablatura se traba por cambio rápido de trastes:',
            options: [
              'Subir la velocidad al 125% esperando acertar por suerte',
              'Usar un Loop A–B sobre esas 4–6 notas al 50%–75% de velocidad y el modo "Espera mi Guitarra" hasta automatizarlo',
              'Cambiar la afinación de la 1ª cuerda',
              'Saltarse siempre esa frase'
            ],
            correctIndex: 1,
            explanation: '¡Metodología inteligente! La memoria muscular se graba limpia en cámara lenta y luego acelera sola.'
          },
          {
            type: 'fretboard_find',
            theoryId: 'tab_reading_techniques',
            question: 'Marca la nota clímax inicial de "Los Caminos de la Vida": Do agudo en 1ª cuerda traste 8 (18):',
            targetString: 1,
            targetFret: 8,
            hint: '1ª cuerda abajo, traste 8.'
          }
        ]
      },
      {
        id: 'u9_l4',
        title: 'Gran Síntesis Intermedia: Repertorio de Misa + Parranda',
        icon: '🏆',
        xp: 75,
        summary: 'Demuestra tu dominio integral combinando teoría, diapasón, método Keyner y oído vivo.',
        steps: [
          {
            type: 'theory',
            theoryId: 'keyner_harmonic_relations',
            badge: 'Graduación Intermedia CuerdaViva!',
            title: 'Tu caja de herramientas completa de guitarrista',
            body: `Ya cuentas con el arsenal completo del guitarrista intermedio:\n• **Lectura Triple**: Tablatura moderna, Cifrado Americano/Latino y **Método Numérico 10–60 de Keyner Ramírez**.\n• **Control Rítmico Total**: 4/4, 2/4, 3/4, 6/8, Chasquido, Arpegios Carulli y **Bajos Alternos B1/B2** en Paseo, Merengue, Cumbia, Porro y Pasillo.\n• **Armonía Funcional**: Dominantes Secundarios (\` + '\`V7/IV, V7/VI\`' + \`), Slash Chords, \` + '\`DIS.\`' + \`, Cejilla CAGED y Pentatónica/Mixolidia.`,
            highlightBox: '¡No olvides culminar el Reto de 30 Días para generar tu Diploma oficial imprimible!',
            actionTarget: { tab: 'guitar3d', itemId: 'keyner_map', label: 'Abrir Mapa 3D Interactivo + Tablas Keyner' }
          },
          {
            type: 'quiz',
            theoryId: 'keyner_numeric_grid',
            question: 'Para finalizar con broche de oro el Método Keyner: ¿qué cuerda, traste y nota exacta es el código "23"?',
            options: [
              '3ª cuerda traste 2 (La)',
              '2ª cuerda (Si) en el espacio/traste 3 — nota Re4 (D4)',
              '6ª cuerda traste 2 (Fa#)',
              '2ª cuerda al aire'
            ],
            correctIndex: 1,
            explanation: '¡Exacto! 2 = 2ª cuerda (Si); +3 trastes (Si → Do → Do# → Re) = nota Re4 (D4).'
          },
          {
            type: 'quiz',
            theoryId: 'homonymous_modulation_dim',
            question: 'Si acompañas un Pasillo ("Oropel" o "Pueblito Viejo") que modula de Em → E (o Am → A), ¿qué cambia en tu acorde Tónica?',
            options: [
              'Baja 5 trastes en bloque',
              'Su 3ª menor sube 1 semitono a 3ª Mayor manteniendo la misma tónica, transformando la tristeza en luminosidad',
              'Se vuelve acorde disminuido todo el coro',
              'Cambia el compás de 3/4 a 4/4 siempre'
            ],
            correctIndex: 1,
            explanation: '¡Excelente dominio teórico y práctico!'
          },
          {
            type: 'quiz',
            theoryId: 'barre_chords_biomechanics',
            question: 'Si deslizas la cejilla móvil Forma E desde Fa (traste 1) hasta el traste 3 manteniendo exactamente la misma digitación, ¿qué acorde tocas?',
            options: [
              'Sol Mayor (G)',
              'La Menor',
              'Re Mayor',
              'Si Séptima'
            ],
            correctIndex: 0,
            explanation: '¡Sistema CAGED dominado! 6ª traste 1 = F → traste 2 = F# → traste 3 = G (Sol Mayor).'
          },
          {
            type: 'play_guitar_chord',
            theoryId: 'harmonic_circle_basic',
            title: 'Acorde Final de Concierto: Sol Mayor (G / SOL+)',
            instruction: 'Haz sonar tu guitarra con plenitud y celebra todo tu recorrido intermedio.',
            chord: 'G'
          }
        ]
      }
    ]
  }
];

// ============================================================================
// RETO INTERACTIVO DE 30 DÍAS (Integrado desde Bono 4 + Folclor + Keyner)
// ============================================================================
export const RETO_30_DIAS = [
  { day: 1,  week: 1, title: 'Afinación, Anatomía 3D y Postura Consciente', focus: 'Explora la Guitarra 3D, conecta tu guitarra o micrófono y afina las 6 cuerdas (E-A-D-G-B-e).', minutes: 15, actionTab: 'guitar3d', xp: 20 },
  { day: 2,  week: 1, title: 'Tus Primeros 2 Amigos: Em y Am', focus: 'Practica cambiar 20 veces lentas entre Mi menor (Em) y La menor (Am) cuidando arquear los dedos.', minutes: 15, actionTab: 'fretboard', xp: 20 },
  { day: 3,  week: 1, title: 'El Acorde Rey: Sol Mayor (G) y Re Mayor (D)', focus: 'Aprende el dedo pivote en 2ª cuerda traste 3 para cambiar entre G y D sin mirar.', minutes: 15, songId: 'reto_alabare', xp: 25 },
  { day: 4,  week: 1, title: 'El Vaivén de Mano Derecha (Balada Básica)', focus: 'Domina el rasgueo ↓ · ↓ ↑ · ↑ ↓ ↑ ("VOY PIE-DRA TA-PIE-DRA") a 72 BPM sobre Em y G.', minutes: 15, rhythmId: 'pop_folk', xp: 25 },
  { day: 5,  week: 1, title: 'Tu Primera Alabanza: Alabaré a mi Señor', focus: 'Une G, Em, C y D7 con marcha alegre. ¡No detengas la mano derecha aunque un dedo tarde en llegar!', minutes: 20, songId: 'reto_alabare', xp: 30 },
  { day: 6,  week: 1, title: 'Escala de Do en Método Numérico Keyner (10–60)', focus: 'Toca la escala 53-40-42-43-30-32-20-21... de Keyner Ramírez con el modo Método Keyner en Tablaturas.', minutes: 15, tabId: 'tab_keyner_escala_do', xp: 25 },
  { day: 7,  week: 1, title: 'Hito Semana 1: Vive Jesús el Señor', focus: 'Toca de principio a fin "Vive Jesús" acompañando con la línea de tiempo de progresiones.', minutes: 20, songId: 'reto_vive_jesus', xp: 35 },

  { day: 8,  week: 2, title: 'Do Mayor (C) Cristalino y Puente a Am', focus: 'Practica el cambio de 1 solo dedo entre C y Am + Dm y G7 (Círculo de Do).', minutes: 15, songId: 'ms_tan_cerca_de_mi', xp: 25 },
  { day: 9,  week: 2, title: 'Tan Cerca de Mí (Progresión I - V - VIm)', focus: 'Practica el puente con bajo caminante C → G/B → Am en "Tan Cerca de Mí".', minutes: 20, songId: 'ms_tan_cerca_de_mi', tabId: 'tab_tan_cerca_de_mi', xp: 30 },
  { day: 10, week: 2, title: 'Compás de 6/8: Pescador de Hombres', focus: 'Siente el balanceo pastoral de 6/8 y aprende la melodía en TAB de "Pescador de Hombres".', minutes: 20, songId: 'ms_pescador_hombres', tabId: 'tab_pescador_hombres', xp: 30 },
  { day: 11, week: 2, title: 'Compás de Vals 3/4 y Bajos B1/B2 (Eran Cien Ovejas)', focus: 'Alterna el pulgar entre Bajo Primario y Secundario en "Eran Cien Ovejas" y "Pueblito Viejo".', minutes: 15, songId: 'ms_100_ovejas', rhythmId: 'vals', xp: 25 },
  { day: 12, week: 2, title: 'Atajo Inteligente para Fa (Fmaj7) y Junto a Ti María', focus: 'Domina Fmaj7 / Fa fácil y toca el himno mariano "Junto a Ti María" + su punteo.', minutes: 20, songId: 'ms_junto_a_ti_maria', tabId: 'tab_junto_a_ti_maria', xp: 30 },
  { day: 13, week: 2, title: 'El Chasquido Percusivo (✕) en Cantos de Entrada', focus: 'Entrena el golpe de palma + uñas en tiempos 2 y 4 para cantos festivos.', minutes: 15, rhythmId: 'pop_apagado', xp: 25 },
  { day: 14, week: 2, title: 'Hito Semana 2: Cinco Panes y Dos Peces', focus: 'Domina el emocionante dominante secundario B7 → Em en el coro de "Cinco Panes y Dos Peces".', minutes: 20, songId: 'ms_5_panes', xp: 35 },

  { day: 15, week: 3, title: 'Arpegio Clásico p-i-m-a-m-i de Carulli', focus: 'Asigna cada dedo a su cuerda fija y practica el estudio de arpegios sin mirar tu mano derecha.', minutes: 15, tabId: 'tab_carulli_arpegio', rhythmId: 'arp_44_pima', xp: 30 },
  { day: 16, week: 3, title: 'Hora Santa en Arpegio: Nadie Te Ama Como Yo', focus: 'Acompaña con delicadeza en arpegio y puntea la introducción de Martín Valverde.', minutes: 20, songId: 'ms_nadie_te_ama', tabId: 'tab_nadie_te_ama', xp: 35 },
  { day: 17, week: 3, title: 'Dios Está Aquí y el Círculo de Re (Bm)', focus: 'Usa Bm7 abierto o tu primera media cejilla para tocar y puntear "Dios Está Aquí".', minutes: 20, songId: 'ms_dios_esta_aqui', tabId: 'tab_dios_esta_aqui', xp: 35 },
  { day: 18, week: 3, title: 'Pasillo Libro Keyner: Espumas y Oropel (DIS.)', focus: 'Explora el acorde Disminuido (DIS.) y el rasgueo de Pasillo Andino en las piezas de Jorge Villamil.', minutes: 20, songId: 'col_espumas', tabId: 'tab_keyner_espumas', xp: 35 },
  { day: 19, week: 3, title: '¡Bienvenido a Valledupar! El Paseo Vallenato', focus: 'Aprende el patrón B1 ↑ ✕ ↑ B2 ↑ ↓ ↑ acompañado por nuestra Caja Vallenata y Guacharaca.', minutes: 20, rhythmId: 'paseo_vallenato', tabId: 'tab_bajeo_vallenato', xp: 35 },
  { day: 20, week: 3, title: 'Tu Primer Vallenato Completo: Los Caminos de la Vida', focus: 'Combina el círculo menor vallenato (Am-Dm-G-C-E7) con el punteo icónico de Omar Geles.', minutes: 25, songId: 'val_caminos_vida', tabId: 'tab_caminos_vida', xp: 40 },
  { day: 21, week: 3, title: 'Hito Semana 3: La Gota Fría y Matilde Lina', focus: 'Disfruta el diálogo I ↔ V7 de Rafael Escalona y Leandro Díaz con punteos tradicionales.', minutes: 25, songId: 'val_gota_fria', tabId: 'tab_gota_fria', xp: 40 },

  { day: 22, week: 4, title: 'Calentamiento Intermedio: La Arañita 1-2-3-4 (Becerra)', focus: 'Fortalece el meñique y la coordinación de ambas manos a 80 y 96 BPM.', minutes: 15, tabId: 'tab_aranita_becerra', xp: 30 },
  { day: 23, week: 4, title: 'Cejilla sin Dolor: Conquistando F y Bm Completos', focus: 'Aplica el giro lateral del índice y el peso del brazo en "Ángeles de Dios" o "Renuévame".', minutes: 20, songId: 'reto_renuevame', xp: 40 },
  { day: 24, week: 4, title: 'Cumbia Colombiana: La Piragua y El Año Viejo (Keyner)', focus: 'Siente el contratiempo del tambor llamador y toca el bordoneo clásico de cumbia y parranda.', minutes: 20, songId: 'col_la_piragua', tabId: 'tab_keyner_el_ano_viejo', xp: 40 },
  { day: 25, week: 4, title: 'Vallenato Lírico & Vals: Pueblito Viejo y Ausencia Sentimental', focus: 'Domina la modulación Am → A de José A. Morales y el paseo poético de Silvio Brito.', minutes: 25, songId: 'col_pueblito_viejo', tabId: 'tab_keyner_pueblito_viejo', xp: 45 },
  { day: 26, week: 4, title: 'Porro Festivo: Carmen de Bolívar y Colombia Tierra Querida', focus: 'Ejecuta las modulaciones de Lucho Bermúdez con rasgueo brillante de porro sabanero.', minutes: 20, songId: 'col_carmen_de_bolivar', tabId: 'tab_keyner_carmen_bolivar', xp: 40 },
  { day: 27, week: 4, title: 'Merengue Vallenato (6/8) y Bambuco Andino', focus: 'Acelera tu muñeca derecha alternando 6/8 caribeño (Casa en el Aire) y síncopa andina.', minutes: 20, songId: 'val_casa_en_el_aire', rhythmId: 'merengue_vallenato', xp: 40 },
  { day: 28, week: 4, title: 'Mapa Pentatónico e Improvisación en el Mástil', focus: 'Aprende la Caja 1 Pentatónica en el traste 5 y juega 3 rondas de "Caza-Notas" con tu guitarra.', minutes: 20, tabId: 'tab_mapa_pentatonico', actionTab: 'fretboard', xp: 45 },
  { day: 29, week: 4, title: 'Transposición, Capotraste y Tabla de Keyner en Vivo', focus: 'Toma 2 alabanzas y 1 vallenato y transpórtalos al tono ideal de tu propia voz.', minutes: 20, songId: 'col_oropel', xp: 40 },
  { day: 30, week: 4, title: '🏆 Gran Concierto Final: Alabanza, Pasillo y Folclor', focus: '¡Toca un repertorio continuo de 2 Alabanzas Católicas + 2 Clásicos Colombianos para graduarte!', minutes: 30, songId: 'val_sin_medir_distancias', xp: 100 }
];
