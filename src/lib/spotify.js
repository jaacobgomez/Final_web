import { getValidAccessToken } from './auth';

// Todo lo que hay aquí usa solo endpoints que siguen vivos tras los cambios
// de la Web API de febrero de 2026: /search (máx. 10 resultados por página),
// /me/top, /me/tracks, /me/playlists y /playlists/{id}/items.

const API = 'https://api.spotify.com/v1';
const LIMITE_BUSQUEDA = 10;

// Llamada genérica a la API con token válido y reintento si Spotify nos frena (429)
async function spotifyFetch(ruta, opciones = {}, intentos = 2) {
  const token = await getValidAccessToken();
  if (!token) {
    throw new Error('Tu sesión de Spotify ha caducado. Vuelve a iniciar sesión.');
  }

  const respuesta = await fetch(`${API}${ruta}`, {
    ...opciones,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(opciones.headers || {}),
    },
  });

  if (respuesta.status === 429 && intentos > 0) {
    const espera = Number(respuesta.headers.get('Retry-After') || 1);
    await new Promise((r) => setTimeout(r, Math.min(espera, 5) * 1000));
    return spotifyFetch(ruta, opciones, intentos - 1);
  }

  if (respuesta.status === 401) {
    throw new Error('Tu sesión de Spotify ha caducado. Vuelve a iniciar sesión.');
  }

  if (respuesta.status === 403) {
    throw new Error(
      'Spotify no te deja usar esta app todavía: pide al administrador que añada tu correo de Spotify.'
    );
  }

  if (!respuesta.ok) {
    throw new Error(`Error de Spotify (código ${respuesta.status}). Inténtalo de nuevo.`);
  }

  return respuesta.status === 204 ? null : respuesta.json();
}

// ---------- Búsquedas de los widgets ----------

export async function buscarArtistasSpotify(terminoBusqueda) {
  const parametros = new URLSearchParams({
    type: 'artist',
    q: terminoBusqueda,
    limit: String(LIMITE_BUSQUEDA),
  });
  const datos = await spotifyFetch(`/search?${parametros}`);
  return datos.artists?.items || [];
}

export async function buscarCancionesSpotify(terminoBusqueda) {
  const parametros = new URLSearchParams({
    type: 'track',
    q: terminoBusqueda,
    limit: String(LIMITE_BUSQUEDA),
  });
  const datos = await spotifyFetch(`/search?${parametros}`);
  return datos.tracks?.items || [];
}

// Búsqueda de canciones con una página concreta (offset)
async function buscarTracks(consulta, offset = 0) {
  const parametros = new URLSearchParams({
    type: 'track',
    q: consulta,
    limit: String(LIMITE_BUSQUEDA),
    offset: String(offset),
  });
  try {
    const datos = await spotifyFetch(`/search?${parametros}`);
    return datos.tracks?.items || [];
  } catch (error) {
    // Una búsqueda fallida no debe tirar toda la playlist
    console.error(`Búsqueda fallida (${consulta}):`, error.message);
    return [];
  }
}

// ---------- Tu gusto ----------

export async function obtenerMisTops(tipo = 'artists', limite = 10) {
  const parametros = new URLSearchParams({
    limit: String(limite),
    time_range: 'medium_term',
  });
  const datos = await spotifyFetch(`/me/top/${tipo}?${parametros}`);
  return datos.items || [];
}

async function obtenerMisGuardadas(limite = 50) {
  const datos = await spotifyFetch(`/me/tracks?limit=${limite}`);
  return (datos.items || []).map((item) => item.track).filter(Boolean);
}

// ---------- Generador de playlists ----------

// Los géneros del widget en el formato que entiende el filtro genre: de la búsqueda
const GENERO_A_BUSQUEDA = {
  'alt-rock': 'alternative rock',
  'hip-hop': 'hip hop',
  'indie-pop': 'indie pop',
  'r-n-b': 'r&b',
  'world-music': 'world',
};

function generoParaBusqueda(genero) {
  return GENERO_A_BUSQUEDA[genero] || genero.replace(/-/g, ' ');
}

// "1980s" -> "1980-1989"
function filtroAnios(decada) {
  const inicio = parseInt(decada.slice(0, 4), 10);
  return Number.isNaN(inicio) ? null : `${inicio}-${inicio + 9}`;
}

