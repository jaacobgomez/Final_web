/* eslint-disable @next/next/no-img-element */
"use client";

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

  const artistaPrincipal = track.artists?.[0];

  return (
    <div className="track-card-contenedor">
      <div className="track-card">
        {imagen && (
          <img src={imagen} alt={track.name} className="track-card-imagen" />
        )}

        <div className="track-card-info">
          <div className="track-card-titulos">
            <span className="track-card-nombre">
              {esNueva && <span className="etiqueta-nueva">NUEVA</span>}
              {track.name}
            </span>
            <span className="track-card-artista">
              {artistas} · {track.album?.name}
            </span>
          </div>

          <div className="track-card-extra">
            <span className="track-card-duracion">
              {minutos}:{segundos}
            </span>
            {track.external_urls?.spotify && (
              <a
                className="track-card-popularidad"
                href={track.external_urls.spotify}
                target="_blank"
                rel="noreferrer"
              >
                Abrir en Spotify
              </a>
            )}
          </div>
        </div>

        <div className="track-card-acciones">
          <button
            type="button"
            className={`track-card-boton ${reproduciendo ? "track-card-boton-activo" : ""}`}
            onClick={() => onReproducir(reproduciendo ? null : track.id)}
            aria-label={reproduciendo ? "Cerrar reproductor" : "Escuchar"}
            title={reproduciendo ? "Cerrar reproductor" : "Escuchar"}
          >
            {reproduciendo ? "■" : "▶"}
          </button>

          <button
            type="button"
            className="track-card-boton"
            onClick={() => onCambiar(track)}
            disabled={cambiando}
            aria-label="Cambiar por otra parecida"
            title="Cambiar por otra parecida"
          >
            {cambiando ? "…" : "🔄"}
          </button>

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

          {artistaPrincipal && (
            <button
              type="button"
              className="track-card-boton track-card-eliminar"
              onClick={() => onVetar(artistaPrincipal)}
              aria-label={`No quiero más de ${artistaPrincipal.name}`}
              title={`No quiero más de ${artistaPrincipal.name}`}
            >
              🚫
            </button>
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
