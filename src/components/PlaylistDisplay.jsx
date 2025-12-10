"use client";

import TrackCard from "./TrackCard";

export default function PlaylistDisplay({
  tracks,
  loading,
  error,
  onGenerate,
  onAddMore,
  isFavorite,
  onToggleFavorite,
  onRemoveTrack,
}) {
  return (
    <div className="card bloque-playlist">
      <div className="bloque-cabecera">
        <h3 className="bloque-titulo">Playlist generada</h3>
        <p className="bloque-subtitulo">
          Aquí aparecen las canciones según tus widgets. Puedes regenerarla,
          añadir más temas, marcar favoritas o quitar las que no te encajen.
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
    </div>
  );
}
