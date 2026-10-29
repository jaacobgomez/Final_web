import { getClientIdPropio, getValidAccessToken } from './auth';
import { cargarVetados } from './vetados';

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
    // Spotify explica el motivo en el cuerpo (usuario no dado de alta, dueño sin Premium…)
    // A veces es JSON y a veces texto plano ("…the user may not be registered.")
    const cuerpo = await respuesta.text().catch(() => '');
    let motivo = cuerpo.trim();
    try {
      motivo = JSON.parse(cuerpo)?.error?.message || motivo;
    } catch {
      // no era JSON: nos quedamos con el texto
    }
    const quien = getClientIdPropio()
      ? 'revisa en tu app de Spotify (User Management) que está tu correo y que la cuenta dueña tiene Premium'
      : 'pide al administrador que añada tu correo de Spotify o, si tienes tu propia clave, ponla en este dispositivo en Inicio → Mi clave';
    throw new Error(`Spotify no te deja usar esta app todavía: ${quien}.${motivo ? ` (Spotify dice: «${motivo}»)` : ''}`);
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

// periodo: 'short_term' (4 semanas), 'medium_term' (6 meses) o 'long_term' (desde siempre)
export async function obtenerMisTops(tipo = 'artists', limite = 10, periodo = 'medium_term') {
  const parametros = new URLSearchParams({
    limit: String(limite),
    time_range: periodo,
  });
  const datos = await spotifyFetch(`/me/top/${tipo}?${parametros}`);
  return datos.items || [];
}

async function obtenerMisGuardadas(limite = 50) {
  const datos = await spotifyFetch(`/me/tracks?limit=${limite}`);
  return (datos.items || []).map((item) => item.track).filter(Boolean);
}

export async function obtenerMiPerfil() {
  return spotifyFetch('/me');
}

// Solo las playlists que son tuyas (Spotify no deja leer las de otros en modo desarrollo)
export async function obtenerMisPlaylists() {
  const [perfil, datos] = await Promise.all([
    obtenerMiPerfil(),
    spotifyFetch('/me/playlists?limit=50'),
  ]);
  return (datos.items || []).filter((p) => p?.owner?.id === perfil.id);
}

