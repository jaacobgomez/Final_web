"use client";

// Sustituye al antiguo widget de popularidad: Spotify eliminó ese dato de la API
// en 2026, así que ahora se elige el "modo" y el tamaño de la playlist.

const MODOS = [
  { clave: "conocidas", etiqueta: "Conocidas", texto: "Los temas más sonados de cada artista o género." },
  { clave: "equilibrado", etiqueta: "Equilibrado", texto: "Mezcla de éxitos y temas menos escuchados." },
  { clave: "descubrir", etiqueta: "Descubrir", texto: "Evita lo que ya escuchas o tienes guardado." },
];

const OBJETIVOS = [
  { tipo: "canciones", valor: 20, etiqueta: "20 canciones" },
  { tipo: "canciones", valor: 30, etiqueta: "30 canciones" },
  { tipo: "canciones", valor: 50, etiqueta: "50 canciones" },
  { tipo: "minutos", valor: 45, etiqueta: "45 min" },
  { tipo: "minutos", valor: 90, etiqueta: "1 h 30 min" },
];

export default function MezclaWidget({ opciones, onCambiarOpciones }) {
  const modoActual = MODOS.find((m) => m.clave === opciones.modo);

  return (
    <div className="card widget-popularidad">
      <h3 className="widget-titulo">Tipo de mezcla</h3>
      <p className="widget-texto">{modoActual?.texto}</p>

      <div className="botones-popularidad">
        {MODOS.map((modo) => (
          <button
            key={modo.clave}
            type="button"
            className={`boton-popularidad ${
              opciones.modo === modo.clave ? "boton-popularidad-activo" : ""
            }`}
            onClick={() => onCambiarOpciones({ ...opciones, modo: modo.clave })}
          >
            {modo.etiqueta}
          </button>
        ))}
      </div>

      <p className="popularidad-label">Duración</p>
      <div className="lista-decadas">
        {OBJETIVOS.map((objetivo) => {
          const activo =
            opciones.objetivo.tipo === objetivo.tipo &&
            opciones.objetivo.valor === objetivo.valor;
          return (
            <button
              key={objetivo.etiqueta}
              type="button"
              className={`boton-decada ${activo ? "boton-decada-activa" : ""}`}
              onClick={() =>
                onCambiarOpciones({
                  ...opciones,
                  objetivo: { tipo: objetivo.tipo, valor: objetivo.valor },
                })
              }
            >
              {objetivo.etiqueta}
            </button>
          );
        })}
      </div>

      <label className="popularidad-label">
        <input
          type="checkbox"
          checked={opciones.usarMiGusto}
          onChange={(e) =>
            onCambiarOpciones({ ...opciones, usarMiGusto: e.target.checked })
          }
        />{" "}
        Añadir también mis artistas más escuchados
      </label>
    </div>
  );
}
