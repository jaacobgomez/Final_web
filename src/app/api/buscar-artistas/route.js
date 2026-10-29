import { NextResponse } from 'next/server';
import { buscarArtistasApp } from '@/lib/servidor/spotifyApp';

// Buscador de artistas para quien no puede iniciar sesión (gusto a mano en Mezcla de grupo).
// Usa la clave de la app: no toca ninguna cuenta personal.
export async function GET(request) {
  const q = (new URL(request.url).searchParams.get('q') || '').trim();
  if (q.length < 2 || q.length > 60) {
    return NextResponse.json({ error: 'Escribe al menos 2 letras.' }, { status: 400 });
  }
  try {
    return NextResponse.json({ artistas: await buscarArtistasApp(q) });
  } catch (fallo) {
    console.error('Buscar artistas:', fallo.message);
    return NextResponse.json({ error: 'Spotify no responde ahora mismo.' }, { status: 502 });
  }
}
