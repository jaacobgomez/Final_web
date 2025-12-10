"use client";

import { useState } from "react";

const TODOS_LOS_GENEROS = [
  "acoustic",
  "afrobeat",
  "alt-rock",
  "alternative",
  "ambient",
  "anime",
  "blues",
  "brazil",
  "chill",
  "classical",
  "dance",
  "disco",
  "edm",
  "electronic",
  "folk",
  "funk",
  "hip-hop",
  "house",
  "indie",
  "indie-pop",
  "jazz",
  "k-pop",
  "latin",
  "metal",
  "pop",
  "punk",
  "r-n-b",
  "reggae",
  "reggaeton",
  "rock",
  "soul",
  "techno",
  "trance",
  "world-music",
];

export default function GenreWidget({
  generosSeleccionados,
  onCambiarGeneros,
}) 

{
    const [busqueda, setBusqueda] = useState("");

  // Filtramos la lista según el texto que escribe el usuario
  const generosFiltrados = TODOS_LOS_GENEROS.filter((genero) =>
    genero.toLowerCase().includes(busqueda.toLowerCase())
  );

  const limiteSeleccion = 5;

  const manejarClickGenero = (genero) => {
    // Si ya está seleccionado, lo quitamos
    if (generosSeleccionados.includes(genero)) {
      const nuevaLista = generosSeleccionados.filter((g) => g !== genero);
      onCambiarGeneros(nuevaLista);
      return;
    }

    // Si NO está seleccionado y ya hemos llegado al límite, no dejamos añadir más
    if (generosSeleccionados.length >= limiteSeleccion) {
      alert(`Solo puedes seleccionar hasta ${limiteSeleccion} géneros.`);
      return;
    }

    const nuevaLista = [...generosSeleccionados, genero];
    onCambiarGeneros(nuevaLista);
  };

return (   
    <div className="card widget-generos">
        <h3 className="widget-titulo">Géneros favoritos</h3>
        <p className="widget-texto">
            Escribe para filtrar y elige hasta {limiteSeleccion} géneros que te
            representen.
        </p>

        <input
            type="text"
            placeholder="Buscar género (ej. rock, jazz, pop)..."
            className="widget-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="lista-generos">
            {generosFiltrados.map((genero) => {
            const estaSeleccionado = generosSeleccionados.includes(genero);
            return (
                <button
                key={genero}
                type="button"
                className={`boton-genero ${
                    estaSeleccionado ? "boton-genero-activo" : ""
                }`}
                onClick={() => manejarClickGenero(genero)}
                >
                {genero}
                </button>
            );
            })}
        </div>

        {generosSeleccionados.length > 0 && (
            <p className="texto-seleccionados">
            Seleccionados: {generosSeleccionados.join(", ")}
            </p>
        )}
    </div>
  );
}
    