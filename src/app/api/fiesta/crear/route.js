import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/servidor/supabaseAdmin';
import { cancionLigera } from '@/lib/servidor/spotifyApp';
import { claveAleatoria, codigoNuevo, error, hash, leerJson, textoValido } from '@/lib/servidor/fiesta';

// Crear una fiesta (con o sin lista base). Devuelve el código y la clave del anfitrión.
export async function POST(request) {
  const { nombre, votosPorPersona = 3, canciones = [] } = await leerJson(request);
  if (!textoValido(nombre, 60)) return error('Ponle un nombre a la fiesta (máx. 60 caracteres).');
  const votos = Math.round(Number(votosPorPersona));
  if (!(votos >= 1 && votos <= 10)) return error('Los votos por persona van de 1 a 10.');
  if (!Array.isArray(canciones) || canciones.length > 300) return error('La lista base es demasiado larga.');

  try {
    const db = supabaseAdmin();
    // De paso, se borran las fiestas caducadas (con sus canciones y votos)
    await db.from('fiestas').delete().lt('caduca', new Date().toISOString());

    // Código único: se reintenta si ya existe
    let fiesta = null;
    for (let intento = 0; intento < 5 && !fiesta; intento++) {
      const { data, error: fallo } = await db
        .from('fiestas')
        .insert({ codigo: codigoNuevo(), nombre: nombre.trim(), votos_por_persona: votos })
        .select('id, codigo')
        .single();
      if (!fallo) fiesta = data;
      else if (fallo.code !== '23505') throw fallo;
    }
    if (!fiesta) return error('No he podido generar un código. Inténtalo otra vez.', 500);

    const clave = claveAleatoria();
    await db.from('fiestas_secretos').insert({ fiesta_id: fiesta.id, clave_anfitrion_hash: hash(clave) });

    const vistas = new Set();
    const filas = canciones
      .filter((t) => typeof t?.id === 'string' && typeof t?.uri === 'string' && !vistas.has(t.id) && vistas.add(t.id))
      .map((t, i) => ({
        fiesta_id: fiesta.id,
        track_id: t.id,
        datos: cancionLigera(t),
        en_base: true,
        posicion_base: i,
      }));
    if (filas.length > 0) {
      const { error: fallo } = await db.from('canciones').insert(filas);
      if (fallo) throw fallo;
    }

    return NextResponse.json({ codigo: fiesta.codigo, claveAnfitrion: clave });
  } catch (fallo) {
    console.error('Crear fiesta:', fallo.message);
    return error('No se pudo crear la fiesta.', 500);
  }
}
