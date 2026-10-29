import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/servidor/supabaseAdmin';
import { buscarFiesta, error, leerJson, textoValido } from '@/lib/servidor/fiesta';

export async function POST(request) {
  const { codigo, cancionId, invitadoId } = await leerJson(request);
  if (!textoValido(invitadoId, 64)) return error('Falta tu identificador.');
  const fiesta = await buscarFiesta(codigo);
  if (!fiesta) return error('Esa fiesta no existe o ya terminó.', 404);

  const { error: fallo } = await supabaseAdmin()
    .from('votos')
    .delete()
    .eq('fiesta_id', fiesta.id)
    .eq('cancion_id', Number(cancionId))
    .eq('invitado_id', invitadoId);
  if (fallo) {
    console.error('Quitar voto:', fallo.message);
    return error('No se pudo quitar el voto.', 500);
  }
  return NextResponse.json({ ok: true });
}
