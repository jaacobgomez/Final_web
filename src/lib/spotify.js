import { getAccessToken } from './auth';

export async function generatePlaylist(preferences) {
  const { artists, genres, decades, popularity } = preferences;
  const token = getAccessToken();
  let allTracks = [];

  // 1. Obtener top tracks de artistas seleccionados
  for (const artist of artists) {
    const tracks = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await tracks.json();
    allTracks.push(...data.tracks);
  }

  // 2. Buscar por géneros
  for (const genre of genres) {
    const results = await fetch(
      `https://api.spotify.com/v1/search?type=track&q=genre:${genre}&limit=20`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    const data = await results.json();
    allTracks.push(...data.tracks.items);
  }

  // 3. Filtrar por década
  if (decades.length > 0) {
    allTracks = allTracks.filter(track => {
      const year = new Date(track.album.release_date).getFullYear();
      return decades.some(decade => {
        const decadeStart = parseInt(decade);
        return year >= decadeStart && year < decadeStart + 10;
      });
    });
  }

  // 4. Filtrar por popularidad
  if (popularity) {
    const [min, max] = popularity;
    allTracks = allTracks.filter(
      track => track.popularity >= min && track.popularity <= max
    );
  }

  // 5. Eliminar duplicados y limitar a 30 canciones
  const uniqueTracks = Array.from(
    new Map(allTracks.map(track => [track.id, track])).values()
  ).slice(0, 30);

  return uniqueTracks;
}

export async function getRandomSpotifyImage() {
  const token = getAccessToken();
  if (!token) {
    throw new Error('No hay token de Spotify. Inicia sesión primero.');
  }

  const res = await fetch(
    'https://api.spotify.com/v1/browse/new-releases?limit=20',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error('Error al pedir new releases:', res.status, text);
    throw new Error('Error al pedir datos a Spotify');
  }

  const data = await res.json();
  const albums = data.albums.items;
  if (!albums.length) {
    throw new Error('Spotify no devolvió álbumes');
  }

  const randomIndex = Math.floor(Math.random() * albums.length);
  const album = albums[randomIndex];

  return {
    url: album.images[0]?.url || '',
    name: album.name,
    artist: album.artists?.[0]?.name || '',
  };
}
//Buscar artistas 
// Pequeña función para leer el token del localStorage de forma segura
function obtenerTokenCliente() {
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem("spotify_token") || null;
  } catch (error) {
    console.error("No se pudo leer el token de Spotify del localStorage", error);
    return null;
  }
}

export async function buscarArtistasSpotify(terminoBusqueda) {
  const token = obtenerTokenCliente();

  if (!token) {
    throw new Error(
      "No hay token de Spotify. Inicia sesión de nuevo para buscar artistas."
    );
  }

  const parametros = new URLSearchParams({
    type: "artist",
    q: terminoBusqueda,
    limit: "10",
  });

  const respuesta = await fetch(
    `https://api.spotify.com/v1/search?${parametros.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (respuesta.status === 401) {
    throw new Error("El token de Spotify ha expirado. Vuelve a iniciar sesión.");
  }

  if (!respuesta.ok) {
    throw new Error(
      `Error al buscar artistas (código ${respuesta.status}). Inténtalo de nuevo.`
    );
  }

  const datos = await respuesta.json();
  return datos.artists?.items || [];
}

// Búsqueda de canciones en la Web API de Spotify
export async function buscarCancionesSpotify(terminoBusqueda) {
  const token = obtenerTokenCliente();

  if (!token) {
    throw new Error(
      "No hay token de Spotify. Inicia sesión de nuevo para buscar canciones."
    );
  }

  const parametros = new URLSearchParams({
    type: "track",
    q: terminoBusqueda,
    limit: "10",
  });

  const respuesta = await fetch(
    `https://api.spotify.com/v1/search?${parametros.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (respuesta.status === 401) {
    throw new Error("El token de Spotify ha expirado. Vuelve a iniciar sesión.");
  }

  if (!respuesta.ok) {
    throw new Error(
      `Error al buscar canciones (código ${respuesta.status}). Inténtalo de nuevo.`
    );
  }

  const datos = await respuesta.json();
  return datos.tracks?.items || [];
}

// Obtener top tracks de un artista
export async function obtenerTopTracksArtista(artistId, market = "ES") {
  const token = obtenerTokenCliente();
  if (!token) {
    throw new Error("No hay token de Spotify para cargar top tracks.");
  }

  const respuesta = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${market}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (respuesta.status === 401) {
    throw new Error("El token de Spotify ha expirado. Vuelve a iniciar sesión.");
  }

  if (!respuesta.ok) {
    throw new Error(
      `Error al obtener top tracks del artista (código ${respuesta.status}).`
    );
  }

  const datos = await respuesta.json();
  return datos.tracks || [];
}

// Buscar canciones por género
export async function buscarTracksPorGenero(genero, limit = 10) {
  const token = obtenerTokenCliente();
  if (!token) {
    throw new Error("No hay token de Spotify para buscar por género.");
  }

  const parametros = new URLSearchParams({
    type: "track",
    q: `genre:${genero}`,
    limit: String(limit),
  });

  const respuesta = await fetch(
    `https://api.spotify.com/v1/search?${parametros.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (respuesta.status === 401) {
    throw new Error("El token de Spotify ha expirado. Vuelve a iniciar sesión.");
  }

  if (!respuesta.ok) {
    throw new Error(
      `Error al buscar canciones por género (código ${respuesta.status}).`
    );
  }

  const datos = await respuesta.json();
  return datos.tracks?.items || [];
}
