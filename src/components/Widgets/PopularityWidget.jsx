"use client";

import { useState, useEffect } from "react";

const OPCIONES = {
  underground: { min: 0, max: 40, etiqueta: "Underground (0 - 40)" },
  popular: { min: 40, max: 75, etiqueta: "Popular (40 - 75)" },
  mainstream: { min: 75, max: 100, etiqueta: "Mainstream (75 - 100)" },
};

export default function PopularityWidget({ popularidad, onCambiarPopularidad }) {
  const [opcionSeleccionada, setOpcionSeleccionada] = useState("popular");

  // Cuando cambie la popularidad desde fuera, intentamos ajustar la opción
  useEffect(() => {
    if (!popularidad) return;

    const { min, max } = popularidad;

    if (min === OPCIONES.underground.min && max === OPCIONES.underground.max) {
      setOpcionSeleccionada("underground");
    } else if (min === OPCIONES.popular.min && max === OPCIONES.popular.max) {
      setOpcionSeleccionada("popular");
    } else if (
      min === OPCIONES.mainstream.min &&
      max === OPCIONES.mainstream.max
    ) {
      setOpcionSeleccionada("mainstream");
    } else {
      setOpcionSeleccionada("personalizado");
    }
  }, [popularidad]);

  const manejarClickOpcion = (opcionClave) => {
    if (opcionClave === "personalizado") {
      setOpcionSeleccionada("personalizado");
      return;
    }

    const rango = OPCIONES[opcionClave];
    setOpcionSeleccionada(opcionClave);
    onCambiarPopularidad({ min: rango.min, max: rango.max });
  };
  /* El slider del widget me da un valor de 0 a 100, que yo interpreto como el centro del rango de popularidad. 
  Uso una constante amplitud = 10 para construir alrededor de ese centro un intervalo [valor - 10, valor + 10], 
  y lo recorto entre 0 y 100 con Math.max y Math.min. Así siempre trabajo con un rango (mínimo y máximo) en lugar 
  de un solo número*/
  const manejarCambioSlider = (e) => {
    const valor = Number(e.target.value);
    // Creamos un rango pequeño alrededor del valor central
    const amplitud = 10;
    const min = Math.max(0, valor - amplitud);
    const max = Math.min(100, valor + amplitud);

    onCambiarPopularidad({ min, max });
    setOpcionSeleccionada("personalizado");
  };

  return (
    <div className="card widget-popularidad">
      <h3 className="widget-titulo">Nivel de popularidad</h3>
      <p className="widget-texto">
        Decide si quieres descubrimientos más alternativos o temas muy conocidos.
      </p>

      {/* Botones de selección rápida */}
      <div className="botones-popularidad">
        <button
          type="button"
          className={`boton-popularidad ${
            opcionSeleccionada === "underground" ? "boton-popularidad-activo" : ""
          }`}
          onClick={() => manejarClickOpcion("underground")}
        >
          Underground
        </button>

        <button
          type="button"
          className={`boton-popularidad ${
            opcionSeleccionada === "popular" ? "boton-popularidad-activo" : ""
          }`}
          onClick={() => manejarClickOpcion("popular")}
        >
          Popular
        </button>

        <button
          type="button"
          className={`boton-popularidad ${
            opcionSeleccionada === "mainstream" ? "boton-popularidad-activo" : ""
          }`}
          onClick={() => manejarClickOpcion("mainstream")}
        >
          Mainstream
        </button>
      </div>

      {/* Slider para ajustar a mano */}
      <div className="popularidad-slider-bloque">
        <label className="popularidad-label">
          Ajuste fino (personalizado)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          className="popularidad-slider"
          value={Math.round((popularidad.min + popularidad.max) / 2)}
          onChange={manejarCambioSlider}
        />
        <div className="popularidad-rango">
          <span>Mín: {popularidad.min}</span>
          <span>Máx: {popularidad.max}</span>
        </div>
      </div>
    </div>
  );
}