// Lo que se comparte en la mezcla de grupo: nombre y 10 artistas favoritos
export async function obtenerMiGusto() {
  const [perfil, artistas] = await Promise.all([
    obtenerMiPerfil(),
    obtenerMisTops('artists', 10),
  ]);
  return {
    nombre: (perfil.display_name || 'Yo').split(' ')[0],
    artistas: artistas.map((a) => ({ id: a.id, name: a.name })),
  };
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

// Páginas para pedir después de las iniciales: primero hacia delante y, al final,
// las anteriores (en Descubrir son las más conocidas)
const MAX_OFFSET = 200;
const MAX_PETICIONES_EXTRA = 60;

function paginasSiguientes(iniciales) {
  const desde = Math.min(...iniciales);
  const resto = [];
  for (let o = 0; o <= MAX_OFFSET; o += LIMITE_BUSQUEDA) {
    if (!iniciales.includes(o)) resto.push(o);
  }
  return [
    ...resto.filter((o) => o > desde),
    ...resto.filter((o) => o < desde).reverse(),
  ];
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
    vetados = cargarVetados(),
    sinExplicitas = false,
  } = opciones;
  const idsVetados = new Set(vetados.map((a) => a.id));

  const { artistas = [], canciones = [], generos = [], decadas = [] } = preferencias;
  const avisos = [];

  // 1) Fuentes: cada una es una búsqueda que aporta canciones por turnos
  const fuentes = [];
  for (const artista of artistas) {
    fuentes.push({ consulta: `artist:"${artista.name}"`, elegida: true, artistaId: artista.id });
  }
  for (const cancion of canciones) {
    const artista = cancion.artists?.[0];
    if (artista && !artistas.some((a) => a.id === artista.id)) {
      fuentes.push({ consulta: `artist:"${artista.name}"`, elegida: true, artistaId: artista.id });
    }
  }
  for (const genero of generos) {
    fuentes.push({ consulta: `genre:"${generoParaBusqueda(genero)}"`, elegida: false });
  }

  // Empezar desde una playlist tuya: sus artistas más repetidos como semillas
  let cancionesBase = [];
  if (preferencias.playlistBase) {
    try {
      cancionesBase = await obtenerCancionesPlaylist(preferencias.playlistBase.id);
      const porArtista = new Map();
      for (const track of cancionesBase) {
        const artista = track.artists?.[0];
        if (!artista) continue;
        const actual = porArtista.get(artista.id) || { id: artista.id, name: artista.name, veces: 0 };
        actual.veces += 1;
        porArtista.set(artista.id, actual);
      }
      [...porArtista.values()]
        .sort((a, b) => b.veces - a.veces)
        .slice(0, 6)
        .forEach((a) => fuentes.push({ consulta: `artist:"${a.name}"`, elegida: true, artistaId: a.id }));
    } catch (error) {
      avisos.push('No he podido leer esa playlist.');
    }
  }

  const sinSemillas = fuentes.length === 0;
  if (usarMiGusto || sinSemillas) {
    try {
      const misArtistas = await obtenerMisTops('artists', 10);
      const disponibles = misArtistas.filter((a) => !idsVetados.has(a.id));
      for (const artista of barajar(disponibles).slice(0, sinSemillas ? 5 : 3)) {
        // Son artistas que escuchas mucho: cuentan como elegidos para el reparto
        fuentes.push({ consulta: `artist:"${artista.name}"`, elegida: true, artistaId: artista.id });
      }
    } catch (error) {
      avisos.push('No he podido leer tus artistas más escuchados.');
    }
  }

  // Los artistas vetados no se buscan
  const permitidas = fuentes.filter((f) => !idsVetados.has(f.artistaId));
  if (permitidas.length < fuentes.length) {
    avisos.push('He dejado fuera a los artistas que tienes vetados.');
  }
  fuentes.splice(0, fuentes.length, ...permitidas);

  if (fuentes.length === 0) {
    return { tracks: [], avisos: ['Elige al menos un artista, canción, género o playlist.'] };
  }

  const unicas = new Map();
  for (const fuente of fuentes) {
    const previa = unicas.get(fuente.consulta);
    unicas.set(fuente.consulta, { ...fuente, elegida: fuente.elegida || previa?.elegida });
  }
  fuentes.splice(0, fuentes.length, ...unicas.values());

  // 2) Canciones a excluir: las ya añadidas y, en modo Descubrir, las que ya conoces
  const excluidas = new Set(excluirIds);
  cancionesBase.forEach((t) => excluidas.add(t.id));
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

  // 3) Colas de búsqueda: una por fuente × década, cada una con sus páginas pendientes
  const anios = decadas.map(filtroAnios).filter(Boolean);
  const filtros = anios.length > 0 ? anios.map((a) => ` year:${a}`) : [''];
  const iniciales = OFFSETS_POR_MODO[modo].map((o) => o + desplazamiento * 10);
  const colas = [];
  for (const fuente of fuentes) {
    for (const filtro of filtros) {
      colas.push({
        consulta: `${fuente.consulta}${filtro}`,
        elegida: fuente.elegida,
        tracks: [],
        pendientes: paginasSiguientes(iniciales),
      });
    }
  }

  const pedirPagina = async (cola, offset) => {
    const encontrados = await buscarTracks(cola.consulta, offset);
    // Página incompleta: más allá ya no hay resultados
    if (encontrados.length < LIMITE_BUSQUEDA) {
      cola.pendientes = cola.pendientes.filter((o) => o < offset);
    }
    return encontrados;
  };

  await enLotes(
    colas.map((cola) => async () => {
      const paginas = await Promise.all(iniciales.map((o) => pedirPagina(cola, o)));
      cola.tracks = barajar(paginas.flat());
    })
  );

  // 4) Mezcla por turnos entre colas, sin repetir canción ni pasarse por artista
  const objetivoCanciones =
    objetivo.tipo === 'canciones' ? objetivo.valor : Math.ceil(objetivo.valor / 3);
  const maxPorArtistaElegido = Math.max(3, Math.ceil(objetivoCanciones / fuentes.length));
  const maxPorArtistaOtro = 2;

  const resultado = [];
  const clavesVistas = new Set();
  const porArtista = new Map();
  const descartadasPorTope = [];
  let sinTope = false;
  let minutos = 0;

  const yaLleno = () =>
    objetivo.tipo === 'canciones'
      ? resultado.length >= objetivo.valor
      : minutos >= objetivo.valor;

  // Devuelve 'ok', 'tope' (sobra ese artista) o 'no' (excluida o repetida)
  const intentarAnadir = (track, elegida) => {
    if (!track?.id || excluidas.has(track.id)) return 'no';
    if (track.artists?.some((a) => idsVetados.has(a.id))) return 'no';
    if (sinExplicitas && track.explicit) return 'no';
    const clave = claveCancion(track);
    if (clavesVistas.has(clave)) return 'no';
    const artistaId = track.artists?.[0]?.id;
    const cuenta = porArtista.get(artistaId) || 0;
    const tope = sinTope ? Infinity : elegida ? maxPorArtistaElegido : maxPorArtistaOtro;
    if (cuenta >= tope) return 'tope';

    clavesVistas.add(clave);
    excluidas.add(track.id);
    porArtista.set(artistaId, cuenta + 1);
    resultado.push(track);
    minutos += (track.duration_ms || 0) / 60000;
    return 'ok';
  };

  const mezclar = () => {
    let quedan = true;
    while (!yaLleno() && quedan) {
      quedan = false;
      for (const cola of colas) {
        if (yaLleno()) break;
        while (cola.tracks.length > 0) {
          quedan = true;
          const track = cola.tracks.shift();
          const estado = intentarAnadir(track, cola.elegida);
          if (estado === 'ok') break;
          if (estado === 'tope') descartadasPorTope.push(track);
        }
      }
    }
  };

  // Las canciones elegidas a mano van siempre (si no se están excluyendo),
  // salvo que sean explícitas y se hayan pedido sin explícitas
  for (const cancion of canciones) {
    if (yaLleno()) break;
    if (intentarAnadir(cancion, true) === 'no' && sinExplicitas && cancion.explicit) {
      avisos.push(`He quitado «${cancion.name}» porque es explícita.`);
    }
  }
  mezclar();

  // Si faltan canciones, se piden más páginas hasta llegar al número exacto
  let peticionesExtra = 0;
  while (!yaLleno() && peticionesExtra < MAX_PETICIONES_EXTRA) {
    const abiertas = colas.filter((c) => c.pendientes.length > 0);
    if (abiertas.length === 0) break;
    peticionesExtra += abiertas.length;
    await enLotes(
      abiertas.map((cola) => async () => {
        const encontrados = await pedirPagina(cola, cola.pendientes.shift());
        cola.tracks.push(...barajar(encontrados));
      })
    );
    mezclar();
  }

  // Último recurso: repetir más a un mismo artista antes que quedarse corto
  if (!yaLleno()) {
    sinTope = true;
    for (const track of descartadasPorTope) {
      if (yaLleno()) break;
      intentarAnadir(track, true);
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

// ---------- Mezcla de grupo ----------

/*
  participantes = [{ nombre, artistas: [{ id, name }] }]
  Primero los artistas que tenéis en común (los de más gente antes); después,
  por turnos, los favoritos de cada uno para que todos estén representados.
*/
export async function generarMezclaGrupo(participantes, opciones = {}) {
  const cuenta = new Map();
  participantes.forEach((p) =>
    p.artistas.forEach((a) => {
      const actual = cuenta.get(a.id) || { ...a, personas: new Set() };
      actual.personas.add(p.nombre);
      cuenta.set(a.id, actual);
    })
  );

  const comunes = [...cuenta.values()]
    .filter((a) => a.personas.size >= 2)
    .sort((a, b) => b.personas.size - a.personas.size);

  const MAX_ARTISTAS = 10;
  const elegidos = comunes.slice(0, 6).map(({ id, name }) => ({ id, name }));
  const yaElegido = (id) => elegidos.some((a) => a.id === id);

  for (let ronda = 0; elegidos.length < MAX_ARTISTAS && ronda < 10; ronda++) {
    for (const p of participantes) {
      if (elegidos.length >= MAX_ARTISTAS) break;
      const siguiente = p.artistas.filter((a) => !yaElegido(a.id))[0];
      if (siguiente) elegidos.push(siguiente);
    }
  }

  const { tracks, avisos } = await generarPlaylist(
    { artistas: elegidos, canciones: [], generos: [], decadas: [] },
    { modo: 'equilibrado', objetivo: { tipo: 'canciones', valor: 30 }, ...opciones }
  );

  return { tracks, avisos, comunes: comunes.map((a) => a.name), artistas: elegidos };
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

  await anadirCanciones(playlist.id, tracks);

  return {
    id: playlist.id,
    url: playlist.external_urls?.spotify || `https://open.spotify.com/playlist/${playlist.id}`,
  };
}

// Canciones que hay ahora mismo en una playlist de Spotify (paginando de 50 en 50)
export async function obtenerCancionesPlaylist(playlistId) {
  const { canciones } = await leerPlaylist(playlistId);
  return canciones;
}

// Canciones de la playlist y si además tiene episodios o archivos locales
async function leerPlaylist(playlistId) {
  const canciones = [];
  let hayOtros = false;
  let ruta = `/playlists/${playlistId}/items?limit=50`;
  while (ruta) {
    const datos = await spotifyFetch(ruta);
    for (const elemento of datos.items || []) {
      // Tras los cambios de 2026 el campo puede llamarse "item" o "track"
      const cancion = elemento.item || elemento.track;
      if (cancion?.id && cancion.type !== 'episode') canciones.push(cancion);
      else hayOtros = true;
    }
    ruta = datos.next ? datos.next.replace(API, '') : null;
  }
  return { canciones, hayOtros };
}

/*
  Actualiza una playlist ya guardada (o una tuya abierta en la app) respetando lo
  que el usuario haya tocado desde la app de Spotify desde el último guardado:
  - lo añadido en Spotify se conserva (y se añade también a la lista de la app)
  - lo quitado en Spotify no se vuelve a meter
  Normalmente solo se añaden y quitan las canciones que cambian, así que se
  mantienen su orden, sus episodios y sus archivos locales. Si se ha reordenado
  la lista en la app (ordenar = true), se reescribe en ese orden, salvo que tenga
  episodios o archivos locales, que se perderían.
  idsUltimoGuardado = ids que tenía la playlist la última vez que la guardó la app.
  Devuelve { tracks, conservadas, quitadasEnSpotify, ordenAplicado } con la lista final.
*/
export async function sincronizarPlaylistEnSpotify(playlistId, tracksApp, idsUltimoGuardado, ordenar = false) {
  const guardadoAntes = new Set(idsUltimoGuardado);
  const { canciones: enSpotify, hayOtros } = await leerPlaylist(playlistId);
  const idsEnSpotify = new Set(enSpotify.map((t) => t.id));
  const idsApp = new Set(tracksApp.map((t) => t.id));

  // Quitadas a mano en Spotify: estaban en el último guardado y ya no están allí
  const quitadas = new Set([...guardadoAntes].filter((id) => !idsEnSpotify.has(id)));
  // Añadidas a mano en Spotify: están allí, no venían de la app y no están en la lista
  const anadidasEnSpotify = enSpotify.filter(
    (t) => !guardadoAntes.has(t.id) && !idsApp.has(t.id)
  );

  if (ordenar && !hayOtros) {
    const final = [...tracksApp.filter((t) => !quitadas.has(t.id)), ...anadidasEnSpotify];
    await reemplazarCanciones(playlistId, final);
    return {
      tracks: final,
      conservadas: anadidasEnSpotify.length,
      quitadasEnSpotify: tracksApp.filter((t) => quitadas.has(t.id)).length,
      ordenAplicado: true,
    };
  }

  const aAnadir = tracksApp.filter((t) => !idsEnSpotify.has(t.id) && !quitadas.has(t.id));
  const aQuitar = enSpotify.filter((t) => guardadoAntes.has(t.id) && !idsApp.has(t.id));
  await quitarCanciones(playlistId, aQuitar);
  await anadirCanciones(playlistId, aAnadir);

  const idsQuitados = new Set(aQuitar.map((t) => t.id));
  const vistos = new Set();
  const final = [...enSpotify.filter((t) => !idsQuitados.has(t.id)), ...aAnadir].filter((t) => {
    if (vistos.has(t.id)) return false;
    vistos.add(t.id);
    return true;
  });

  return {
    tracks: final,
    conservadas: anadidasEnSpotify.length,
    quitadasEnSpotify: tracksApp.filter((t) => quitadas.has(t.id)).length,
    ordenAplicado: false,
  };
}

// Sustituir las canciones por las indicadas, en ese orden.
// PUT reemplaza (máx. 100 por llamada); el resto se añade con POST.
async function reemplazarCanciones(playlistId, tracks) {
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

// Subir la portada (JPEG en base64, máx. 256 KB). Spotify responde 202 sin cuerpo,
// por eso no pasa por spotifyFetch. Devuelve true si se ha podido poner.
export async function subirPortadaPlaylist(playlistId, jpegBase64) {
  const token = await getValidAccessToken();
  if (!token) return false;
  const respuesta = await fetch(`${API}/playlists/${playlistId}/images`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'image/jpeg' },
    body: jpegBase64,
  });
  return respuesta.ok;
}

// Poner una canción en la cola de lo que esté sonando (necesita Premium).
// Spotify responde sin cuerpo, por eso no pasa por spotifyFetch.
export async function ponerEnCola(uri) {
  const token = await getValidAccessToken();
  if (!token) throw new Error('Tu sesión de Spotify ha caducado. Vuelve a iniciar sesión.');
  const respuesta = await fetch(`${API}/me/player/queue?${new URLSearchParams({ uri })}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (respuesta.ok) return;
  if (respuesta.status === 404) {
    throw new Error('No hay nada sonando: abre Spotify en algún dispositivo, pon cualquier canción y vuelve a probar.');
  }
  if (respuesta.status === 401 || respuesta.status === 403) {
    throw new Error('Spotify no me deja usar tu cola: cierra sesión y vuelve a entrar para dar el permiso (y hace falta Premium).');
  }
  throw new Error(`Spotify no ha aceptado la canción (código ${respuesta.status}).`);
}

// Añadir canciones al final de una playlist (máx. 100 por llamada)
async function anadirCanciones(playlistId, tracks) {
  const uris = tracks.map((t) => t.uri).filter(Boolean);
  for (let i = 0; i < uris.length; i += 100) {
    await spotifyFetch(`/playlists/${playlistId}/items`, {
      method: 'POST',
      body: JSON.stringify({ uris: uris.slice(i, i + 100) }),
    });
  }
}

// Quitar canciones de una playlist (máx. 100 por llamada)
async function quitarCanciones(playlistId, tracks) {
  const items = [...new Set(tracks.map((t) => t.uri).filter(Boolean))].map((uri) => ({ uri }));
  for (let i = 0; i < items.length; i += 100) {
    await spotifyFetch(`/playlists/${playlistId}/items`, {
      method: 'DELETE',
      body: JSON.stringify({ items: items.slice(i, i + 100) }),
    });
  }
}
