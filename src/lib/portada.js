// Portada automática: degradado de la app, el nombre de la playlist y el símbolo ♫.
// Devuelve el JPEG en base64 (sin "data:...") por debajo de los 256 KB de Spotify.

const TAMANO = 640;
const MAX_BYTES = 256 * 1024;

// Color estable a partir del nombre, para que cada playlist tenga el suyo
function tonoDesdeTexto(texto) {
  let hash = 0;
  for (const letra of texto) hash = (hash * 31 + letra.charCodeAt(0)) % 360;
  return hash;
}

function partirEnLineas(ctx, texto, anchoMax) {
  const palabras = texto.split(/\s+/).filter(Boolean);
  const lineas = [];
  let actual = '';
  for (const palabra of palabras) {
    const prueba = actual ? `${actual} ${palabra}` : palabra;
    if (ctx.measureText(prueba).width > anchoMax && actual) {
      lineas.push(actual);
      actual = palabra;
    } else {
      actual = prueba;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

export function crearPortada(nombre) {
  const canvas = document.createElement('canvas');
  canvas.width = TAMANO;
  canvas.height = TAMANO;
  const ctx = canvas.getContext('2d');

  const tono = tonoDesdeTexto(nombre);
  const degradado = ctx.createLinearGradient(0, 0, TAMANO, TAMANO);
  degradado.addColorStop(0, `hsl(${(tono + 260) % 360}, 65%, 38%)`);
  degradado.addColorStop(1, `hsl(${(tono + 140) % 360}, 70%, 42%)`);
  ctx.fillStyle = degradado;
  ctx.fillRect(0, 0, TAMANO, TAMANO);

  // Símbolo grande de fondo
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.font = 'bold 420px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('♫', TAMANO * 0.62, TAMANO * 0.42);

  // Nombre: se reduce la letra hasta que quepa en 4 líneas
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  let tamanoLetra = 78;
  let lineas;
  do {
    ctx.font = `bold ${tamanoLetra}px sans-serif`;
    lineas = partirEnLineas(ctx, nombre, TAMANO - 96);
    tamanoLetra -= 6;
  } while (lineas.length > 4 && tamanoLetra > 30);
  lineas = lineas.slice(0, 4);
  const altoLinea = (tamanoLetra + 6) * 1.2;
  lineas.forEach((linea, i) => {
    ctx.fillText(linea, 48, TAMANO - 110 - (lineas.length - 1 - i) * altoLinea);
  });

  ctx.font = '600 28px sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('Taste Mixer', 48, TAMANO - 48);

  for (let calidad = 0.85; calidad >= 0.4; calidad -= 0.15) {
    const base64 = canvas.toDataURL('image/jpeg', calidad).split(',')[1];
    if (base64.length <= MAX_BYTES) return base64;
  }
  return null;
}
