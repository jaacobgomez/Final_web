import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/servidor/supabaseAdmin';
import { buscarFiesta, error, esAnfitrion, leerJson } from '@/lib/servidor/fiesta';

// Acciones que solo puede hacer quien creó la fiesta: quitar una canción o terminarla.
export async function POST(request) {
  const { codigo, clave, accion, cancionId } = await leerJson(request);
  const fiesta = await buscarFiesta(codigo);
  if (!fiesta) return error('Esa fiesta no existe o ya terminó.', 404);
  if (!(await esAnfitrion(fiesta.id, clave))) return error('Solo el anfitrión puede hacer esto.', 403);

  const db = supabaseAdmin();
  if (accion === 'quitar') {
    const { error: fallo } = await db
      .from('canciones')
      .delete()
      .eq('fiesta_id', fiesta.id)
      .eq('id', Number(cancionId));
    if (fallo) return error('No se pudo quitar.', 500);
    return NextResponse.json({ ok: true });
  }

  if (accion === 'terminar') {
    // Borra la fiesta con sus canciones, votos y nombres de invitados
    const { error: fallo } = await db.from('fiestas').delete().eq('id', fiesta.id);
    if (fallo) return error('No se pudo terminar.', 500);
    return NextResponse.json({ ok: true });
  }

  return error('Acción desconocida.');
}
