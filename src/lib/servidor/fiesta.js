import { createHash, randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from './supabaseAdmin';

// Utilidades comunes de las rutas /api/fiesta/*

export const hash = (texto) => createHash('sha256').update(texto).digest('hex');

export const claveAleatoria = () => randomBytes(24).toString('base64url');

// PERLA-42: palabra fácil de dictar + número
const PALABRAS = ['PERLA', 'RITMO', 'DISCO', 'FIESTA', 'VINILO', 'FOCO', 'BAILE', 'TEMAZO', 'COMBO', 'ONDA'];
export function codigoNuevo() {
  const palabra = PALABRAS[randomBytes(1)[0] % PALABRAS.length];
  const numero = 10 + (randomBytes(2).readUInt16BE(0) % 90);
  return `${palabra}-${numero}`;
}

export const error = (mensaje, status = 400) => NextResponse.json({ error: mensaje }, { status });

export const textoValido = (texto, max) =>
  typeof texto === 'string' && texto.trim().length > 0 && texto.trim().length <= max;

// Fiesta vigente por código (o null)
export async function buscarFiesta(codigo) {
  if (!textoValido(codigo, 20)) return null;
  const { data } = await supabaseAdmin()
    .from('fiestas')
    .select('id, codigo, nombre, votos_por_persona, caduca')
    .eq('codigo', codigo.trim().toUpperCase())
    .gt('caduca', new Date().toISOString())
    .maybeSingle();
  return data;
}

// Comprueba la clave del anfitrión (la guarda su móvil al crear la fiesta)
export async function esAnfitrion(fiestaId, clave) {
  if (!textoValido(clave, 100)) return false;
  const { data } = await supabaseAdmin()
    .from('fiestas_secretos')
    .select('clave_anfitrion_hash')
    .eq('fiesta_id', fiestaId)
    .maybeSingle();
  return data?.clave_anfitrion_hash === hash(clave);
}

export async function leerJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
