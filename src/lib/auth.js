// Generar string aleatorio para el parámetro 'state'
export function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Construir URL de autorización de Spotify
export function getSpotifyAuthUrl() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || '';
  const state = generateRandomString(16);

  // Guardar el state para validación posterior (prevenir CSRF)
  if (typeof window !== 'undefined') {
    localStorage.setItem('spotify_auth_state', state);
  }

  const scope = [
    'user-read-private',
    'user-read-email',
    'user-top-read',          // tus artistas y canciones más escuchados
    'user-library-read',      // tus canciones guardadas (modo "Descubrir")
    'playlist-modify-public',
    'playlist-modify-private'
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: scope
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Guardar tokens en localStorage
export function saveTokens(accessToken, refreshToken, expiresIn) {
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem('spotify_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('spotify_refresh_token', refreshToken);
  }
  localStorage.setItem('spotify_token_expiration', expirationTime.toString());
}

// Obtener token actual (con verificación de expiración)
export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('spotify_token');
  const expiration = localStorage.getItem('spotify_token_expiration');

  if (!token || !expiration) return null;

  // Si el token expiró (o le queda menos de 1 minuto), retornar null
  if (Date.now() > parseInt(expiration) - 60 * 1000) {
    return null;
  }

  return token;
}

// Obtener un token válido, refrescándolo si ha caducado
export async function getValidAccessToken() {
  const token = getAccessToken();
  if (token) return token;

  const refreshToken = localStorage.getItem('spotify_refresh_token');
  if (!refreshToken) return null;

  const response = await fetch('/api/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  if (!response.ok) {
    logout();
    return null;
  }

  const data = await response.json();
  saveTokens(data.access_token, data.refresh_token, data.expires_in);
  return data.access_token;
}

// Verificar si hay sesión (token válido o posibilidad de refrescarlo)
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return getAccessToken() !== null || !!localStorage.getItem('spotify_refresh_token');
}

// Cerrar sesión
export function logout() {
  localStorage.removeItem('spotify_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiration');
}
