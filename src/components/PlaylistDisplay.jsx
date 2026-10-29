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
  onRemoveTracks,
  onSwapTrack,
  onSwapTracks,
  cambiandoId,
  onBanArtist,
  ultimaAccion,
  onDeshacer,
  onOrdenar,
  nombreSugerido,
}) {
  const [nombre, setNombre] = useState(() => nombreSugerido || nombrePorDefecto());
  const [publica, setPublica] = useState(true);
  const [conPortada, setConPortada] = useState(true);
  // Solo suena una canción a la vez
  const [reproduciendoId, setReproduciendoId] = useState(null);
  const [avisoCompartir, setAvisoCompartir] = useState("");
  // Selección múltiple: null = desactivada; si no, ids marcados
  const [seleccion, setSeleccion] = useState(null);

  const alternarSeleccion = (id) =>
    setSeleccion((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  // Marca (o desmarca, si ya estaban todas) las canciones de un artista
  const seleccionarArtista = (idArtista) => {
    const suyas = tracks.filter((t) => t.artists?.some((a) => a.id === idArtista)).map((t) => t.id);
    setSeleccion((s) =>
      suyas.every((id) => s.includes(id)) ? s.filter((id) => !suyas.includes(id)) : [...new Set([...s, ...suyas])]
    );
  };
  const artistasEnLista = [
    ...new Map(tracks.flatMap((t) => t.artists || []).map((a) => [a.id, a])).values(),
  ].sort((a, b) => a.name.localeCompare(b.name));

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
                onClick={() => onSave(nombre.trim() || nombrePorDefecto(), publica, conPortada)}
                disabled={loading || estadoGuardado.guardando}
              >
                Guardar como nueva
              </button>
            </>
          ) : (
            <button
              type="button"
              className="boton-playlist"
              onClick={() => onSave(nombre.trim() || nombrePorDefecto(), publica, conPortada)}
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
          <label className="popularidad-label">
            <input
              type="checkbox"
              checked={conPortada}
              onChange={(e) => setConPortada(e.target.checked)}
            />{" "}
            Portada automática al guardarla como nueva
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

      {/* Barra de la lista: deshacer a la izquierda, ordenar a la derecha */}
      {tracks.length > 0 && (ultimaAccion || tracks.length > 1) && (
        <div className="barra-lista">
          {ultimaAccion ? (
            <button type="button" className="boton-info-decadas" onClick={onDeshacer} disabled={loading}>
              ↩️ Deshacer: {ultimaAccion}
            </button>
          ) : (
            <span />
          )}
          {!seleccion && (
            <button type="button" className="boton-info-decadas" onClick={() => setSeleccion([])} disabled={loading}>
              ☑️ Seleccionar
            </button>
          )}
          {tracks.length > 1 && !seleccion && (
            <select
              className="widget-input barra-lista-ordenar"
              value=""
              disabled={loading}
              onChange={(e) => e.target.value && onOrdenar(e.target.value)}
              aria-label="Ordenar la lista"
            >
              <option value="">↕️ Ordenar…</option>
              <option value="barajar">🔀 Barajar</option>
              <option value="anio">📅 Por año</option>
              <option value="alternar">🎤 Alternar artistas</option>
            </select>
          )}
        </div>
      )}

      {seleccion && tracks.length > 0 && (
        <div className="barra-seleccion">
          <span className="texto-estado-busqueda">{seleccion.length} seleccionadas</span>
          <button
            type="button"
            className="boton-info-decadas"
            onClick={() => setSeleccion(seleccion.length === tracks.length ? [] : tracks.map((t) => t.id))}
          >
            {seleccion.length === tracks.length ? "Ninguna" : "Todas"}
          </button>
          <select
            className="widget-input barra-lista-ordenar"
            value=""
            onChange={(e) => e.target.value && seleccionarArtista(e.target.value)}
            aria-label="Seleccionar las de un artista"
          >
            <option value="">🎤 Las de…</option>
            {artistasEnLista.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <button
            type="button"
            className="boton-info-decadas"
            disabled={loading || seleccion.length === 0}
            onClick={() => {
              onSwapTracks(seleccion);
              setSeleccion(null);
            }}
          >
            🔄 Cambiar
          </button>
          <button
            type="button"
            className="boton-info-decadas opcion-peligro"
            disabled={loading || seleccion.length === 0}
            onClick={() => {
              onRemoveTracks(seleccion);
              setSeleccion(null);
            }}
          >
            ✕ Quitar
          </button>
          <button type="button" className="boton-info-decadas" onClick={() => setSeleccion(null)}>
            Cancelar
          </button>
        </div>
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
              reproduciendo={reproduciendoId === track.id}
              onReproducir={setReproduciendoId}
              cambiando={cambiandoId === track.id}
              onCambiar={onSwapTrack}
              onVetar={onBanArtist}
              seleccionando={Boolean(seleccion)}
              seleccionada={Boolean(seleccion?.includes(track.id))}
              onSeleccionar={alternarSeleccion}
            />
          ))}
        </div>
      )}

      <p className="nota-inicio">Datos y carátulas proporcionados por Spotify.</p>
    </div>
  );
}
