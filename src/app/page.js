'use client';

import Link from 'next/link';
import { getSpotifyAuthUrl, logout } from '@/lib/auth';
import { useClientIdPropio, useSesion } from '@/lib/useSesion';

export default function PaginaInicio() {
  // null = todavía no sabemos (render del servidor), true/false = con o sin sesión
  const sesion = useSesion();
  const clientIdPropio = useClientIdPropio();

  const manejarLoginSpotify = async () => {
    window.location.href = await getSpotifyAuthUrl();
  };

  return (
    <section className="portada-inicio">
      <div className="tarjeta-inicio card">
        <p className="texto-pequeno">Para amigos · Hecho por Jacob</p>

        <h2 className="titulo-inicio">Spotify Taste Mixer</h2>

        <p className="texto-descripcion">
          Genera playlists personalizadas mezclando tus artistas, géneros y
          épocas favoritas. Todo usando tu cuenta de Spotify.
        </p>

        <ul className="lista-caracteristicas">
          <li>🎧 Widgets para artistas, géneros y décadas.</li>
          <li>💾 Guarda la playlist directamente en tu Spotify.</li>
          <li>📱 Interfaz oscura, sencilla y adaptada a móvil.</li>
        </ul>

        {sesion === true && (
          <>
            <p className="texto-descripcion">✅ Ya has iniciado sesión con Spotify.</p>
            <Link href="/dashboard" className="boton-inicio">
              Ir al panel de mezcla
            </Link>
            <p className="nota-inicio">
              ¿No eres tú?{' '}
              <button type="button" className="boton-info-decadas" onClick={logout}>
                Cerrar sesión
              </button>
            </p>
          </>
        )}

        {sesion === false && (
          <>
            <button
              type="button"
              onClick={manejarLoginSpotify}
              className="boton-inicio"
            >
              Iniciar sesión con Spotify
            </button>

            {clientIdPropio ? (
              <p className="nota-inicio">
                Entrarás con tu propia clave.{' '}
                <Link href="/mi-clave">Cambiarla</Link>
              </p>
            ) : (
              <p className="nota-inicio">
                Acceso por invitación: tu correo de Spotify tiene que estar dado de alta en la app.{' '}
                <Link href="/mi-clave">¿No estás en la lista? Usa tu propia clave</Link>
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
