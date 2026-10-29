// Token de la propia app (sin usuario), para que los invitados de una fiesta
// puedan buscar canciones sin iniciar sesión en Spotify.
let token = null;
let caduca = 0;

async function tokenApp() {
  if (token && Date.now() < caduca - 60_000) return token;
  const credenciales = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');
  const respuesta = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credenciales}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });
  if (!respuesta.ok) throw new Error('Spotify no ha dado el token de la app.');
  const datos = await respuesta.json();
  token = datos.access_token;
  caduca = Date.now() + datos.expires_in * 1000;
  return token;
}

async function spotifyApp(ruta) {
  const respuesta = await fetch(`https://api.spotify.com/v1${ruta}`, {
    headers: { Authorization: `Bearer ${await tokenApp()}` },
  });
  if (!respuesta.ok) throw new Error(`Error de Spotify (${respuesta.status}).`);
  return respuesta.json();
}

// Solo lo que hace falta para pintar y reproducir la canción
export function cancionLigera(track) {
  return {
    id: track.id,
    uri: track.uri,
    name: track.name,
    duration_ms: track.duration_ms,
    explicit: Boolean(track.explicit),
    artists: (track.artists || []).map((a) => ({ id: a.id, name: a.name })),
    album: {
      name: track.album?.name,
      release_date: track.album?.release_date,
      images: (track.album?.images || []).slice(-1),
    },
    external_urls: { spotify: track.external_urls?.spotify },
  };
}

export async function buscarCancionesApp(consulta) {
  const parametros = new URLSearchParams({ type: 'track', q: consulta, limit: '10' });
  const datos = await spotifyApp(`/search?${parametros}`);
  return (datos.tracks?.items || []).map(cancionLigera);
}

export async function obtenerCancionApp(id) {
  return cancionLigera(await spotifyApp(`/tracks/${encodeURIComponent(id)}`));
}
