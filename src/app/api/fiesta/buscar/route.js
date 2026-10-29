import { NextResponse } from 'next/server';
import { buscarCancionesApp } from '@/lib/servidor/spotifyApp';
import { buscarFiesta, error } from '@/lib/servidor/fiesta';

// Búsqueda para invitados (sin sesión de Spotify). Solo funciona con una fiesta vigente.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  if (q.length < 2 || q.length > 80) return error('Escribe al menos 2 letras.');
  if (!(await buscarFiesta(searchParams.get('codigo')))) return error('Esa fiesta no existe o ya terminó.', 404);

  try {
    return NextResponse.json({ canciones: await buscarCancionesApp(q) });
  } catch (fallo) {
    console.error('Buscar en fiesta:', fallo.message);
    return error('Spotify no responde ahora mismo.', 502);
  }
}
