// Artistas vetados: nunca salen al generar, añadir más, cambiar una canción
// ni en la mezcla de grupo. Se guardan en este dispositivo.

const CLAVE_VETADOS = 'taste_mixer_vetados';

export function cargarVetados() {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CLAVE_VETADOS) || '[]');
  } catch {
    return [];
  }
}

export function guardarVetados(vetados) {
  try {
    localStorage.setItem(CLAVE_VETADOS, JSON.stringify(vetados));
  } catch (error) {
    console.error('No se pudieron guardar los artistas vetados', error);
  }
}
