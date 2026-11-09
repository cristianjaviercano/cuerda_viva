// ============================================================================
// js/songs-db.js
// Repertorio Maestro de Progresiones y Canciones:
// 1. Alabanzas y Adoración Católica (Canciones Estrella + Catálogo Cancionero Digital)
// 2. Vallenatos Clásicos y Románticos Colombianos
// 3. Cumbias y Porros del Folclor Colombiano
// ============================================================================

export const MASTER_SONGS = [
  // ==========================================================================
  // ALABANZAS Y ADORACIÓN CATÓLICA (DESTACADAS CON TEORÍA Y TAB VINCULADA)
  // ==========================================================================
  {
    id: 'ms_dios_esta_aqui',
    title: 'Dios Está Aquí',
    author: 'Alabanza Católica Tradicional (Cancionero Digital)',
    category: 'catolica',
    liturgicalType: 'Adoración',
    key: 'D',
    rhythmId: 'balada_pop',
    bpm: 74,
    difficulty: 1,
    featured: true,
    linkedTabId: 'tab_dios_esta_aqui',
    youtubeQuery: 'dios esta aqui guitarra tutorial acordes rasgueo',
    theoryNote: 'Progresión tipo Canon con Dominante Secundario: observa cómo después de Bm aparece D7 (V7/IV) para empujar con mucha emoción hacia Sol Mayor (IV).',
    progressionLoop: ['D', 'A', 'Bm', 'D7', 'G', 'A', 'D', 'A7'],
    content: `CORO
[D]Dios está a[A]quí, [Bm] [D7]
tan [G]cierto como el [A]aire que res[D]piro, [D7]
tan [G]cierto como [A]la mañana [D]se le[Bm]vanta,
tan [G]cierto como [A]que este canto lo [D]puedes o[A]ír.

ESTROFA 1
Lo [D]puedes sen[A]tir movién[Bm]dose entre los que [D7]aman,
lo [G]puedes o[A]ír can[D]tando con no[D7]sotros a[G]quí.
Lo [G]puedes lle[A]var cuando por [F#m]esa puerta [Bm]salgas,
lo [Em]puedes guar[A]dar muy [D]dentro de tu [A7]corazón.

ESTROFA 2
No lo [D]sientes en el [A]aire que res[Bm]piras, [D7]
no lo [G]sientes en el [A]canto de un go[D]rrión, [D7]
si lo [G]sientes a tu [A]lado, a tu [F#m]lado está el Se[Bm]ñor,
si lo [Em]sientes, [A]canta esta can[D]ción.`
  },

  {
    id: 'ms_5_panes',
    title: 'Cinco Panes y Dos Peces',
    author: 'Cancionero Digital — Canciones Nuevas',
    category: 'catolica',
    liturgicalType: 'Ofertorio',
    key: 'G',
    rhythmId: 'pop_folk',
    bpm: 84,
    difficulty: 1,
    featured: true,
    youtubeQuery: 'cinco panes y dos peces yo soy un mendigo guitarra tutorial',
    theoryNote: 'En el coro aparece B7 (Si séptima): es el Dominante Secundario V7/VI que prepara con fuerza emotiva la caída a Mi menor ("Dale de comer a mis hermanos").',
    progressionLoop: ['G', 'D', 'Em', 'C', 'G', 'B7', 'Em', 'D'],
    content: `ESTROFA 1
[G]Yo soy un mendigo de tu [D]gracia, [Em]
soy sólo un ladrón de tu a[C]mor.
[G]Perderte sería mi des[D]gracia, [Em]
no te vayas nunca mi Se[C]ñor. [D]

CORO
Se[C]ñor, tengo [D]cinco panes y dos [G]peces,
[C]y veo tanta [D]hambre a mi alrede[G]dor.
[C]Lo pongo en tus [D]manos,
[G]dale de co[B7]mer a mis her[Em]manos,
a[C]quí está tu [D]siervo, mi Se[G]ñor.

ESTROFA 2
[G]Y cuando te pierdo, pierdo la [D]calma, [Em]
soy un débil que se protege en [C]Dios.
[G]En tu amor se limpia toda mi [D]alma, [Em]
soy un ambicioso, lléname de [C]Vos. [D]`
  },

  {
    id: 'ms_100_ovejas',
    title: 'Eran Cien Ovejas',
    author: 'Cancionero Digital — Canciones Nuevas',
    category: 'catolica',
    liturgicalType: 'Comunión',
    key: 'D',
    rhythmId: 'vals',
    bpm: 98,
    difficulty: 1,
    featured: true,
    youtubeQuery: 'eran cien ovejas guitarra tutorial acordes vals',
    theoryNote: 'Clásico Vals en 3/4 (Bajo en 1, rasgueos en 2 y 3). El paso G → Gm (IV Mayor → IV menor) se llama "Intercambio Modal" y pinta la tristeza del pastor buscando su oveja.',
    progressionLoop: ['D', 'A7', 'D', 'D7', 'G', 'Gm', 'D', 'A7'],
    content: `ESTROFA 1
[D]Eran cien ovejas que había en el re[A7]baño,
eran cien ovejas que un pastor cui[D]dó,
pero una [D7]tarde, al contarlas [G]todas, [Gm]
le faltaba [D]una, [Bm]le faltaba [Em]una y [A7]triste llo[D]ró.

CORO
Las noventa y [A7]nueve dejó en el a[D]prisco
y por las mon[A7]tañas a buscarla [D]fue;
la encontró gi[D7]miendo, temblando de [G]frío, [Gm]
la tomó en sus [D]brazos, [Bm]ungió sus he[Em]ridas
y al [A7]redil vol[D]vió.

ESTROFA 2
[D]Yo era esa oveja que andaba per[A7]dida,
lejos de mi Cristo, lejos de Je[D]sús,
pero un día el [D7]Maestro me tendió su [G]mano, [Gm]
me tomó en sus [D]brazos, [Bm]ungió mis he[Em]ridas y al [A7]redil vol[D]ví.`
  },

  {
    id: 'ms_alma_misionera',
    title: 'Alma Misionera',
    author: 'Cancionero Digital #9',
    category: 'catolica',
    liturgicalType: 'Misiones',
    key: 'G',
    rhythmId: 'pop_folk',
    bpm: 88,
    difficulty: 1,
    featured: true,
    linkedTabId: 'tab_alma_misionera',
    youtubeQuery: 'alma misionera guitarra tutorial acordes',
    theoryNote: 'Usa la progresión de oro I → V → VIm → IV (G → D → Em → C), ¡100% libre de cejillas! Con esta misma progresión puedes tocar decenas de alabanzas.',
    progressionLoop: ['G', 'D', 'Em', 'C', 'G', 'D', 'G', 'D7'],
    content: `ESTROFA 1
Se[G]ñor, [D]toma mi vida [Em]nueva
[C]antes de que la es[G]pera
des[C]gaste años en [D]mí.
Es[G]toy dispuesto a [D]lo que quieras,
[Em]no importa lo que [C]sea,
Tú [G]llámame a [D]ser[G]vir. [D7]

CORO
Lléva[G]me donde los [D]hombres
nece[Em]siten tus pa[C]labras,
nece[G]siten mis [C]ganas de vi[D]vir.
Donde [G]falte la espe[D]ranza,
donde [Em]todo sea [C]triste
simple[G]mente por no sa[D]ber de [G]Ti.

ESTROFA 2
Te [G]doy mi cora[D]zón sincero
[Em]para gritar sin [C]miedo
lo her[G]moso que es tu a[D]mor.
Se[G]ñor, tengo [D]alma misionera,
[Em]condúceme a la [C]tierra
que [G]tenga [D]sed de [G]Vos.`
  },

  {
    id: 'ms_pescador_hombres',
    title: 'Pescador de Hombres',
    author: 'Cesáreo Gabaráin (Cancionero Digital rc_27)',
    category: 'catolica',
    liturgicalType: 'Comunión',
    key: 'C',
    rhythmId: 'seis_ocho',
    bpm: 58,
    difficulty: 1,
    featured: true,
    linkedTabId: 'tab_pescador_hombres',
    youtubeQuery: 'pescador de hombres guitarra acordes 6/8 tutorial',
    theoryNote: 'En compás de 6/8 ondulante como las olas del mar. Fíjate en C7 preparando la entrada del coro en Fa Mayor ("Señor, me has mirado a los ojos").',
    progressionLoop: ['C', 'G', 'Am', 'C7', 'F', 'Dm', 'G', 'G7'],
    content: `ESTROFA 1
[C]Tú [G]has venido a la o[Am]rilla, [C7]
no has bus[F]cado ni a [Dm]sabios ni a [G]ricos, [G7]
tan sólo [C]quieres [G]que yo te [Am]siga. [C7]

CORO
Se[F]ñor, [G]me has mirado a los [C]ojos, [Am]
sonri[Dm]endo [G]has dicho mi [C]nombre, [C7]
en la a[F]rena [G]he dejado mi [C]barca, [Am]
junto a [Dm]Ti [G7]buscaré otro [C]mar.

ESTROFA 2
[C]Tú [G]sabes bien lo que [Am]tengo, [C7]
en mi [F]barca no hay [Dm]oro ni es[G]pada, [G7]
tan sólo [C]redes [G]y mi tra[Am]bajo. [C7]`
  },

  {
    id: 'ms_junto_a_ti_maria',
    title: 'Junto a Ti, María',
    author: 'Kairoi (Cancionero Digital #5)',
    category: 'catolica',
    liturgicalType: 'María',
    key: 'D',
    rhythmId: 'arp_44_pima',
    bpm: 72,
    difficulty: 2,
    featured: true,
    linkedTabId: 'tab_junto_a_ti_maria',
    youtubeQuery: 'junto a ti maria guitarra arpegio acordes',
    theoryNote: 'Progresión del Canon de Pachelbel en Re Mayor: D (I) → A (V) → Bm (VIm) → F#m (IIIm) → G (IV) → D (I) → E/Em → A (V). ¡Ideal para practicar cejillas Bm y F#m!',
    progressionLoop: ['D', 'A', 'Bm', 'F#m', 'G', 'D', 'Em', 'A'],
    content: `ESTROFA 1
Junto a [D]ti, Ma[A]ría, como un [Bm]niño quiero es[F#m]tar,
tóma[G]me en tus [D]brazos, guía[Em]me en mi cami[A]nar.
Quiero [D]que me e[A]duques, que me en[Bm]señes a re[F#m]zar,
hazme [G]transpa[D]rente, lléna[A]me de [D]paz.

CORO
[D]Ma[A]dre, [Bm]Ma[F#m]dre, [G]Ma[D]dre, [Em]Ma[A]dre,
[D]Ma[A]dre, [Bm]Ma[F#m]dre, [G]Ma[D]dre, [A]Ma[D]dre.

ESTROFA 2
Gracias, [D]Madre [A]mía, por lle[Bm]varnos a Je[F#m]sús,
haznos [G]más hu[D]mildes, tan sen[Em]cillos como [A]tú.
Gracias, [D]Madre [A]mía, por a[Bm]brir tu cora[F#m]zón,
porque [G]nos con[D]gregas y nos [A]das tu a[D]mor.`
  },

  {
    id: 'ms_nadie_te_ama',
    title: 'Nadie Te Ama Como Yo',
    author: 'Martín Valverde',
    category: 'catolica',
    liturgicalType: 'Adoración',
    key: 'C',
    rhythmId: 'balada_bajo',
    bpm: 68,
    difficulty: 1,
    featured: true,
    linkedTabId: 'tab_nadie_te_ama',
    youtubeQuery: 'nadie te ama como yo guitarra tutorial martin valverde',
    theoryNote: 'Usa el acorde G/B (Sol con bajo en Si) entre Do y La menor para crear una escalera melódica perfecta en los bajos: Do → Si → La.',
    progressionLoop: ['C', 'G/B', 'Am', 'F', 'Dm', 'G7'],
    content: `ESTROFA 1
[C]Cuánto he espe[G/B]rado este mo[Am]mento,
[F]cuánto he espe[Dm]rado que estu[G7]vieras así.
[C]Cuánto he espe[G/B]rado que me ha[Am]blaras,
[F]cuánto he espe[Dm]rado que vi[G7]nieras a mí.

[C]Yo sé bien lo [G/B]que has vi[Am]vido,
[F]yo sé bien por [Dm]qué has llo[G7]rado;
[C]yo sé bien lo [G/B]que has su[Am]frido,
[F]pues de tu [Dm]lado no me [G7]he ido.

CORO
Pues [C]nadie te [G/B]ama como [Am]yo,
pues [F]nadie te [Dm]ama como [G7]yo;
mira la [C]cruz, esa es mi [G/B]más grande [Am]prueba,
nadie te [F]ama [G7]como [C]yo.

Pues [C]nadie te [G/B]ama como [Am]yo,
pues [F]nadie te [Dm]ama como [G7]yo;
mira la [C]cruz, fue por [G/B]ti, porque te [Am]amo,
nadie te [F]ama [G7]como [C]yo.`
  },

  {
    id: 'ms_milagro_amor',
    title: 'Milagro de Amor (Jesús, aquí presente)',
    author: 'María Constanza Fernández (Adoración Colombiana)',
    category: 'catolica',
    liturgicalType: 'Adoración Eucarística',
    key: 'G',
    rhythmId: 'balada_pop',
    bpm: 68,
    difficulty: 1,
    featured: true,
    youtubeQuery: 'milagro de amor jesus aqui presente guitarra tutorial',
    theoryNote: 'Himno colombiano de Adoración Eucarística compuesto en Bogotá. Descansa sobre I - V - VIm - IIIm - IV - V (G - D - Em - Bm - C - D).',
    progressionLoop: ['G', 'D', 'Em', 'Bm', 'C', 'Am', 'D7'],
    content: `ESTROFA 1
Je[G]sús, a[D]quí pre[Em]sente en [Bm]forma re[C]al,
te [Am]pido un poco [F]más de fe y de hu[D7]mildad.
Qui[G]siera po[D]der ser [Em]digno de com[Bm]partir
con[C]tigo el mi[Am]lagro más [F]grande de a[D7]mor.

CORO
Mi[G]lagro de a[D]mor tan infi[Em]nito
en que [Bm]Tú, mi [C]Dios, te has [Am]hecho
tan pe[G]queño y tan hu[D7]milde para entrar en mí.
Mi[G]lagro de a[D]mor tan infi[Em]nito
en que [Bm]Tú, mi [C]Dios, te ol[Am]vidas
de tu [C]gloria y de tu [D7]majestad por [G]mí.`
  },

  {
    id: 'ms_tan_cerca_de_mi',
    title: 'Tan Cerca de Mí',
    author: 'Cesáreo Gabaráin',
    category: 'catolica',
    liturgicalType: 'Adoración',
    key: 'C',
    rhythmId: 'balada_pop',
    bpm: 74,
    difficulty: 1,
    featured: true,
    linkedTabId: 'tab_tan_cerca_de_mi',
    youtubeQuery: 'tan cerca de mi guitarra tutorial acordes',
    theoryNote: 'Observa el paso C7 → F → D7 → G: encadena dos Dominantes Secundarios consecutivos (V7/IV y V7/V) creando un ascenso luminoso en el coro.',
    progressionLoop: ['C', 'G', 'Am', 'C7', 'F', 'D7', 'G', 'G7'],
    content: `CORO
[C]Tan cerca de [G]mí, [Am]tan cerca de [C7]mí,
[F]que hasta lo [D7]puedo to[G]car, [G7]
Je[C]sús es[G7]tá a[C]quí.

ESTROFA 1
[C]Le hablaré sin [G]miedo al o[C]ído, [C7]
[F]le contaré las [G]cosas que hay en [C]mí, [Am]
y [Dm]que sólo a [G]Él le intere[C]sarán, [Am]
Él [D7]es más que un mito para [G]mí. [G7]

ESTROFA 2
[C]No busques a [G]Cristo en lo [C]alto, [C7]
[F]ni lo busques [G]en la oscuri[C]dad, [Am]
muy [Dm]dentro de [G]ti, en tu cora[C]zón, [Am]
[D7]puedes adorar a tu Se[G]ñor. [G7]`
  },

  {
    id: 'ms_a_edificar',
    title: 'A Edificar la Iglesia',
    author: 'Corito Alegre (Cancionero Digital — Canciones Nuevas)',
    category: 'catolica',
    liturgicalType: 'Alabanza',
    key: 'E',
    rhythmId: 'marcha',
    bpm: 114,
    difficulty: 1,
    featured: true,
    youtubeQuery: 'a edificar la iglesia guitarra tutorial ritmo alegre',
    theoryNote: '¡Excelente para entrenar la progresión I - IIm - V7 - I en Mi Mayor (E - F#m - B7 - E) con ritmo festivo de marcha/corito!',
    progressionLoop: ['E', 'F#m', 'B7', 'E'],
    content: `CORO
[E]A edificar la iglesia,
a edificar la iglesia,
a edificar la i[F#m]glesia del Se[B7]ñor.

Her[F#m]mano, ven a[B7]yúdame,
her[F#m]mana, ven a[B7]yúdame,
a e[F#m]dificar la I[B7]glesia del Se[E]ñor.

ESTROFA 1
[E]Yo soy la Iglesia, tú eres la Iglesia,
somos la I[F#m]glesia del Se[B7]ñor.
Her[F#m]mano, ven a[B7]yúdame,
her[F#m]mana, ven a[B7]yúdame,
a e[F#m]dificar la I[B7]glesia del Se[E]ñor.`
  },

  {
    id: 'ms_dios_trino',
    title: 'Dios Trino de Amor (En Nombre del Padre)',
    author: 'Cancionero Digital — Canciones Nuevas',
    category: 'catolica',
    liturgicalType: 'Entrada',
    key: 'A',
    rhythmId: 'balada_pop',
    bpm: 80,
    difficulty: 2,
    featured: true,
    youtubeQuery: 'en nombre del padre dios trino guitarra acordes',
    theoryNote: 'Recorre todo el Círculo Armónico Diatónico de La Mayor por cuartas: D (IV) → E7 (V7) → C#m (IIIm) → F#m (VIm) → Bm (IIm) → E7 (V7) → A (I).',
    progressionLoop: ['A', 'A7', 'D', 'E7', 'C#m', 'F#m', 'Bm', 'E7'],
    content: `ESTRIBILLO
[A]En nombre del Padre, [A7]
en nombre del [D]Hijo,
en nombre del [A]Santo Es[E7]píritu,
estamos a[A]quí. [A7]

ESTROFA 1
Para ala[D]bar y agrade[E7]cer,
bende[C#m]cir y ado[F#m]rar,
estamos a[Bm]quí, [E7]a Tu disposi[A]ción. [A7]
Para ala[D]bar y agrade[E7]cer,
bende[C#m]cir y ado[F#m]rar,
estamos a[Bm]quí, Se[E7]ñor, Dios [D]Trino de a[A]mor.`
  },

  {
    id: 'ms_el_alfarero',
    title: 'El Alfarero (Gracias Quiero Darte)',
    author: 'Alabanza Católica Popular',
    category: 'catolica',
    liturgicalType: 'Alabanza',
    key: 'G',
    rhythmId: 'cumbia',
    bpm: 96,
    difficulty: 1,
    featured: true,
    youtubeQuery: 'yo quiero ser senor amado como el barro el alfarero guitarra cumbia',
    theoryNote: 'Muy interpretada en parroquias colombianas a ritmo de Cumbia o Paseo alegre usando únicamente G, D7 y C (I - V7 - IV).',
    progressionLoop: ['G', 'D7', 'C', 'G', 'G7', 'C', 'D7', 'G'],
    content: `ESTROFA 1
[G]Gracias quiero darte por a[D7]marme,
[C]gracias quiero [D7]darte yo a [G]Ti, Se[D7]ñor.
[G]Hoy soy feliz [G7]porque te cono[C]cí,
[G]gracias por a[D7]marme a mí tam[G]bién.

CORO
Yo quiero [G]ser, Señor a[D7]mado,
como el [C]barro en manos [D7]del alfa[G]rero:
toma mi [G7]vida, hazla de [C]nuevo, [Cm]
yo quiero [G]ser un [D7]vaso [G]nuevo.`
  },

  // ==========================================================================
  // VALLENATOS COLOMBIANOS CLÁSICOS Y ROMÁNTICOS
  // ==========================================================================
  {
    id: 'val_caminos_vida',
    title: 'Los Caminos de la Vida',
    author: 'Omar Geles / Los Diablitos',
    category: 'vallenato',
    liturgicalType: 'Paseo Vallenato',
    key: 'Am',
    rhythmId: 'paseo_vallenato',
    bpm: 88,
    difficulty: 1,
    featured: true,
    linkedTabId: 'tab_caminos_vida',
    youtubeQuery: 'los caminos de la vida guitarra acordes rasgueo tutorial',
    theoryNote: '¡La progresión "Círculo de Quintas" más célebre del Vallenato!: Am → Dm → G → C → F → Dm → E7 → Am. Cada acorde cae una cuarta justa arriba del anterior.',
    progressionLoop: ['Am', 'Dm', 'G', 'C', 'F', 'Dm', 'E7', 'Am'],
    content: `INTRO PUNTEO
[Am] [Dm] [G] [C] [F] [Dm] [E7] [Am]

ESTROFA 1
Los ca[Am]minos de la vida
no son como yo pen[Dm]saba,
no son como imagi[G]naba,
no son como yo cre[C]ía.
Los ca[Am]minos de la vida
son muy difícil an[Dm]darlos,
difícil de cami[E7]narlos
y no encuentro la sa[Am]lida. [A7]

PRE-CORO
Yo pen[Dm]saba que la vida era dis[G]tinta,
cuando es[C]taba pequeñito yo cre[F]ía
que las [Dm]cosas eran fácil como a[E7]yer:
que mi [Am]viejita buena se esme[A7]raba
por [Dm]darme todo lo que necesita[E7]ba
y hoy me [Am]doy de cuenta que tan to no es a[E7]sí.

CORO
Porque a mi ma[Am]dre la veo can[Dm]sada
de traba[G]jar por mi hermano y por [C]mí,
y ahora con [F]ganas quisiera ayu[Dm]darla
y por e[E7]lla la pelea hasta el [Am]fin.`
  },

  {
    id: 'val_ausencia_sentimental',
    title: 'Ausencia Sentimental',
    author: 'Rafael Manjarrés / Silvio Brito',
    category: 'vallenato',
    liturgicalType: 'Paseo Vallenato',
    key: 'G',
    rhythmId: 'paseo_vallenato',
    bpm: 84,
    difficulty: 2,
    featured: true,
    linkedTabId: 'tab_ausencia_sentimental',
    youtubeQuery: 'ausencia sentimental guitarra acordes tutorial vallenato',
    theoryNote: 'Himno oficial del Festival de la Leyenda Vallenata. Usa la riqueza armónica clásica de Valledupar: G → B7 → Em → G7 → C → D7 → G (encadenando V7/VI y V7/IV).',
    progressionLoop: ['G', 'B7', 'Em', 'G7', 'C', 'Am', 'D7', 'G'],
    content: `ESTROFA 1
Ya co[G]mienza el Festi[B7]val,
vinieron a invi[Em]tarme,
ya se [G7]van los provin[C]cianos
que estu[D7]dian con[G]migo.
Ayer [B7]tarde que vol[Em]vieron
preferí ne[Bm]garme,
pa' no [C]tener que contarte a [Am]ti los mo[D7]tivos.

PRE-CORO
Yo que [C]tanto lo espe[D7]raba
y ahora que lle[G]gó me ha dado [Em]miedo,
al sa[Am]ber que no ten[D7]dré valor
cuando me [G]entere que tie[G7]nes dueño.

CORO
[C]Ay, qué tris[D7]teza me [G]da,
sentir que [B7]pasa el ca[Em]rro,
y en la ma[Am]drugada el pregón:
"¡Via[D7]jeros para el [G]Valle!". [G7]
[C]Ay, mi pa[D7]rlanda donde es[G]tá,
donde es[E7]tá mi acorde[Am]ón,
mi caja y [D7]mi guacha[G]raca.`
  },

  {
    id: 'val_sin_medir_distancias',
    title: 'Sin Medir Distancias',
    author: 'Gustavo Gutiérrez / Diomedes Díaz',
    category: 'vallenato',
    liturgicalType: 'Paseo Vallenato',
    key: 'D',
    rhythmId: 'paseo_vallenato',
    bpm: 80,
    difficulty: 2,
    featured: true,
    linkedTabId: 'tab_sin_medir_distancias',
    youtubeQuery: 'sin medir distancias guitarra acordes tutorial diomedes',
    theoryNote: 'Obra cumbre del vallenato lírico en Re Mayor. Observa el puente D7 → G → A7 → F#m → Bm → Em → A7 → D: pura poesía armónica diatónica.',
    progressionLoop: ['D', 'F#7', 'Bm', 'D7', 'G', 'Em', 'A7', 'D'],
    content: `ESTROFA 1
La he[D]rida que siempre [F#7]llevo en el [Bm]alma
no ci[G]catriza, inevi[Em]table me marca la [A7]pena
que es inmor[G]tal en un cora[A7]zón sin [D]calma. [A7]

[D]Quisiera olvidar el pa[F#7]sado y volver a [Bm]sonreír,
qui[D7]siera tener en mis [G]manos formas de [A7]vivir,
con el encan[G]to que produce el a[A7]mor lim[D]pio. [D7]

CORO
Solo es[G]peraré que vuel[A7]vas a [F#m]mí, [Bm]
bajo el [Em]cielo azul de [A7]mi Valledu[D]par; [D7]
sin me[G]dir distancias [A7]te quie[F#m]ro a [Bm]ti,
porque [Em]tu recuerdo [A7]no se borra[D]rá.`
  },

  {
    id: 'val_gota_fria',
    title: 'La Gota Fría',
    author: 'Emiliano Zuleta Baquero / Carlos Vives',
    category: 'vallenato',
    liturgicalType: 'Paseo / Merengue',
    key: 'Am',
    rhythmId: 'paseo_vallenato',
    bpm: 102,
    difficulty: 1,
    featured: true,
    linkedTabId: 'tab_gota_fria',
    youtubeQuery: 'la gota fria guitarra acordes rasgueo tutorial',
    theoryNote: '¡Solo 4 acordes abiertos (Am, E7, C, G7)! La alternancia Am ↔ E7 sostiene la piquería tradicional, abriendo al relativo mayor Do (G7 → C) en el coro.',
    progressionLoop: ['Am', 'E7', 'Am', 'G7', 'C', 'E7', 'Am', 'E7'],
    content: `ESTROFA 1
Acordate Mo[Am]ralito de aquel [E7]día
que estuviste en Uru[Am]mita
y no quisiste hacer pa[E7]rada.
Te fuiste de mañani[Am]ta,
sería de la misma [G7]rabia. [C]

CORO
En mis [C]notas soy ex[G7]tenso,
a mí [Dm]nadie me co[Am]rrige;
pa' to[E7]car con Mora[Am]lito
le [E7]llega la gota [Am]fría.

Qué cul[G7]tura, qué cul[C]tura
va a te[E7]ner un indio chu[Am]mila,
que sa[E7]lió de la se[Am]rranía
a ha[E7]cerme pasar ver[Am]güenza.`
  },

  {
    id: 'val_matilde_lina',
    title: 'Matilde Lina',
    author: 'Leandro Díaz',
    category: 'vallenato',
    liturgicalType: 'Paseo Vallenato',
    key: 'G',
    rhythmId: 'paseo_vallenato',
    bpm: 96,
    difficulty: 1,
    featured: true,
    linkedTabId: 'tab_matilde_lina',
    youtubeQuery: 'matilde lina guitarra tutorial acordes leandro diaz',
    theoryNote: 'Leandro Díaz "veía con los ojos del alma". Usa la cadencia clásica costeña G → E7 → Am → D7 → G: súper noble para cantar y acompañar con bajeo.',
    progressionLoop: ['G', 'E7', 'Am', 'D7', 'G', 'C', 'D7', 'G'],
    content: `ESTROFA 1
Un [G]día meditando a [E7]solas pensaba [Am]yo
en [D7]mis tristezas y en mi do[G]lor,
recor[C]dando el bello pa[G]sado
cuando empe[A7]zaba yo a enamo[D7]rar.

Este [G]bello recuerdo [E7]vive en mi pensa[Am]miento,
y es [D7]el que alivia mi sufri[G]miento
cuando me [C]pongo a conside[D7]rar.

CORO
Que si [G]canta Matilde [E7]camina, [Am]
hasta [D7]el sabio de la sa[G]bana;
el ve[C]nado deja el ca[G]mino,
por o[D7]ír esa voz ga[G]lana.
Es un [C]elegante pa[G]seo,
que le [D7]canto a Matilde [G]Lina.`
  },

  {
    id: 'val_alicia_adorada',
    title: 'Alicia Adorada',
    author: 'Juancho Polo Valencia',
    category: 'vallenato',
    liturgicalType: 'Paseo Vallenato',
    key: 'C',
    rhythmId: 'paseo_vallenato',
    bpm: 86,
    difficulty: 1,
    featured: true,
    linkedTabId: 'tab_alicia_adorada',
    youtubeQuery: 'alicia adorada guitarra acordes tutorial vallenato',
    theoryNote: 'Toda construida sobre las tres funciones primarias de Do Mayor: Tónica (C / Am), Subdominante (F) y Dominante (G7). ¡Ideal para dominar el bajeo en Do!',
    progressionLoop: ['C', 'F', 'G7', 'C', 'Am', 'Dm', 'G7', 'C'],
    content: `ESTROFA 1
Como [C]Dios en la tierra no tiene a[F]migo,
como [G7]no tiene amigo anda en el [C]aire;
tanto [Am]que le pido y le [Dm]pido,
¡ay, hom[G7]be!, siempre me manda [C]males.

CORO
Pobre mi A[C]licia, Alicia ado[F]rada,
yo te re[G7]cuerdo en todas mis pa[C]rrandas;
pobre mi A[Am]licia, Alicia que[Dm]rida,
yo te lle[G7]varé en toda mi [C]vida.

ESTROFA 2
En [C]Flores de María donde A[F]licia murió,
to[G7]da la mariposa tristi[C]có;
donde [Am]Dios con su poder la [Dm]recordó,
a [G7]Valencia el guayabo le de[C]jó.`
  },

  {
    id: 'val_obsesion',
    title: 'Obsesión',
    author: 'Sergio Amarís / Las Estrellas Vallenatas',
    category: 'vallenato',
    liturgicalType: 'Paseo Romántico',
    key: 'D',
    rhythmId: 'paseo_vallenato',
    bpm: 86,
    difficulty: 1,
    featured: true,
    youtubeQuery: 'obsesion estrellas vallenatas guitarra tutorial acordes',
    theoryNote: 'Paseo romántico inolvidable en Re Mayor: alterna D → Bm → G → A7, súper fluido para practicar cambios con cejilla Bm (o Bm fácil).',
    progressionLoop: ['D', 'Bm', 'G', 'A7', 'D', 'G', 'A7', 'D'],
    content: `ESTROFA 1
Si qui[D]sieras andar con[Bm]migo,
verías [G]qué lindo es el a[A7]mor;
lleva[G]ría tus tristezas [A7]lejos,
donde [D]nunca alumbrara el [A7]sol.

En las [D]mañanas de in[Bm]vierno,
cuando ha[G]ce frío en el cora[A7]zón,
te da[G]ría todo mi ca[A7]riño
y cal[G]marías mi obse[A7]sión. [D] [D7]

CORO
Porque [G]tú eres esa mu[A7]jer
que siem[F#m]pre soñé que[Bm]rer,
y hoy que [Em]te tengo tan [A7]cerquita
no sé [D]qué voy a ha[D7]cer;
me da [G]miedo que me re[A7]chaces
y que [F#m]dejes mo[Bm]rir
esta [Em]linda ilu[A7]sión que nace en [D]mí.`
  },

  {
    id: 'val_casa_en_el_aire',
    title: 'La Casa en el Aire',
    author: 'Rafael Escalona',
    category: 'vallenato',
    liturgicalType: 'Paseo Clásico',
    key: 'D',
    rhythmId: 'paseo_vallenato',
    bpm: 98,
    difficulty: 1,
    featured: true,
    youtubeQuery: 'la casa en el aire guitarra acordes rafael escalona',
    theoryNote: '¡Solo 3 acordes sin cejilla (D, A7 y G)! La obra maestra de Rafael Escalona para su hija Ada Luz es la puerta de entrada más alegre al Vallenato.',
    progressionLoop: ['D', 'A7', 'D', 'D7', 'G', 'A7', 'D', 'A7'],
    content: `ESTROFA 1
Voy a ha[D]certe una casa en el [A7]aire
sola[G]mente pa' que [A7]vivas [D]tú,
después [D7]le pongo un letrero muy [G]grande
de nubes [D]blancas que [A7]diga "Ada [D]Luz".

CORO
Porque [A7]cuando Ada Luz sea seño[D]rita
y al[A7]guno le quiera hablar de a[D]mor,
el ti[D7]po tiene que ser avia[G]dor
para que [D]pueda ha[A7]cerle una vi[D]sita.

El que [A7]no vuele no sube a [D]ver a Ada Luz en las [A7]nubes,
porque [G]si no vuela a[D]llá no [A7]sube. [D]`
  },

  // ==========================================================================
  // CUMBIAS Y PORROS DEL FOLCLOR COLOMBIANO
  // ==========================================================================
  {
    id: 'col_la_piragua',
    title: 'La Piragua',
    author: 'José Barros',
    category: 'vallenato',
    liturgicalType: 'Cumbia Colombiana',
    key: 'Am',
    rhythmId: 'cumbia',
    bpm: 94,
    difficulty: 1,
    featured: true,
    linkedTabId: 'tab_la_piragua',
    youtubeQuery: 'la piragua guitarra tutorial acordes cumbia',
    theoryNote: 'En el coro ("Era la piragua de Guillermo Cubillos") usa la famosa Cadencia Andaluza/Caribeña: Am → G → F → E7 (Im - bVII - bVI - V7).',
    progressionLoop: ['Am', 'G', 'F', 'E7', 'Am', 'Dm', 'E7', 'Am'],
    content: `ESTROFA 1
[Am]Me contaron los abuelos que hace [E7]tiempo
navegaba en el Cesar una pi[Am]ragua,
que partía del Banco, viejo [Dm]puerto,
a las [G]playas de a[E7]mor en Chimi[Am]chagua.

Capoteando el vendaval se estre[E7]mecía,
e impasible desafiaba la tor[Am]menta,
y un ejército de estrellas la se[Dm]guía
tacho[E7]nándola de luz y de le[Am]yenda.

CORO
Era la pi[Am]ragua de Guillermo Cu[G]billos,
era la pi[F]ragua, era la pi[E7]ragua;
era la pi[Am]ragua de Guillermo Cu[G]billos,
era la pi[F]ragua, [E7]era la pi[Am]ragua.`
  },

  {
    id: 'col_yo_me_llamo_cumbia',
    title: 'Yo Me Llamo Cumbia',
    author: 'Mario Gareña',
    category: 'vallenato',
    liturgicalType: 'Cumbia Clásica',
    key: 'Am',
    rhythmId: 'cumbia',
    bpm: 96,
    difficulty: 1,
    featured: true,
    youtubeQuery: 'yo me llamo cumbia guitarra acordes tutorial',
    theoryNote: 'Combina Am con su dominante secundaria A7 → Dm ("Yo nací en las bellas playas caribes"). Marca con firmeza el bajo en 1 y 3 y el apagado en 2 y 4.',
    progressionLoop: ['Am', 'A7', 'Dm', 'G7', 'C', 'E7', 'Am', 'E7'],
    content: `ESTROFA 1
[Am]Yo me llamo cumbia, yo soy la [E7]reina por donde [Am]voy,
no hay una cadencia en el [E7]mundo que baile como [Am]yo.
Yo nací en las [A7]bellas playas ca[Dm]ribes de mi país,
[G7]soy barrancabermella, cartage[C]nera, yo soy de a[E7]hí.

CORO
[Am]Soy de Santa [A7]Marta, soy monte[Dm]riana,
pero eso [E7]sí: ¡yo soy colom[Am]biana!
¡Oh, [A7]tierra her[Dm]mosa donde na[Am]cí,
con el [E7]son de la cumbia soy fe[Am]liz!`
  },

  {
    id: 'col_colombia_tierra_querida',
    title: 'Colombia Tierra Querida',
    author: 'Lucho Bermúdez',
    category: 'vallenato',
    liturgicalType: 'Cumbia / Porro',
    key: 'Am',
    rhythmId: 'porro_colombiano',
    bpm: 104,
    difficulty: 2,
    featured: true,
    youtubeQuery: 'colombia tierra querida guitarra acordes lucho bermudez',
    theoryNote: '¡Magia armónica de Lucho Bermúdez! La estrofa está en La Menor (Am - Dm - E7) y en el coro ("Colombia, te hiciste grande") modula gloriosamente al Homónimo Mayor (La Mayor: A - E7 - A)!',
    progressionLoop: ['Am', 'Dm', 'E7', 'Am', 'A', 'E7', 'D', 'A'],
    content: `ESTROFA (En La Menor — Nostálgica y Majestuosa)
Co[Am]lombia tierra que[E7]rida, himno de fe y armo[Am]nía,
cantemos, cantemos [A7]todos grito de paz y ale[Dm]gría.
Vi[Dm]vamos siempre vi[Am]vamos a nuestra patria que[E7]rida:
tu [Dm]suelo es una ora[Am]ción y es un [E7]canto de la [Am]vida.

CORO (Modulación Luminosa a La Mayor)
¡Can[A]tando, cantando yo viviré, Co[E7]lombia tierra que[A]rida!
¡Can[A]tando, cantando yo viviré, Co[E7]lombia tierra que[A]rida!

Co[A]lombia, te hiciste [E7]grande con el furor de tu [A]gloria,
la A[A7]mérica toda [D]canta la floración de tu his[E7]toria.
Vi[D]vamos, siempre vi[A]vamos a nuestra [F#m]patria que[Bm]rida,
tu [E7]suelo es una oración y es un canto de la [A]vida.`
  },

  {
    id: 'col_carmen_de_bolivar',
    title: 'Carmen de Bolívar',
    author: 'Lucho Bermúdez',
    category: 'vallenato',
    liturgicalType: 'Porro Colombiano',
    key: 'Dm',
    rhythmId: 'porro_colombiano',
    bpm: 108,
    difficulty: 2,
    featured: true,
    youtubeQuery: 'carmen de bolivar guitarra acordes porro tutorial',
    theoryNote: 'El porro más emblemático de Colombia. Igual que en Colombia Tierra Querida, arranca en Re Menor (Dm - Gm - A7) y estalla de sol en Re Mayor (D - A7 - G - D) en el estribillo.',
    progressionLoop: ['Dm', 'A7', 'Dm', 'Gm', 'D', 'A7', 'G', 'D'],
    content: `ESTROFA (En Re Menor)
[Dm]Carmen querida, tierra de a[A7]mores,
hay luz y en[Gm]sueños bajo tu [Dm]cielo;
y primavera [D7]siempre en tu [Gm]suelo,
bajo tus [Dm]soles [A7]llenos de ar[Dm]dores.

CORO (Estallido Festivo en Re Mayor)
¡Tierra de pla[D]ceres, de luz y ale[A7]gría,
de lindas mu[Em]jeres, [A7]Carmen tierra [D]mía!
¡Tierra de pla[D7]ceres, de luz y ale[G]gría,
de lindas mu[D]jeres, [A7]Carmen tierra [D]mía!`
  },

  // ==========================================================================
  // REPERTORIO COLOMBIANO DEL LIBRO "HAGA MÚSICA CON LA GUITARRA" (KEYNER RAMÍREZ)
  // ==========================================================================
  {
    id: 'col_pueblito_viejo',
    title: 'Pueblito Viejo',
    author: 'José A. Morales (Libro Keyner Ramírez p.23)',
    category: 'vallenato',
    sourceMethod: 'keyner',
    liturgicalType: 'Vals Colombiano',
    key: 'Am',
    rhythmId: 'vals',
    bpm: 94,
    difficulty: 2,
    featured: true,
    linkedTabId: 'tab_keyner_pueblito_viejo',
    keynerIntro: '32-21-20-32-30-43 · 43-42-40 · 32-20-32-30-43-42 · 42-40-53 (Cód. Keyner)',
    youtubeQuery: 'pueblito viejo guitarra acordes jose a morales tutorial',
    theoryNote: 'Joya del repertorio de "Haga Música con la Guitarra": inicia en La Menor (LA-, 5ª de Re=A7, Re-, 5ª de La=E7) y en el coro modula luminosamente a su Homónimo Mayor (LA+, 5ª de Si=F#7, Si-, 5ª de La=E7). Activa la notación "Método Keyner" arriba para ver LA-, LA+ y 5ª DE.',
    progressionLoop: ['Am', 'A7', 'Dm', 'E7', 'Am', 'A', 'F#7', 'Bm', 'E7', 'A'],
    content: `ESTROFA (Tonalidad La Menor — LA-)
Lu[Am]nita consentida, col[A7]gada del [Dm]cielo,
como un faro[E7]lito que puso mi [Am]Dios,
para que alum[A7]braras las noches ca[Dm]lladas
de este pueblo [Am]viejo [E7]de mi cora[Am]zón.

ESTRIBILLO (Modulación a La Mayor — LA+)
Pue[A]blito de mis cuitas, de casas pequeñitas,
por tus calles tran[F#7]quilas co[Bm]rrió mi juven[E7]tud;
en ti aprendí a querer por la primera [A]vez
y nunca me enseñaste lo que es la ingratitud.

Hoy que vuelvo a tus [A7]lares trayendo mis can[D]tares
y con el alma en[Dm]ferma de tanto pade[A]cer,
quiero pueblito viejo morirme aquí en tu [E7]suelo,
bajo la luz del cielo que un día me vio na[A]cer.`
  },

  {
    id: 'col_espumas',
    title: 'Espumas',
    author: 'Jorge Villamil (Libro Keyner Ramírez p.28)',
    category: 'vallenato',
    sourceMethod: 'keyner',
    liturgicalType: 'Pasillo Colombiano',
    key: 'A',
    rhythmId: 'pasillo_colombiano',
    bpm: 116,
    difficulty: 2,
    featured: true,
    linkedTabId: 'tab_keyner_espumas',
    keynerIntro: '10-10-10-12-12-10-10-23 · 23-12-12-10-10-23-23-10 · 32-32-32-31-20-32-44-23',
    youtubeQuery: 'espumas pasillo jorge villamil guitarra acordes tutorial',
    theoryNote: 'Pasillo clásico del Huila transcrito de Keyner Ramírez: combina Tónica (A), 5ª de Si (F#7 → Bm) y 5ª de Re (A7 → D). Excelente para practicar el patrón de Pasillo Andino en 3/4.',
    progressionLoop: ['A', 'F#7', 'Bm', 'E7', 'A', 'A7', 'D', 'E7'],
    content: `ESTROFA 1
A[A]mores que se [F#7]fueron, a[Bm]mores peregri[E7]nos,
a[E7]mores que se fueron dejando en mi alma negros torbe[A]llinos.
I[A7]gual que las es[D]pumas que lleva el ancho [A]río,
se van mis ilu[E7]siones siendo destrozadas por el remo[A]lino.

CORO
Es[E7]pumas que se [A]van, bellas rosas via[Bm]jeras,
se alejan en dan[E7]zantes y en pequeños copos ornando el pai[A]saje:
¡ya [E7]nunca volve[A]rán!
Las es[D]pumas via[A]jeras como las ilu[E7]siones
que depararon [A]dichas pasa[D]jeras, como las ilu[A]siones.`
  },

  {
    id: 'col_oropel',
    title: 'Oropel',
    author: 'Jorge Villamil (Libro Keyner Ramírez p.20)',
    category: 'vallenato',
    sourceMethod: 'keyner',
    liturgicalType: 'Vals / Pasillo',
    key: 'Em',
    rhythmId: 'pasillo_colombiano',
    bpm: 102,
    difficulty: 2,
    featured: true,
    linkedTabId: 'tab_keyner_oropel',
    keynerIntro: '52-52-52-20-30-32-30-44 · 30-32-30-44-42 · 42-44-30-42-40-53',
    youtubeQuery: 'oropel jorge villamil guitarra acordes letra',
    theoryNote: '¡Gran enseñanza armónica del libro! Emplea el acorde DIS. (D#dim7) como tensión dramática antes de 5ª de Mi (B7), y pasa de Mi Menor (MI-) a Mi Mayor (MI+) con su 5ª de La (E7 → A).',
    progressionLoop: ['Em', 'Am', 'B7', 'Em', 'C', 'D#dim7', 'E', 'E7', 'A'],
    content: `ESTROFA (Mi Menor — MI-)
No [Em]vuelvas a decir ja[Am]más [B7]que has triunfado en la [Em]vida,
en [B7]cosas de fortuna o en cosas del a[Em]mor.
Porque si apuestas [Am]una vez [B7]y pierdes la par[Em]tida,
hoy [C]juegas la ruleta y en sus vueltas [B7]locas ganas oro[E]pel.

ESTRIBILLO (Mi Mayor — MI+)
Si a[D#dim7]puestas al amor, ¡[B7]cuántas traiciones, cuántas tris[E]tezas!
Cuántos desengaños te [B7]quedas cuando el amor se aleja como en las noches [A]negras,
sin [B7]luna y sin es[E]trellas. Amigo, cuánto tienes, cuánto [B7]vales:
principio de la actual filoso[E]fía; a[E7]migo, no arriesgues la par[A]tida,
to[B7]memos este trago, brin[E]demos por la vida, pues todo es oro[E]pel.`
  },

  {
    id: 'col_pescador_lucero',
    title: 'Pescador, Lucero y Río',
    author: 'José A. Morales (Libro Keyner Ramírez p.31)',
    category: 'vallenato',
    sourceMethod: 'keyner',
    liturgicalType: 'Pasillo Colombiano',
    key: 'D',
    rhythmId: 'pasillo_colombiano',
    bpm: 108,
    difficulty: 2,
    featured: true,
    linkedTabId: 'tab_keyner_pescador_lucero',
    keynerIntro: '32-20-21-20-32-21 · 10-23 · 23-21 · 20 · 23-22-10-23-20-32 · 44-32-23-10',
    youtubeQuery: 'pescador lucero y rio guitarra acordes jose a morales',
    theoryNote: 'Alterna con maestría entre Re Mayor (RE+) y Re Menor (RE-) para narrar la historia trágica del pescador: observa cómo 5ª de Sol (D7) resuelve tanto a Sol Mayor (SOL+) como a Sol Menor (SOL-).',
    progressionLoop: ['D', 'A7', 'D', 'D7', 'G', 'Dm', 'Gm', 'Em'],
    content: `ESTROFA 1 (Re Mayor — RE+)
[D]Cuentan que hubo un pescador bar[A7]quero que pescaba de [D]noche
en el [D7]río, que una vez con su [G]red pescó un lu[D]cero,
y fe[A7]liz lo lle[D]vó a su bo[D]hío.

ESTROFA 2 (Re Menor — RE-)
Que desde en[Dm]tonces se iluminó el bo[A7]hío porque tenía allí a su lu[D7]cero,
que no quiso volver [Gm]más por el [Dm]río desde esa [A7]noche el pescador bar[Dm]quero.

ESTRIBILLO
Y dicen que de [D]pronto se oscu[B7]reció el bo[Em]hío, [A7]
y sin [D]vida encontraron al bar[D7]quero;
porque de [G]celos se desbordó aquel [D]río,
en[B7]tró al bo[Em]hío y [A7]se robó el lu[D]cero.`
  },

  {
    id: 'col_al_sur',
    title: 'Al Sur (Canto del Tolima Grande)',
    author: 'Jorge Villamil (Libro Keyner Ramírez p.24)',
    category: 'vallenato',
    sourceMethod: 'keyner',
    liturgicalType: 'Vals / Sanjuanero',
    key: 'Am',
    rhythmId: 'guabina_andina',
    bpm: 104,
    difficulty: 1,
    featured: true,
    keynerIntro: '50-52-53-40 · 40-40-43 · 43-43-53 · 53-53-42 · 42-42-52 · 52-52-40-53-52-50',
    youtubeQuery: 'al sur jorge villamil guitarra acordes tutorial',
    theoryNote: 'Ejemplo perfecto de la Tabla de Relaciones Armónicas de Keyner: usa Tónica (Am), 5ª de La (E7), 5ª de Do (G7 → C), Subdominante (Dm) y modula a La Mayor (A - D - E7) al decir "¡Al sur!".',
    progressionLoop: ['Am', 'E7', 'G7', 'C', 'Dm', 'A', 'D', 'E7'],
    content: `ESTROFA (En La Menor — LA-)
A[Am]zules se miran los [E7]cerros en la leja[Am]nía,
pai[G7]sajes de ar[C]dientes lla[Dm]nuras con sus arro[Am]zales de [B7]verde co[E7]lor.
En [Am]noches, noches de ve[E7]rano, brillan los lu[Am]ceros
con [G7]gran esplen[C]dor; la [Dm]brisa que viene del [Am]río
me dice hasta [E7]luego, yo le digo a[A]diós.

CORO (En La Mayor — LA+)
¡Al [E7]sur, al sur, al [A]sur del cerro del Pacandé,
en[E7]tre chaparrales y entre sa[A]manes reina la alegría que adorna el pai[E7]saje!
Al sur, al [A]sur del cerro del Pacan[E7]dé
está la tierra bo[A]nita, la tierra del [E7]Huila que me vio na[A]cer.`
  },

  {
    id: 'col_el_ano_viejo',
    title: 'El Año Viejo',
    author: 'Crescencio Salcedo (Libro Keyner Ramírez p.40)',
    category: 'vallenato',
    sourceMethod: 'keyner',
    liturgicalType: 'Porro / Parranda',
    key: 'Am',
    rhythmId: 'cumbia',
    bpm: 108,
    difficulty: 1,
    featured: true,
    linkedTabId: 'tab_keyner_el_ano_viejo',
    keynerIntro: '50-42-32-21-20-32-21-20-23 · 20 · 52-42-31-20-20-23-21-10',
    youtubeQuery: 'el ano viejo guitarra acordes tutorial facil',
    theoryNote: '¡El himno colombiano de fin de año! Ideal para principiantes: toda la canción gira únicamente entre dos acordes en Keyner: La Menor (LA-) y 5ª de La (E7), entrenando la alternancia de Bajos B1 y B2.',
    progressionLoop: ['Am', 'E7', 'E7', 'Am'],
    content: `ESTROFA 1
Yo no ol[Am]vido el año [E7]viejo porque me ha dejado cosas muy [Am]buenas;
yo no ol[Am]vido el año [E7]viejo porque me ha dejado cosas muy [Am]buenas.

CORO
Me dejó una [E7]chiva, una burra negra, una yegua blanca y una buena [Am]suegra;
suegra, ay, me dejó una chi[E7]vita, una burra muy negrita,
una yegua muy blanquita y una buena [Am]suegra.
Me dejó una [E7]chiva, una burra negra, una yegua blanca y una buena [Am]suegra;
me dejó cosa muy [E7]buena, cosa muy bo[Am]nita.`
  }
];

// Cargador asíncrono que fusiona MASTER_SONGS con el catálogo completo extraído de Cancionero Digital
let cachedAllSongs = null;

export async function loadAllSongs() {
  if (cachedAllSongs) return cachedAllSongs;

  let imported = [];
  try {
    const resp = await fetch('./data/cancionero_digital.json');
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data)) {
        imported = data;
      }
    }
  } catch (_) {
    // Fallback silencioso si se abre sin red o aún no existe el archivo externo
  }

  // Deduplicar por título normalizado para priorizar nuestras MASTER_SONGS enriquecidas
  const normalizeTitle = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  const seen = new Set(MASTER_SONGS.map(s => normalizeTitle(s.title)));

  const merged = [...MASTER_SONGS];
  for (const item of imported) {
    const cleanKey = normalizeTitle(item.title);
    if (!cleanKey || seen.has(cleanKey)) continue;
    seen.add(cleanKey);
    merged.push({
      ...item,
      liturgicalType: item.liturgicalType || item[' liturgicalType'] || 'Alabanza',
      featured: false
    });
  }

  cachedAllSongs = merged;
  return merged;
}
