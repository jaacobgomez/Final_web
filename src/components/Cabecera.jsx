"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";

export default function Cabecera() {
  const rutaActual = usePathname();
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);

  // Verificar estado de autenticación al cargar y cuando la ruta cambie
  useEffect(() => {
    try {
      setAutenticado(isAuthenticated());
    } catch (error) {
      setAutenticado(false);
    }
  }, [rutaActual]);

  // IMPORTANTE: el nombre de la función coincide con el onClick
  const manejarLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("spotify_token");
      localStorage.removeItem("spotify_refresh_token");
      localStorage.removeItem("spotify_token_expiration");
    }
    setAutenticado(false);
    router.push("/");
  };

  return (
    <header className="header">
      <div className="logo-nav-container">
        {/* Lado izquierdo: logo + título */}
        <div className="titulo-logo">
          <span className="logo-emoji">🎵</span>
          <div>
            <h1 className="titulo-logo-Spotify">Spotify Taste Mixer</h1>
            <p className="texto-subtitulo">
              Mezcla tus gustos y descubre música
            </p>
          </div>
        </div>

        {/* Lado derecho: menu + sesión */}
        <nav className="nav-links">
          <ul className="nav-ul">
            <li>
              <Link
                href="/"
                className={`inicio ${
                  rutaActual === "/" ? "bg-white/10" : ""
                }`}
              >
                Inicio
              </Link>
            </li>

            <li className="panel-li">
              <Link
                href="/dashboard"
                className={`panel ${
                  rutaActual?.startsWith("/dashboard") ? "bg-white/10" : ""
                }`}
              >
                Panel
              </Link>
            </li>

            <li>
              {autenticado ? (
                <button
                  onClick={manejarLogout}
                  className="cerrar-sesion-button"
                >
                  Cerrar sesión
                </button>
              ) : (
                <span className="iniciar-sesion-texto">
                  Inicia sesión para ver el panel
                </span>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
