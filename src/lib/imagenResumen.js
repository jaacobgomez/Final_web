// Imagen para stories (1080×1920) con tu top: solo texto y degradado, porque las
// fotos de Spotify no se pueden pintar en un canvas sin permisos de otro dominio.

const ANCHO = 1080;
const ALTO = 1920;

function recortar(ctx, texto, anchoMax) {
  if (ctx.measureText(texto).width <= anchoMax) return texto;
  let corto = texto;
  while (corto.length > 1 && ctx.measureText(`${corto}…`).width > anchoMax) corto = corto.slice(0, -1);
  return `${corto}…`;
}

export function crearImagenResumen({ nombre, periodo, artistas, canciones }) {
  const canvas = document.createElement('canvas');
  canvas.width = ANCHO;
  canvas.height = ALTO;
  const ctx = canvas.getContext('2d');

  const degradado = ctx.createLinearGradient(0, 0, ANCHO, ALTO);
  degradado.addColorStop(0, '#5b21b6');
  degradado.addColorStop(1, '#15803d');
  ctx.fillStyle = degradado;
  ctx.fillRect(0, 0, ANCHO, ALTO);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.font = 'bold 900px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('♫', ANCHO + 80, 900);

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.font = '600 44px sans-serif';
  ctx.fillText(periodo.toUpperCase(), 90, 210);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 96px sans-serif';
  ctx.fillText(recortar(ctx, `El top de ${nombre}`, ANCHO - 180), 90, 320);

  const bloque = (titulo, lineas, y) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = '600 40px sans-serif';
    ctx.fillText(titulo, 90, y);
    lineas.forEach((linea, i) => {
      const yLinea = y + 95 + i * 92;
      ctx.fillStyle = '#1ed760';
      ctx.font = 'bold 60px sans-serif';
      ctx.fillText(String(i + 1), 90, yLinea);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px sans-serif';
      ctx.fillText(recortar(ctx, linea, ANCHO - 260), 170, yLinea);
    });
  };

  bloque('ARTISTAS', artistas.slice(0, 5).map((a) => a.name), 500);
  bloque(
    'CANCIONES',
    canciones.slice(0, 5).map((c) => `${c.name} · ${c.artists?.[0]?.name || ''}`),
    1110
  );

  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = '600 40px sans-serif';
  ctx.fillText('Hecho con Taste Mixer', 90, ALTO - 110);

  return new Promise((resolver) => canvas.toBlob(resolver, 'image/png'));
}
