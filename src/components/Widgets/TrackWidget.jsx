/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { buscarCancionesSpotify } from "@/lib/spotify";

export default function TrackWidget({
  cancionesSeleccionadas,
  onCambiarCanciones,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const limiteSeleccion = 5;

  // Búsqueda con pequeño debounce
  useEffect(() => {
    if (!busqueda || busqueda.trim().length < 2) {
      setResultados([]);
      setError("");
      return;
    }

    setCargando(true);
    setError("");

    const idTimeout = setTimeout(async () => {
      try {
        const canciones = await buscarCancionesSpotify(busqueda.trim());
        setResultados(canciones);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al buscar canciones.");
        setResultados([]);
      } finally {
        setCargando(false);
      }
    }, 500);

    return () => clearTimeout(idTimeout);
  }, [busqueda]);

  const manejarClickCancion = (cancion) => {
    const yaEsta = cancionesSeleccionadas.some((c) => c.id === cancion.id);

    if (yaEsta) {
      const nuevaLista = cancionesSeleccionadas.filter(
        (c) => c.id !== cancion.id
      );
      onCambiarCanciones(nuevaLista);
      return;
    }

    if (cancionesSeleccionadas.length >= limiteSeleccion) {
      alert(`Solo puedes seleccionar hasta ${limiteSeleccion} canciones.`);
      return;
    }

    const nuevaLista = [...cancionesSeleccionadas, cancion];
    onCambiarCanciones(nuevaLista);
  };

  return (
    <div className="card widget-canciones">
      <h3 className="widget-titulo">Canciones favoritas</h3>
      <p className="widget-texto">
        Busca canciones concretas y selecciónalas como referencia. También
        podrás marcarlas como favoritas más adelante.
      </p>

      <input
        type="text"
        placeholder="Buscar canción (ej. Blinding Lights, As It Was)..."
        className="widget-input"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {cargando && (
        <p className="texto-estado-busqueda">Buscando canciones...</p>
      )}

      {error && !cargando && (
        <p className="texto-error-busqueda">{error}</p>
      )}

      {!cargando && !error && resultados.length > 0 && (
        <ul className="lista-canciones">
          {resultados.map((cancion) => {
            const imagen =
              cancion.album?.images && cancion.album.images.length > 0
                ? cancion.album.images[cancion.album.images.length - 1].url
                : null;

            const artistasTexto = cancion.artists
              ?.map((a) => a.name)
              .join(", ");

            const estaSeleccionada = cancionesSeleccionadas.some(
              (c) => c.id === cancion.id
            );

            return (
              <li key={cancion.id}>
                <button
                  type="button"
                  className={`item-cancion ${
                    estaSeleccionada ? "item-cancion-seleccionada" : ""
                  }`}
                  onClick={() => manejarClickCancion(cancion)}
                >
                  {imagen && (
                    <img
                      src={imagen}
                      alt={cancion.name}
                      className="imagen-cancion"
                    />
                  )}

                  <div className="info-cancion">
                    <span className="nombre-cancion">{cancion.name}</span>
                    <span className="detalle-cancion">
                      {artistasTexto} · {cancion.album?.name}
                    </span>
                  </div>

                  {cancion.explicit && (
                    <span className="etiqueta-explicit">E</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {cancionesSeleccionadas.length > 0 && (
        <div className="seleccion-canciones">
          <p className="texto-seleccionados">Canciones seleccionadas:</p>
          <div className="chips-canciones">
            {cancionesSeleccionadas.map((cancion) => (
              <span key={cancion.id} className="chip-cancion">
                {cancion.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
