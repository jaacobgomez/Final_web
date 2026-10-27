'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function PaginaInicio() {
  const router = useRouter();

  // Si ya está logueado, lo mandamos directo al dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const manejarLoginSpotify = () => {
    const url = getSpotifyAuthUrl();
    window.location.href = url;
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

        <button
          type="button"
          onClick={manejarLoginSpotify}
          className="boton-inicio"
        >
          Iniciar sesión con Spotify
        </button>

        <p className="nota-inicio">
          Acceso por invitación: tu correo de Spotify tiene que estar dado de alta en la app.
        </p>
      </div>
    </section>
  );
}