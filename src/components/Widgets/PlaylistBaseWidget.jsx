"use client";

import { useEffect, useState } from "react";
import { obtenerMisPlaylists } from "@/lib/spotify";

// Elegir una playlist propia: o se abre para añadirle canciones (y se guardan en ella),
// o se usa como inspiración para una nueva (sus artistas más repetidos, sin repetir
// las canciones que ya tiene).
export default function PlaylistBaseWidget({ playlistBase, onCambiarPlaylistBase, onAbrirPlaylist, abriendo }) {
  const [playlists, setPlaylists] = useState(null);
  const [error, setError] = useState("");
  const [seleccionadaId, setSeleccionadaId] = useState(playlistBase?.id || "");

  useEffect(() => {
    let activo = true;
    obtenerMisPlaylists()
      .then((lista) => {
        if (activo) setPlaylists(lista);
      })
      .catch((err) => {
        if (activo) setError(err.message || "No se pudieron cargar tus playlists.");
      });
    return () => {
      activo = false;
    };
  }, []);

  const seleccionada = playlists?.find((p) => p.id === seleccionadaId) || null;
  const esInspiracion = seleccionada && playlistBase?.id === seleccionada.id;

  const manejarCambio = (e) => {
    setSeleccionadaId(e.target.value);
    // Cambiar de playlist (o elegir "Ninguna") quita la inspiración anterior
    if (playlistBase) onCambiarPlaylistBase(null);
  };

  return (
    <div className="card widget-canciones">
      <h3 className="widget-titulo">Tus playlists</h3>
      <p className="widget-texto">
        Opcional. Elige una para añadirle canciones o para crear una nueva en su línea.
      </p>

      {error && <p className="texto-error-busqueda">{error}</p>}
      {!error && playlists === null && (
        <p className="texto-estado-busqueda">Cargando tus playlists...</p>
      )}

      {playlists !== null && (
        <select className="widget-input" value={seleccionadaId} onChange={manejarCambio}>
          <option value="">— Ninguna —</option>
          {playlists.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      {seleccionada && (
        <div className="botones-playlist">
          <button
            type="button"
            className="boton-playlist"
            disabled={abriendo}
            onClick={() => onAbrirPlaylist(seleccionada)}
          >
            {abriendo ? "Abriendo..." : `➕ Añadir canciones a «${seleccionada.name}»`}
          </button>
          <button
            type="button"
            className="boton-playlist secundario"
            disabled={esInspiracion}
            onClick={() => onCambiarPlaylistBase({ id: seleccionada.id, name: seleccionada.name })}
          >
            ✨ Crear una nueva inspirada en ella
          </button>
        </div>
      )}

      {esInspiracion && (
        <p className="texto-estado-busqueda">
          ✅ La usaré de inspiración. Añade más filtros si quieres y pulsa «Generar playlist»:
          será una playlist nueva y la tuya no se toca.
        </p>
      )}
    </div>
  );
}