// Páginas de resultados según el modo: las primeras son las más conocidas
const OFFSETS_POR_MODO = {
  conocidas: [0, 10],
  equilibrado: [0, 20],
  descubrir: [20, 30],
};

// Clave para detectar la misma canción en versiones distintas (remaster, live…)
function claveCancion(track) {
  const titulo = track.name
    .toLowerCase()
    .replace(/\s*[-–]\s*.*(remaster|live|version|edit|mix|mono|stereo).*$/i, '')
    .replace(/\s*[([].*?[)\]]/g, '')
    .trim();
  return `${titulo}|${track.artists?.[0]?.id || ''}`;
}

function barajar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Ejecuta tareas asíncronas de N en N para no saturar a Spotify
async function enLotes(tareas, tamanoLote = 4) {
  const resultados = [];
  for (let i = 0; i < tareas.length; i += tamanoLote) {
    const lote = await Promise.all(tareas.slice(i, i + tamanoLote).map((t) => t()));
    resultados.push(...lote);
  }
  return resultados;
}

/*
  preferencias = { artistas, canciones, generos, decadas }
  opciones = {
    modo: 'conocidas' | 'equilibrado' | 'descubrir',
    objetivo: { tipo: 'canciones' | 'minutos', valor: number },
    usarMiGusto: boolean,
    excluirIds: string[],   // para "Añadir más canciones"
    desplazamiento: number, // páginas extra para traer canciones nuevas
  }
  Devuelve { tracks, avisos }
*/
export async function generarPlaylist(preferencias, opciones = {}) {
  const {
    modo = 'equilibrado',
    objetivo = { tipo: 'canciones', valor: 30 },
    usarMiGusto = false,
    excluirIds = [],
    desplazamiento = 0,
  } = opciones;

  const { artistas = [], canciones = [], generos = [], decadas = [] } = preferencias;
  const avisos = [];

  // 1) Fuentes: cada una es una búsqueda que aporta canciones por turnos
  const fuentes = [];
  for (const artista of artistas) {
    fuentes.push({ consulta: `artist:"${artista.name}"`, elegida: true });
  }
  for (const cancion of canciones) {
    const artista = cancion.artists?.[0];
    if (artista && !artistas.some((a) => a.id === artista.id)) {
      fuentes.push({ consulta: `artist:"${artista.name}"`, elegida: true });
    }
  }
  for (const genero of generos) {
    fuentes.push({ consulta: `genre:"${generoParaBusqueda(genero)}"`, elegida: false });
  }

  const sinSemillas = fuentes.length === 0;
  if (usarMiGusto || sinSemillas) {
    try {
      const misArtistas = await obtenerMisTops('artists', 10);
      for (const artista of barajar(misArtistas).slice(0, sinSemillas ? 5 : 3)) {
        // Son artistas que escuchas mucho: cuentan como elegidos para el reparto
        fuentes.push({ consulta: `artist:"${artista.name}"`, elegida: true });
      }
    } catch (error) {
      avisos.push('No he podido leer tus artistas más escuchados.');
    }
  }

  if (fuentes.length === 0) {
    return { tracks: [], avisos: ['Elige al menos un artista, canción o género.'] };
  }

  // 2) Canciones a excluir: las ya añadidas y, en modo Descubrir, las que ya conoces
  const excluidas = new Set(excluirIds);
  if (modo === 'descubrir') {
    try {
      const [misTops, misGuardadas] = await Promise.all([
        obtenerMisTops('tracks', 50),
        obtenerMisGuardadas(50),
      ]);
      [...misTops, ...misGuardadas].forEach((t) => excluidas.add(t.id));
    } catch (error) {
      avisos.push('No he podido leer tu biblioteca para el modo Descubrir.');
    }
  }

  // 3) Búsquedas: fuente × década × página, con los filtros dentro de la consulta
  const anios = decadas.map(filtroAnios).filter(Boolean);
  const offsets = OFFSETS_POR_MODO[modo].map((o) => o + desplazamiento * 10);
  const tareas = [];
  fuentes.forEach((fuente) => {
    fuente.tracks = [];
    const filtros = anios.length > 0 ? anios.map((a) => ` year:${a}`) : [''];
    for (const filtro of filtros) {
      for (const offset of offsets) {
        tareas.push(async () => {
          const encontrados = await buscarTracks(`${fuente.consulta}${filtro}`, offset);
          fuente.tracks.push(...encontrados);
        });
      }
    }
  });
  await enLotes(tareas);

  // 4) Mezcla por turnos entre fuentes, sin repetir canción ni pasarse por artista
  const objetivoCanciones =
    objetivo.tipo === 'canciones' ? objetivo.valor : Math.ceil(objetivo.valor / 3);
  const maxPorArtistaElegido = Math.max(3, Math.ceil(objetivoCanciones / fuentes.length));
  const maxPorArtistaOtro = 2;

  const resultado = [];
  const clavesVistas = new Set();
  const porArtista = new Map();
  let minutos = 0;

  const yaLleno = () =>
    objetivo.tipo === 'canciones'
      ? resultado.length >= objetivo.valor
      : minutos >= objetivo.valor;

  const intentarAnadir = (track, elegida) => {
    if (!track?.id || excluidas.has(track.id)) return false;
    const clave = claveCancion(track);
    if (clavesVistas.has(clave)) return false;
    const artistaId = track.artists?.[0]?.id;
    const cuenta = porArtista.get(artistaId) || 0;
    const tope = elegida ? maxPorArtistaElegido : maxPorArtistaOtro;
    if (cuenta >= tope) return false;

    clavesVistas.add(clave);
    excluidas.add(track.id);
    porArtista.set(artistaId, cuenta + 1);
    resultado.push(track);
    minutos += (track.duration_ms || 0) / 60000;
    return true;
  };

  // Las canciones elegidas a mano van siempre (si no se están excluyendo)
  for (const cancion of canciones) {
    if (yaLleno()) break;
    intentarAnadir(cancion, true);
  }

  const colas = fuentes.map((f) => ({ elegida: f.elegida, tracks: barajar(f.tracks) }));
  let quedan = true;
  while (!yaLleno() && quedan) {
    quedan = false;
    for (const cola of colas) {
      if (yaLleno()) break;
      while (cola.tracks.length > 0) {
        quedan = true;
        if (intentarAnadir(cola.tracks.shift(), cola.elegida)) break;
      }
    }
  }

  if (!yaLleno()) {
    avisos.push(
      anios.length > 0
        ? 'Hay pocas canciones con esos filtros: prueba con más décadas o más artistas.'
        : 'Hay pocas canciones con esa combinación: añade algún artista o género más.'
    );
  }

  return { tracks: resultado, avisos };
}

