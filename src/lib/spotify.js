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