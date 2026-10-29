import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/servidor/supabaseAdmin';
import { cancionLigera, obtenerCancionApp } from '@/lib/servidor/spotifyApp';
import { buscarFiesta, error, leerJson, textoValido } from '@/lib/servidor/fiesta';

// Un invitado añade una canción nueva: cuenta como uno de sus votos.
export async function POST(request) {
  const { codigo, cancion, invitadoId, nombre } = await leerJson(request);
  if (!textoValido(invitadoId, 64) || !textoValido(nombre, 30)) return error('Falta tu nombre.');
  if (!/^[A-Za-z0-9]{10,40}$/.test(cancion?.id || '')) return error('Canción no válida.');
  const fiesta = await buscarFiesta(codigo);
  if (!fiesta) return error('Esa fiesta no existe o ya terminó.', 404);

  const db = supabaseAdmin();

  // Antes de añadir nada, que le quede algún voto
  const { count } = await db
    .from('votos')
    .select('*', { count: 'exact', head: true })
    .eq('fiesta_id', fiesta.id)
    .eq('invitado_id', invitadoId);
  if (count >= fiesta.votos_por_persona) {
    return error('Ya has usado todos tus votos: quita uno para añadir otra.', 409);
  }

  // Los datos se piden a Spotify para que nadie cuele una canción inventada;
  // si Spotify no deja leerla, se usa la copia limpia que viene del buscador
  let datos;
  try {
    datos = await obtenerCancionApp(cancion.id);
  } catch {
    datos = cancionLigera(cancion);
    datos.uri = `spotify:track:${cancion.id}`;
  }

  // Si ya estaba (otro la propuso antes), simplemente se vota
  const { data: existente } = await db
    .from('canciones')
    .select('id')
    .eq('fiesta_id', fiesta.id)
    .eq('track_id', cancion.id)
    .maybeSingle();

  let cancionId = existente?.id;
  if (!cancionId) {
    const { data, error: fallo } = await db
      .from('canciones')
      .insert({ fiesta_id: fiesta.id, track_id: cancion.id, datos, propuesta_por: nombre.trim() })
      .select('id')
      .single();
    if (fallo) {
      console.error('Proponer:', fallo.message);
      return error('No se pudo añadir la canción.', 500);
    }
    cancionId = data.id;
  }

  const { error: fallo } = await db.from('votos').insert({
    cancion_id: cancionId,
    fiesta_id: fiesta.id,
    invitado_id: invitadoId,
    nombre: nombre.trim(),
  });
  if (fallo?.message?.includes('SIN_VOTOS')) return error('Ya has usado todos tus votos.', 409);
  if (fallo && fallo.code !== '23505') return error('Añadida, pero no se pudo votar.', 500);

  return NextResponse.json({ ok: true, cancionId });
}
