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
  renderAnadirMas,
  panelAnadirAbierto,
  onPanelAnadir,
  onSave,
  onUpdate,
  guardada,
  hayCambiosSinGuardar,
  estadoGuardado,
  isFavorite,
  onToggleFavorite,
  onRemoveTrack,
  nombreSugerido,
}) {
  const [nombre, setNombre] = useState(() => nombreSugerido || nombrePorDefecto());
  const [publica, setPublica] = useState(true);
  const [avisoCompartir, setAvisoCompartir] = useState("");

  // Menú de compartir del móvil; si no existe (ordenador), WhatsApp Web
  const compartir = async () => {
    const texto = `Escucha «${guardada.nombre}», hecha con Taste Mixer`;
    if (navigator.share) {
      try {
        await navigator.share({ title: guardada.nombre, text: texto, url: guardada.url });
      } catch {
        // el usuario canceló el menú de compartir
      }
      return;
    }
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${texto}: ${guardada.url}`)}`,
      "_blank",
      "noreferrer"
    );
    setAvisoCompartir("Abriendo WhatsApp…");
  };

  // Canciones que aún no están en Spotify (solo si la lista está vinculada a una playlist)
  const idsGuardados = guardada ? new Set(guardada.ids.split(",")) : null;

  const minutosTotales = Math.round(
    tracks.reduce((total, t) => total + (t.duration_ms || 0), 0) / 60000
  );

  return (
    <div className="card bloque-playlist" id="playlist-generada">
      <div className="bloque-cabecera">
        <h3 className="bloque-titulo">
          {guardada?.existente ? `Tu playlist «${guardada.nombre}»` : "Playlist generada"}
        </h3>
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
          onClick={() => onPanelAnadir(!panelAnadirAbierto)}
          disabled={loading || tracks.length === 0}
        >
          Añadir más canciones
        </button>
      </div>

      {panelAnadirAbierto && tracks.length > 0 && renderAnadirMas(() => onPanelAnadir(false))}

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
          {guardada ? (
            <>
              <button
                type="button"
                className="boton-playlist"
                onClick={onUpdate}
                disabled={loading || estadoGuardado.guardando || !hayCambiosSinGuardar}
              >
                {estadoGuardado.guardando
                  ? "Guardando..."
                  : `Actualizar «${guardada.nombre}» en Spotify`}
              </button>
              <button
                type="button"
                className="boton-playlist secundario"
                onClick={() => onSave(nombre.trim() || nombrePorDefecto(), publica)}
                disabled={loading || estadoGuardado.guardando}
              >
                Guardar como nueva
              </button>
            </>
          ) : (
            <button
              type="button"
              className="boton-playlist"
              onClick={() => onSave(nombre.trim() || nombrePorDefecto(), publica)}
              disabled={loading || estadoGuardado.guardando}
            >
              {estadoGuardado.guardando ? "Guardando..." : "Guardar en mi Spotify"}
            </button>
          )}
          <label className="popularidad-label">
            <input
              type="checkbox"
              checked={publica}
              onChange={(e) => setPublica(e.target.checked)}
            />{" "}
            Pública (para poder compartirla con tus amigos)
          </label>
        </div>
      )}

      {guardada && (
        <p className="texto-estado-busqueda">
          {hayCambiosSinGuardar
            ? "✏️ Tienes cambios sin guardar en Spotify."
            : estadoGuardado.mensaje || "✅ Todo guardado en Spotify."}{" "}
          <a href={guardada.url} target="_blank" rel="noreferrer">
            Abrir en Spotify
          </a>
        </p>
      )}
      {guardada && (
        <div className="botones-playlist">
          <button type="button" className="boton-playlist secundario" onClick={compartir}>
            📤 Compartir
          </button>
          {avisoCompartir && <span className="texto-estado-busqueda">{avisoCompartir}</span>}
        </div>
      )}
      {guardada && guardada.publica === false && (
        <p className="texto-estado-busqueda">
          🔒 Es privada: tus amigos no podrán abrirla. Hazla pública en Spotify (⋯ → Hacer pública).
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
              esNueva={idsGuardados !== null && !idsGuardados.has(track.id)}
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
