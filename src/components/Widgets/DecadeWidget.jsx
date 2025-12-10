"use client";

import { useState } from "react";

const TODAS_LAS_DECADAS = [
  "1950s",
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
];

export default function DecadeWidget({
  decadasSeleccionadas,
  onCambiarDecadas,
}) {
  const [mostrarMasInfo, setMostrarMasInfo] = useState(false);
  const limiteSeleccion = 3;

  const manejarClickDecada = (decada) => {
    // Si ya está seleccionada, la quitamos
    if (decadasSeleccionadas.includes(decada)) {
      const nuevaLista = decadasSeleccionadas.filter((d) => d !== decada);
      onCambiarDecadas(nuevaLista);
      return;
    }

    // Límite de décadas seleccionadas
    if (decadasSeleccionadas.length >= limiteSeleccion) {
      alert(`Solo puedes seleccionar hasta ${limiteSeleccion} décadas.`);
      return;
    }

    const nuevaLista = [...decadasSeleccionadas, decada];
    onCambiarDecadas(nuevaLista);
  };

  return (
    <div className="card widget-decadas">
      <h3 className="widget-titulo">Décadas preferidas</h3>
      <p className="widget-texto">
        Elige las épocas musicales que más te gustan. Usaremos estas décadas
        para filtrar la música.
      </p>

      <div className="lista-decadas">
        {TODAS_LAS_DECADAS.map((decada) => {
          const activa = decadasSeleccionadas.includes(decada);
          return (
            <button
              key={decada}
              type="button"
              className={`boton-decada ${activa ? "boton-decada-activa" : ""}`}
              onClick={() => manejarClickDecada(decada)}
            >
              {decada}
            </button>
          );
        })}
      </div>

      {decadasSeleccionadas.length > 0 && (
        <p className="texto-seleccionados">
          Has seleccionado: {decadasSeleccionadas.join(", ")}
        </p>
      )}

      <button
        type="button"
        className="boton-info-decadas"
        onClick={() => setMostrarMasInfo(!mostrarMasInfo)}
      >
        {mostrarMasInfo ? "Ocultar detalle" : "¿Qué significa cada década?"}
      </button>

      {mostrarMasInfo && (
        <ul className="lista-detalle-decadas">
          <li>1950s → 1950 - 1959</li>
          <li>1960s → 1960 - 1969</li>
          <li>1970s → 1970 - 1979</li>
          <li>1980s → 1980 - 1989</li>
          <li>1990s → 1990 - 1999</li>
          <li>2000s → 2000 - 2009</li>
          <li>2010s → 2010 - 2019</li>
          <li>2020s → 2020 - 2029</li>
        </ul>
      )}
    </div>
  );
}
