import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/servidor/supabaseAdmin';
import { buscarFiesta, error, leerJson, textoValido } from '@/lib/servidor/fiesta';

export async function POST(request) {
  const { codigo, cancionId, invitadoId, nombre } = await leerJson(request);
  if (!textoValido(invitadoId, 64) || !textoValido(nombre, 30)) return error('Falta tu nombre.');
  const fiesta = await buscarFiesta(codigo);
  if (!fiesta) return error('Esa fiesta no existe o ya terminó.', 404);

  const db = supabaseAdmin();
  const { data: cancion } = await db
    .from('canciones')
    .select('id')
    .eq('id', Number(cancionId))
    .eq('fiesta_id', fiesta.id)
    .maybeSingle();
  if (!cancion) return error('Esa canción ya no está en la fiesta.', 404);

  const { error: fallo } = await db.from('votos').insert({
    cancion_id: cancion.id,
    fiesta_id: fiesta.id,
    invitado_id: invitadoId,
    nombre: nombre.trim(),
  });
  if (fallo?.message?.includes('SIN_VOTOS')) return error('Ya has usado todos tus votos: quita uno para votar otra.', 409);
  if (fallo && fallo.code !== '23505') {
    console.error('Votar:', fallo.message);
    return error('No se pudo votar.', 500);
  }
  return NextResponse.json({ ok: true });
}
