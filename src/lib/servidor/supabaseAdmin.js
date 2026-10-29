import { createClient } from '@supabase/supabase-js';

// Cliente con la clave secreta: SOLO se usa en las rutas /api (servidor).
// Es el único que puede escribir en la base de datos.
let cliente = null;

export function supabaseAdmin() {
  if (!cliente) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const clave = process.env.SUPABASE_SECRET_KEY;
    if (!url || !clave) throw new Error('Faltan las claves de Supabase en el servidor.');
    cliente = createClient(url, clave, { auth: { persistSession: false } });
  }
  return cliente;
}
