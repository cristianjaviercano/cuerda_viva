// ============================================================================
// js/glossary.js
// Glosario emergente: la primera aparición de cada término técnico en una
// pantalla se marca y muestra su definición al tocarla o pasar el cursor.
// ============================================================================

export const GLOSSARY = [
  ['acorde de séptima', 'Tríada con una cuarta nota, la 7ª (p. ej. G7, D7), que añade tensión.'],
  ['dominante secundario', 'Acorde V7 de un acorde que no es la tónica (p. ej. B7 antes de Em).'],
  ['intercambio modal', 'Tomar prestado un acorde del modo homónimo (p. ej. Cm dentro de Do Mayor).'],
  ['relativo menor', 'Tonalidad menor con las mismas notas que una mayor, 3 semitonos abajo (C → Am).'],
  ['bajo invertido', 'Acorde cuya nota más grave no es la fundamental (D/F#: Re con bajo en Fa#).'],
  ['dedo pivote', 'Dedo que se queda en su sitio al cambiar de acorde y sirve de ancla.'],
  ['subdominante', 'Acorde del IV grado (p. ej. F en Do): se aleja de la tónica con poca tensión.'],
  ['dominante', 'Acorde del V grado (p. ej. G7 en Do): crea tensión que pide volver a la tónica.'],
  ['tónica', 'Nota o acorde de reposo de una tonalidad: el "hogar" de la canción (grado I).'],
  ['homónimo', 'Tonalidad con la misma tónica pero distinto modo (La menor ↔ La Mayor).'],
  ['semitono', 'La distancia más pequeña entre dos notas: un traste en la guitarra.'],
  ['octava', 'Distancia de 12 semitonos: la misma nota, más aguda o más grave.'],
  ['tríada', 'Acorde de tres notas: fundamental, tercera y quinta.'],
  ['cejuela', 'Pieza junto al clavijero que sostiene las cuerdas al aire (el "traste 0").'],
  ['diapasón', 'Superficie de madera del mástil donde están los trastes y se pisan las cuerdas.'],
  ['traste', 'Barra metálica del mástil. Se pisa justo antes de ella; cada traste sube un semitono.'],
  ['cejilla', 'Pisar varias cuerdas a la vez con el índice extendido (no confundir con el capotraste).'],
  ['capotraste', 'Abrazadera que se coloca en un traste para subir el tono de todas las cuerdas.'],
  ['arpegio', 'Tocar las notas de un acorde una por una en lugar de rasguearlas juntas.'],
  ['rasgueo', 'Pasar la mano por varias cuerdas a la vez, hacia abajo (↓) o hacia arriba (↑).'],
  ['chasquido', 'Golpe percusivo (✕): la palma apaga las cuerdas justo cuando las uñas las rozan.'],
  ['compás', 'Grupo de pulsos que se repite (2/4, 3/4, 4/4, 6/8); el primero suele ser el más fuerte.'],
  ['pulso', 'El latido regular de la música: el que marcas con el pie.'],
  ['contratiempo', 'Golpe que cae entre dos pulsos (en la "y"), no sobre ellos.'],
  ['síncopa', 'Acento desplazado a un tiempo débil o a un contratiempo; da sensación de empuje.'],
  ['anacrusa', 'Notas que suenan antes del primer tiempo fuerte, como "Cum-ple" en Cumpleaños Feliz.'],
  ['tablatura', 'Escritura para guitarra: cada línea es una cuerda y cada número el traste a pisar.'],
  ['hammer-on', 'Ligado ascendente (h): otro dedo "martilla" la cuerda y suena sin volver a pulsar.'],
  ['pull-off', 'Ligado descendente (p): al soltar un dedo, la cuerda suena en la nota más grave.'],
  ['slide', 'Deslizar el dedo por la cuerda de un traste a otro sin levantarlo (/).'],
  ['ligado', 'Dos o más notas tocadas pulsando solo la primera (hammer-on, pull-off o slide).'],
  ['bordoneo', 'Línea de bajos que une acordes, tocada con el pulgar en las cuerdas graves.'],
  ['bordones', 'Las tres cuerdas graves (4ª, 5ª y 6ª), que se tocan con el pulgar.'],
  ['primas', 'Las tres cuerdas agudas (1ª, 2ª y 3ª).'],
  ['disminuido', 'Acorde de terceras menores superpuestas: muy tenso, suele usarse de paso.'],
  ['suspendido', 'Acorde que cambia la 3ª por la 4ª (sus4) o la 2ª (sus2): suena "en suspenso".'],
  ['pentatónica', 'Escala de 5 notas sin semitonos; base de muchos punteos e improvisaciones.'],
  ['mixolidio', 'Escala mayor con la 7ª rebajada medio tono; típica del acordeón vallenato.'],
  ['metrónomo', 'Aparato o app que marca el pulso con clics a un tempo fijo.'],
  ['BPM', 'Pulsos por minuto: la velocidad (tempo) de la música.']
];

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const escAttr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Términos más largos primero ("dominante secundario" antes que "dominante").
const MATCHERS = [...GLOSSARY]
  .sort((a, b) => b[0].length - a[0].length)
  .map(([term, def]) => ({
    term,
    def,
    re: new RegExp(`(?<![\\p{L}\\p{N}-])(${escapeRe(term)}(?:s|es)?)(?![\\p{L}\\p{N}-])`, 'iu')
  }));

/**
 * Marca en un HTML ya generado la primera aparición de cada término del glosario.
 * Solo modifica texto (nunca etiquetas ni atributos) y omite <code> y términos ya marcados.
 * @param {string} html
 * @param {Set<string>} [used] términos ya marcados en la misma pantalla
 */
export function annotateGlossary(html, used = new Set()) {
  const tokens = String(html || '').split(/(<[^>]+>)/);
  let skipDepth = 0;
  const slots = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (!tok) continue;
    if (tok.startsWith('<')) {
      if (/^<(code|button|a)\b/i.test(tok)) skipDepth++;
      else if (/^<\/(code|button|a)>/i.test(tok)) skipDepth = Math.max(0, skipDepth - 1);
      continue;
    }
    if (skipDepth > 0) continue;
    let text = tok;
    for (const m of MATCHERS) {
      if (used.has(m.term)) continue;
      const match = text.match(m.re);
      if (!match) continue;
      // Marcador temporal: el botón insertado no vuelve a analizarse.
      const marker = `\u0000${slots.length}\u0000`;
      slots.push(`<button type="button" class="gloss-term" data-def="${escAttr(m.def)}" aria-label="${escAttr(`${match[1]}: ${m.def}`)}">${match[1]}</button>`);
      text = text.slice(0, match.index) + marker + text.slice(match.index + match[1].length);
      used.add(m.term);
    }
    tokens[i] = text;
  }
  return tokens.join('').replace(/\u0000(\d+)\u0000/g, (_, n) => slots[Number(n)]);
}
