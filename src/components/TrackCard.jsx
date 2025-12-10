/* eslint-disable @next/next/no-img-element */
"use client";

export default function TrackCard({
  track,
  esFavorito,
  onToggleFavorito,
  onEliminar,
}) {
  const imagen =
    track.album?.images && track.album.images.length > 0
      ? track.album.images[track.album.images.length - 1].url
      : null;

  const artistas = track.artists?.map((a) => a.name).join(", ");
  const duracionMs = track.duration_ms || 0;
  const minutos = Math.floor(duracionMs / 60000);
  const segundos = Math.floor((duracionMs % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  return (
    <div className="track-card">
      {imagen && (
        <img src={imagen} alt={track.name} className="track-card-imagen" />
      )}

      <div className="track-card-info">
        <div className="track-card-titulos">
          <span className="track-card-nombre">{track.name}</span>
          <span className="track-card-artista">
            {artistas} · {track.album?.name}
          </span>
        </div>

        <div className="track-card-extra">
          <span className="track-card-duracion">
            {minutos}:{segundos}
          </span>
          <span className="track-card-popularidad">
            Popularidad: {track.popularity}
          </span>
        </div>
      </div>

      <div className="track-card-acciones">
        <button
          type="button"
          className={`track-card-boton track-card-favorito ${
            esFavorito ? "track-card-favorito-activo" : ""
          }`}
          onClick={() => onToggleFavorito(track)}
        >
          {esFavorito ? "★" : "☆"}
        </button>

        <button
          type="button"
          className="track-card-boton track-card-eliminar"
          onClick={() => onEliminar(track.id)}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