// ---------- Guardar en Spotify ----------

export async function guardarPlaylistEnSpotify(nombre, tracks, publica = false) {
  const playlist = await spotifyFetch('/me/playlists', {
    method: 'POST',
    body: JSON.stringify({
      name: nombre,
      description: 'Creada con Spotify Taste Mixer',
      public: publica,
    }),
  });

  const uris = tracks.map((t) => t.uri).filter(Boolean);
  for (let i = 0; i < uris.length; i += 100) {
    await spotifyFetch(`/playlists/${playlist.id}/items`, {
      method: 'POST',
      body: JSON.stringify({ uris: uris.slice(i, i + 100) }),
    });
  }

  return {
    id: playlist.id,
    url: playlist.external_urls?.spotify || `https://open.spotify.com/playlist/${playlist.id}`,
  };
}

// Sustituir las canciones de una playlist ya guardada por las de la lista actual.
// PUT reemplaza (máx. 100 por llamada); el resto se añade con POST.
export async function actualizarPlaylistEnSpotify(playlistId, tracks) {
  const uris = tracks.map((t) => t.uri).filter(Boolean);

  await spotifyFetch(`/playlists/${playlistId}/items`, {
    method: 'PUT',
    body: JSON.stringify({ uris: uris.slice(0, 100) }),
  });

  for (let i = 100; i < uris.length; i += 100) {
    await spotifyFetch(`/playlists/${playlistId}/items`, {
      method: 'POST',
      body: JSON.stringify({ uris: uris.slice(i, i + 100) }),
    });
  }
}
