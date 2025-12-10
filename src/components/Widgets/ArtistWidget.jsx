/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { buscarArtistasSpotify } from "@/lib/spotify";

export default function ArtistWidget({
  artistasSeleccionados,
  onCambiarArtistas,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const limiteSeleccion = 5;

  // Buscar artistas con "debounce"
  useEffect(() => {
    // Si el texto es muy corto, no buscamos
    if (!busqueda || busqueda.trim().length < 2) {
      setResultados([]);
      setError("");
      return;
    }

    setCargando(true);
    setError("");

    const idTimeout = setTimeout(async () => {
      try {
        const artistas = await buscarArtistasSpotify(busqueda.trim());
        setResultados(artistas);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al buscar artistas.");
        setResultados([]);
      } finally {
        setCargando(false);
      }
    }, 500); // esperamos 500ms desde que el usuario deja de escribir

    // limpiar timeout si el usuario sigue escribiendo
    return () => clearTimeout(idTimeout);
  }, [busqueda]); // solo depende del texto de búsqueda

  const manejarClickArtista = (artista) => {
    const yaEsta = artistasSeleccionados.some((a) => a.id === artista.id);

    if (yaEsta) {
      // quitar de la lista
      const nuevaLista = artistasSeleccionados.filter(
        (a) => a.id !== artista.id
      );
      onCambiarArtistas(nuevaLista);
      return;
    }

    if (artistasSeleccionados.length >= limiteSeleccion) {
      alert(`Solo puedes seleccionar hasta ${limiteSeleccion} artistas.`);
      return;
    }

    const nuevaLista = [...artistasSeleccionados, artista];
    onCambiarArtistas(nuevaLista);
  };

  return (
    <div className="card widget-artistas">
      <h3 className="widget-titulo">Artistas favoritos</h3>
      <p className="widget-texto">
        Busca artistas por nombre y selecciona hasta {limiteSeleccion}. Usaremos
        sus canciones más populares al generar la playlist.
      </p>

      <input
        type="text"
        placeholder="Buscar artista (ej. Queen, Rosalía, Bad Bunny)..."
        className="widget-input"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {cargando && (
        <p className="texto-estado-busqueda">Buscando artistas...</p>
      )}

      {error && !cargando && (
        <p className="texto-error-busqueda">{error}</p>
      )}

      {!cargando && !error && resultados.length > 0 && (
        <ul className="lista-artistas">
          {resultados.map((artista) => {
            const imagen =
              artista.images && artista.images.length > 0
                ? artista.images[artista.images.length - 1].url // la más pequeña
                : null;

            const estaSeleccionado = artistasSeleccionados.some(
              (a) => a.id === artista.id
            );

            return (
              <li key={artista.id}>
                <button
                  type="button"
                  className={`item-artista ${
                    estaSeleccionado ? "item-artista-seleccionado" : ""
                  }`}
                  onClick={() => manejarClickArtista(artista)}
                >
                  {imagen && (
                    <img
                      src={imagen}
                      alt={artista.name}
                      className="imagen-artista"
                    />
                  )}
                  <div className="info-artista">
                    <span className="nombre-artista">{artista.name}</span>
                    <span className="detalle-artista">
                      Popularidad: {artista.popularity} · Seguidores:{" "}
                      {artista.followers?.total?.toLocaleString("es-ES")}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {artistasSeleccionados.length > 0 && (
        <div className="seleccion-artistas">
          <p className="texto-seleccionados">Artistas seleccionados:</p>
          <div className="chips-artistas">
            {artistasSeleccionados.map((artista) => (
              <span key={artista.id} className="chip-artista">
                {artista.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
