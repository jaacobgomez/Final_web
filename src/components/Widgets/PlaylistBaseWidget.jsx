"use client";

import { useEffect, useState } from "react";
import { obtenerMisPlaylists } from "@/lib/spotify";

// Elegir una playlist propia como punto de partida: se usan sus artistas
// más repetidos y no se repiten las canciones que ya tiene.
export default function PlaylistBaseWidget({ playlistBase, onCambiarPlaylistBase }) {
  const [playlists, setPlaylists] = useState(null);
  const [error, setError] = useState("");

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

  const manejarCambio = (e) => {
    const elegida = playlists?.find((p) => p.id === e.target.value);
    onCambiarPlaylistBase(elegida ? { id: elegida.id, name: elegida.name } : null);
  };

  return (
    <div className="card widget-canciones">
      <h3 className="widget-titulo">Partir de una playlist tuya</h3>
      <p className="widget-texto">
        Opcional. Genera más canciones en la línea de una de tus playlists, sin
        repetir las que ya tiene.
      </p>

      {error && <p className="texto-error-busqueda">{error}</p>}
      {!error && playlists === null && (
        <p className="texto-estado-busqueda">Cargando tus playlists...</p>
      )}

      {playlists !== null && (
        <select
          className="widget-input"
          value={playlistBase?.id || ""}
          onChange={manejarCambio}
        >
          <option value="">— Ninguna —</option>
          {playlists.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
