"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { useSesion } from "@/lib/useSesion";

export default function Cabecera() {
  const rutaActual = usePathname();
  const router = useRouter();
  const autenticado = useSesion() === true;

  // IMPORTANTE: el nombre de la función coincide con el onClick
  const manejarLogout = () => {
    logout();
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

            <li className="panel-li">
              <Link
                href="/grupo"
                className={`panel ${
                  rutaActual?.startsWith("/grupo") ? "bg-white/10" : ""
                }`}
              >
                Grupo
              </Link>
            </li>

            <li className="panel-li">
              <Link
                href="/fiesta"
                className={`panel ${
                  rutaActual?.startsWith("/fiesta") ? "bg-white/10" : ""
                }`}
              >
                Fiesta
              </Link>
            </li>

            <li className="panel-li">
              <Link
                href="/resumen"
                className={`panel ${
                  rutaActual?.startsWith("/resumen") ? "bg-white/10" : ""
                }`}
              >
                Resumen
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
