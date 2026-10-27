// Estado del panel guardado en el dispositivo, para que al cerrar y abrir la app
// (sobre todo instalada en el móvil) sigan ahí la lista, los filtros y la playlist vinculada.

const CLAVE_ESTADO = 'taste_mixer_estado';

export function cargarEstado() {
  if (typeof window === 'undefined') return null;
  try {
    const guardado = localStorage.getItem(CLAVE_ESTADO);
    return guardado ? JSON.parse(guardado) : null;
  } catch (error) {
    console.error('No se pudo leer el estado guardado', error);
    return null;
  }
}

export function guardarEstado(estado) {
  try {
    localStorage.setItem(CLAVE_ESTADO, JSON.stringify(estado));
  } catch (error) {
    console.error('No se pudo guardar el estado', error);
  }
}

// Mezclar con lo que ya hubiera (lo usa la página de grupo antes de ir al panel)
export function actualizarEstado(cambios) {
  guardarEstado({ ...(cargarEstado() || {}), ...cambios });
}

export function borrarEstado() {
  localStorage.removeItem(CLAVE_ESTADO);
}
