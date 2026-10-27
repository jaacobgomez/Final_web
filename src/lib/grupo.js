// Mezcla de grupo sin base de datos: cada persona comparte un enlace con su
// "gusto" (nombre + sus 10 artistas favoritos) y quien hace la mezcla los junta.

const CLAVE_GRUPO = 'taste_mixer_grupo';

// JSON -> base64url (admite tildes y emojis en los nombres)
export function codificarGusto(gusto) {
  const compacto = {
    n: gusto.nombre,
    a: gusto.artistas.map((a) => [a.id, a.name]),
  };
  const bytes = new TextEncoder().encode(JSON.stringify(compacto));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Acepta el código suelto o el enlace completo. Devuelve null si no es válido.
export function decodificarGusto(texto) {
  try {
    const limpio = texto.trim();
    const codigo = limpio.includes('gusto=')
      ? new URL(limpio, 'https://x').searchParams.get('gusto')
      : limpio;
    const base64 = codigo.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const datos = JSON.parse(new TextDecoder().decode(bytes));

    if (typeof datos.n !== 'string' || !Array.isArray(datos.a) || datos.a.length === 0) {
      return null;
    }
    return {
      nombre: datos.n.slice(0, 40),
      artistas: datos.a
        .filter((a) => Array.isArray(a) && a.length === 2)
        .slice(0, 10)
        .map(([id, name]) => ({ id: String(id), name: String(name) })),
    };
  } catch {
    return null;
  }
}

export function cargarGrupo() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CLAVE_GRUPO) || '[]');
  } catch {
    return [];
  }
}

export function guardarGrupo(participantes) {
  localStorage.setItem(CLAVE_GRUPO, JSON.stringify(participantes));
}
