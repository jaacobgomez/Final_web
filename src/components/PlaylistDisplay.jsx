"use client";

import { useState } from "react";
import TrackCard from "./TrackCard";

function nombrePorDefecto() {
  const hoy = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  return `Taste Mixer · ${hoy}`;
}

export default function PlaylistDisplay({
  tracks,
  loading,
  error,
  avisos = [],
  onGenerate,
  onAddMore,
  onSave,
  estadoGuardado,
  isFavorite,
  onToggleFavorite,
  onRemoveTrack,
}) {
  const [nombre, setNombre] = useState(nombrePorDefecto);

  const minutosTotales = Math.round(
    tracks.reduce((total, t) => total + (t.duration_ms || 0), 0) / 60000
  );

  return (
    <div className="card bloque-playlist">
      <div className="bloque-cabecera">
        <h3 className="bloque-titulo">Playlist generada</h3>
        <p className="bloque-subtitulo">
          {tracks.length > 0
            ? `${tracks.length} canciones · ${minutosTotales} min`
            : "Aquí aparecen las canciones según tus widgets."}
        </p>
      </div>

      <div className="botones-playlist">
        <button
          type="button"
          className="boton-playlist"
          onClick={onGenerate}
          disabled={loading}
        >
          {loading ? "Generando..." : "Generar playlist"}
        </button>

        <button
          type="button"
          className="boton-playlist secundario"
          onClick={onAddMore}
          disabled={loading || tracks.length === 0}
        >
          Añadir más canciones
        </button>
      </div>

      {error && <p className="texto-error-busqueda">{error}</p>}
      {avisos.map((aviso) => (
        <p key={aviso} className="texto-estado-busqueda">{aviso}</p>
      ))}

      {tracks.length > 0 && (
        <div className="botones-playlist">
          <input
            type="text"
            className="widget-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            aria-label="Nombre de la playlist"
          />
          <button
            type="button"
            className="boton-playlist"
            onClick={() => onSave(nombre.trim() || nombrePorDefecto())}
            disabled={loading || estadoGuardado.guardando}
          >
            {estadoGuardado.guardando ? "Guardando..." : "Guardar en mi Spotify"}
          </button>
        </div>
      )}

      {estadoGuardado.url && (
        <p className="texto-estado-busqueda">
          ✅ Guardada.{" "}
          <a href={estadoGuardado.url} target="_blank" rel="noreferrer">
            Abrir en Spotify
          </a>
        </p>
      )}
      {estadoGuardado.error && (
        <p className="texto-error-busqueda">{estadoGuardado.error}</p>
      )}

      {tracks.length === 0 && !loading && !error && (
        <p className="lista-vacia">
          Todavía no hay canciones. Configura tus widgets y pulsa
          <strong> &quot;Generar playlist&quot;</strong>.
        </p>
      )}

      {tracks.length > 0 && (
        <div className="lista-playlist">
          {tracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              esFavorito={isFavorite(track.id)}
              onToggleFavorito={onToggleFavorite}
              onEliminar={onRemoveTrack}
            />
          ))}
        </div>
      )}

      <p className="nota-inicio">Datos y carátulas proporcionados por Spotify.</p>
    </div>
  );
}
