/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";

// Tarjeta limpia: carátula (toca para escuchar), título y duración.
// El resto de acciones va en el menú "⋯" para que la lista respire.
export default function TrackCard({
  track,
  esFavorito,
  esNueva = false,
  onToggleFavorito,
  onEliminar,
  reproduciendo = false,
  onReproducir,
  cambiando = false,
  onCambiar,
  onVetar,
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const imagen =
    track.album?.images && track.album.images.length > 0
      ? track.album.images[track.album.images.length - 1].url
      : null;

  const artistas = track.artists?.map((a) => a.name).join(", ");
  const artistaPrincipal = track.artists?.[0];
  const duracionMs = track.duration_ms || 0;
  const minutos = Math.floor(duracionMs / 60000);
  const segundos = Math.floor((duracionMs % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  // Cada opción cierra el menú al elegirla
  const elegir = (accion) => () => {
    setMenuAbierto(false);
    accion();
  };

  return (
    <div className="track-card-contenedor">
      <div className={`track-card ${reproduciendo ? "track-card-sonando" : ""}`}>
        <button
          type="button"
          className="track-card-portada"
          onClick={() => onReproducir(reproduciendo ? null : track.id)}
          aria-label={reproduciendo ? "Cerrar reproductor" : `Escuchar ${track.name}`}
        >
          {imagen ? (
            <img src={imagen} alt="" className="track-card-imagen" />
          ) : (
            <span className="track-card-imagen track-card-sin-imagen">♫</span>
          )}
          <span className="track-card-play">{reproduciendo ? "■" : "▶"}</span>
        </button>

        <div className="track-card-info">
          <span className="track-card-nombre">
            {esNueva && <span className="etiqueta-nueva">NUEVA</span>}
            {track.explicit && (
              <span className="etiqueta-explicita" title="Letra explícita">
                E
              </span>
            )}
            {track.name}
            {esFavorito && <span className="track-card-estrella"> ★</span>}
          </span>
          <span className="track-card-artista">
            {artistas}
            {track.album?.name ? ` · ${track.album.name}` : ""}
          </span>
        </div>

        <span className="track-card-duracion">
          {cambiando ? "…" : `${minutos}:${segundos}`}
        </span>

        <div className="track-card-menu">
          <button
            type="button"
            className="track-card-mas"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-label="Más opciones"
            aria-expanded={menuAbierto}
          >
            ⋯
          </button>

          {menuAbierto && (
            <>
              {/* Capa invisible: tocar fuera cierra el menú */}
              <div className="track-card-capa" onClick={() => setMenuAbierto(false)} />
              <ul className="track-card-opciones" role="menu">
                <li>
                  <button type="button" onClick={elegir(() => onReproducir(reproduciendo ? null : track.id))}>
                    {reproduciendo ? "■ Cerrar reproductor" : "▶ Escuchar"}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={elegir(() => onToggleFavorito(track))}>
                    {esFavorito ? "☆ Quitar de favoritas" : "★ Marcar como favorita"}
                  </button>
                </li>
                <li>
                  <button type="button" disabled={cambiando} onClick={elegir(() => onCambiar(track))}>
                    🔄 Cambiar por otra parecida
                  </button>
                </li>
                {track.external_urls?.spotify && (
                  <li>
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setMenuAbierto(false)}
                    >
                      ↗ Abrir en Spotify
                    </a>
                  </li>
                )}
                <li className="track-card-separador" />
                <li>
                  <button type="button" className="opcion-peligro" onClick={elegir(() => onEliminar(track.id))}>
                    ✕ Quitar de la lista
                  </button>
                </li>
                {artistaPrincipal && (
                  <li>
                    <button type="button" className="opcion-peligro" onClick={elegir(() => onVetar(artistaPrincipal))}>
                      🚫 No quiero más de {artistaPrincipal.name}
                    </button>
                  </li>
                )}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Reproductor oficial de Spotify: con sesión en el navegador suena entera; si no, un fragmento */}
      {reproduciendo && (
        <iframe
          className="track-card-reproductor"
          src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&theme=0`}
          height="80"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`Reproductor: ${track.name}`}
        />
      )}
    </div>
  );
}
