import { createClient } from '@supabase/supabase-js';

// Lado del navegador de la fiesta con votos.
// Leer y escuchar cambios: directamente en Supabase (solo lectura).
// Escribir: siempre a través de /api/fiesta/* (la clave secreta vive en el servidor).

let cliente = null;
function supabase() {
  if (!cliente) {
    cliente = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      { auth: { persistSession: false } }
    );
  }
  return cliente;
}

export const fiestaDisponible = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);

// ---------- Datos guardados en el móvil ----------

const CLAVE_INVITADO = 'taste_mixer_invitado';
const CLAVE_ANFITRION = 'taste_mixer_fiesta';

function leer(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave) || 'null');
  } catch {
    return null;
  }
}

function escribir(clave, valor) {
  try {
    if (valor === null) localStorage.removeItem(clave);
    else localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    // sin almacenamiento: la fiesta funciona, pero no se recordará al recargar
  }
}

// Invitado: id aleatorio + nombre (lo único que se guarda de él)
export function cargarInvitado() {
  const guardado = leer(CLAVE_INVITADO);
  if (guardado?.id) return guardado;
  const nuevo = { id: crypto.randomUUID(), nombre: '' };
  escribir(CLAVE_INVITADO, nuevo);
  return nuevo;
}

export function guardarNombreInvitado(nombre) {
  const invitado = { ...cargarInvitado(), nombre };
  escribir(CLAVE_INVITADO, invitado);
  return invitado;
}

// Anfitrión: { codigo, clave, playlistId, encoladas: [trackId] }
export const cargarFiestaAnfitrion = () => leer(CLAVE_ANFITRION);
export const guardarFiestaAnfitrion = (datos) => escribir(CLAVE_ANFITRION, datos);

// ---------- Lectura y tiempo real ----------

export async function leerFiesta(codigo) {
  const db = supabase();
  const { data: fiesta } = await db
    .from('fiestas')
    .select('id, codigo, nombre, votos_por_persona, caduca')
    .eq('codigo', codigo.toUpperCase())
    .maybeSingle();
  if (!fiesta) return null;

  const [canciones, votos] = await Promise.all([
    db.from('canciones').select('id, track_id, datos, en_base, posicion_base, propuesta_por, creada').eq('fiesta_id', fiesta.id),
    db.from('votos').select('cancion_id, invitado_id, nombre').eq('fiesta_id', fiesta.id),
  ]);
  return { fiesta, canciones: canciones.data || [], votos: votos.data || [] };
}

// Avisa (agrupando ráfagas) cada vez que alguien vota, quita un voto o añade una canción.
// Los borrados no se pueden filtrar en Supabase: llegan todos y se filtran aquí.
export function escucharFiesta(fiestaId, alCambiar) {
  let temporizador = null;
  const avisar = () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(alCambiar, 250);
  };
  const deEstaFiesta = (cambio) => (cambio.new?.fiesta_id || cambio.old?.fiesta_id) === fiestaId;
  const filtro = `fiesta_id=eq.${fiestaId}`;

  const canal = supabase()
    .channel(`fiesta-${fiestaId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votos', filter: filtro }, avisar)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'canciones', filter: filtro }, avisar)
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'votos' }, (c) => deEstaFiesta(c) && avisar())
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'canciones' }, (c) => deEstaFiesta(c) && avisar())
    .subscribe();

  return () => {
    clearTimeout(temporizador);
    supabase().removeChannel(canal);
  };
}

// Orden: más votos primero; a igualdad, la lista base en su orden y luego las propuestas por antigüedad
export function ranking({ canciones, votos }, invitadoId) {
  const porCancion = new Map();
  for (const voto of votos) {
    if (!porCancion.has(voto.cancion_id)) porCancion.set(voto.cancion_id, []);
    porCancion.get(voto.cancion_id).push(voto);
  }
  return canciones
    .map((c) => {
      const suyos = porCancion.get(c.id) || [];
      return {
        ...c,
        votos: suyos.length,
        votantes: suyos.map((v) => v.nombre),
        miVoto: suyos.some((v) => v.invitado_id === invitadoId),
      };
    })
    .sort(
      (a, b) =>
        b.votos - a.votos ||
        (a.en_base ? a.posicion_base : 1e6 + a.id) - (b.en_base ? b.posicion_base : 1e6 + b.id)
    );
}

export const votosUsados = ({ votos }, invitadoId) => votos.filter((v) => v.invitado_id === invitadoId).length;

// ---------- Escrituras (API de la app) ----------

async function llamar(ruta, cuerpo) {
  const respuesta = await fetch(`/api/fiesta/${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cuerpo),
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new Error(datos.error || 'Algo ha fallado. Inténtalo otra vez.');
  return datos;
}

export const crearFiesta = (nombre, votosPorPersona, canciones) =>
  llamar('crear', { nombre, votosPorPersona, canciones });
export const votar = (codigo, cancionId, invitado) =>
  llamar('votar', { codigo, cancionId, invitadoId: invitado.id, nombre: invitado.nombre });
export const quitarVoto = (codigo, cancionId, invitado) =>
  llamar('quitar-voto', { codigo, cancionId, invitadoId: invitado.id });
export const proponerCancion = (codigo, cancion, invitado) =>
  llamar('proponer', { codigo, cancion, invitadoId: invitado.id, nombre: invitado.nombre });
export const accionAnfitrion = (codigo, clave, accion, extra = {}) =>
  llamar('anfitrion', { codigo, clave, accion, ...extra });

export async function buscarParaFiesta(codigo, q) {
  const respuesta = await fetch(`/api/fiesta/buscar?${new URLSearchParams({ codigo, q })}`);
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo buscar.');
  return datos.canciones;
}
