'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';
import DashboardPage from "./dashboard/page";

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
        <p className="texto-pequeno">Proyecto final · Programación Web I</p>

        <h2 className="titulo-inicio">Spotify Taste Mixer</h2>

        <p className="texto-descripcion">
          Genera playlists personalizadas mezclando tus artistas, géneros y
          épocas favoritas. Todo usando tu cuenta de Spotify.
        </p>

        <ul className="lista-caracteristicas">
          <li>🎧 Widgets para artistas, géneros y décadas.</li>
          <li>⭐ Marca canciones como favoritas y guárdalas.</li>
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
          Necesitas una cuenta de Spotify (gratuita o premium) para continuar.
        </p>
      </div>
    </section>
  );
}