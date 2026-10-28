// Hay dos formas de entrar:
// - "compartida": la app de Spotify de Jacob (máx. 5 usuarios dados de alta a mano).
//   El intercambio de tokens pasa por /api/* porque necesita el client secret.
// - "propia": cada usuario usa el Client ID de SU app de Spotify, con PKCE.
//   No hace falta secreto: el navegador habla directamente con Spotify.

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const CLAVE_CLIENT_ID_PROPIO = 'spotify_client_id_propio';

// Generar string aleatorio (state y code_verifier) con el generador seguro del navegador
export function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const valores = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(valores, (v) => possible[v % possible.length]).join('');
}

// ---------- Clave propia (Client ID del usuario) ----------

export function getClientIdPropio() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CLAVE_CLIENT_ID_PROPIO);
}

export function setClientIdPropio(clientId) {
  localStorage.setItem(CLAVE_CLIENT_ID_PROPIO, clientId.trim());
  logout(); // la sesión anterior era de otra app de Spotify
}

export function quitarClientIdPropio() {
  localStorage.removeItem(CLAVE_CLIENT_ID_PROPIO);
  logout();
}

// Un Client ID de Spotify son 32 caracteres hexadecimales
export function esClientIdValido(clientId) {
  return /^[0-9a-f]{32}$/i.test(clientId.trim());
}

// ---------- PKCE ----------

async function codeChallenge(verifier) {
  const datos = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', datos);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// ---------- Login ----------

// Construir URL de autorización de Spotify (async por el hash de PKCE)
export async function getSpotifyAuthUrl() {
  const clientIdPropio = getClientIdPropio();
  const clientId = clientIdPropio || process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || '';
  const state = generateRandomString(16);

  // Guardar el state para validación posterior (prevenir CSRF)
  localStorage.setItem('spotify_auth_state', state);

  const scope = [
    'user-read-private',
    'user-read-email',
    'user-top-read',          // tus artistas y canciones más escuchados
    'user-library-read',      // tus canciones guardadas (modo "Descubrir")
    'playlist-modify-public',
    'playlist-modify-private',
    'ugc-image-upload'        // portada automática de las playlists
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    scope: scope
  });

  if (clientIdPropio) {
    const verifier = generateRandomString(64);
    localStorage.setItem('spotify_code_verifier', verifier);
    params.set('code_challenge_method', 'S256');
    params.set('code_challenge', await codeChallenge(verifier));
  }

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// Cambiar el "code" que devuelve Spotify por tokens
export async function intercambiarCodigo(code) {
  const clientIdPropio = getClientIdPropio();
  let response;

  if (clientIdPropio) {
    const verifier = localStorage.getItem('spotify_code_verifier');
    localStorage.removeItem('spotify_code_verifier');
    response = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientIdPropio,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI || '',
        code_verifier: verifier || '',
      }),
    });
  } else {
    response = await fetch('/api/spotify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.error_description || data.error || 'Error al obtener token'
    );
  }

  saveTokens(data.access_token, data.refresh_token, data.expires_in);
}

// ---------- Aviso de cambios de sesión ----------

// Para que la cabecera y la portada se enteren al momento de login/logout
const EVENTO_SESION = 'sesion-cambiada';

function avisarCambioSesion() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(EVENTO_SESION));
  }
}

export function suscribirseSesion(callback) {
  window.addEventListener(EVENTO_SESION, callback);
  window.addEventListener('storage', callback); // otras pestañas
  return () => {
    window.removeEventListener(EVENTO_SESION, callback);
    window.removeEventListener('storage', callback);
  };
}

// ---------- Tokens ----------

// Guardar tokens en localStorage
export function saveTokens(accessToken, refreshToken, expiresIn) {
  const expirationTime = Date.now() + expiresIn * 1000;
  localStorage.setItem('spotify_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('spotify_refresh_token', refreshToken);
  }
  localStorage.setItem('spotify_token_expiration', expirationTime.toString());
  avisarCambioSesion();
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

  const clientIdPropio = getClientIdPropio();
  const response = clientIdPropio
    ? await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: clientIdPropio,
        }),
      })
    : await fetch('/api/refresh-token', {
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
  // La lista y la playlist vinculada son de esta cuenta: no deben verse con otra
  localStorage.removeItem('taste_mixer_estado');
  localStorage.removeItem('taste_mixer_vetados');
  avisarCambioSesion();
}
