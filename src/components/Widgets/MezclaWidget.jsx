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

export default function MezclaWidget({ opciones, onCambiarOpciones, explicitasEnLista = 0, onQuitarExplicitas }) {
  const modoActual = MODOS.find((m) => m.clave === opciones.modo);
  const esPredefinido = OBJETIVOS.some(
    (o) => o.tipo === opciones.objetivo.tipo && o.valor === opciones.objetivo.valor
  );

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

      <CantidadPersonalizada
        objetivo={opciones.objetivo}
        resaltar={!esPredefinido}
        onCambiar={(objetivo) => onCambiarOpciones({ ...opciones, objetivo })}
      />

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

      <label className="popularidad-label">
        <input
          type="checkbox"
          checked={Boolean(opciones.sinExplicitas)}
          onChange={(e) =>
            onCambiarOpciones({ ...opciones, sinExplicitas: e.target.checked })
          }
        />{" "}
        🔞 Sin canciones explícitas (para comidas familiares o con peques)
      </label>
      {opciones.sinExplicitas && explicitasEnLista > 0 && (
        <button type="button" className="boton-info-decadas" onClick={onQuitarExplicitas}>
          Quitar las {explicitasEnLista} explícitas de la lista actual
        </button>
      )}
      <label className="popularidad-label">
        <input
          type="checkbox"
          checked={Boolean(opciones.soloElegidos)}
          onChange={(e) =>
            onCambiarOpciones({ ...opciones, soloElegidos: e.target.checked })
          }
        />{" "}
        🎯 Solo los artistas elegidos (cada canción lleva a alguno; los géneros solo filtran)
      </label>
      {opciones.soloElegidos && (
        <label className="popularidad-label">
          <input
            type="checkbox"
            checked={Boolean(opciones.soloPrincipal)}
            onChange={(e) => onCambiarOpciones({ ...opciones, soloPrincipal: e.target.checked })}
          />{" "}
          ↳ Y que sean temas suyos, no colaboraciones en temas de otros
        </label>
      )}
    </div>
  );
}

// Límites razonables para no pedirle a Spotify cientos de búsquedas
export const LIMITES_OBJETIVO = {
  canciones: { min: 1, max: 200 },
  minutos: { min: 5, max: 600 },
};

export function ajustarObjetivo(tipo, valor) {
  const { min, max } = LIMITES_OBJETIVO[tipo];
  const numero = Math.round(Number(valor));
  return { tipo, valor: Number.isNaN(numero) ? min : Math.min(max, Math.max(min, numero)) };
}

// Número libre + unidad (canciones o minutos)
export function CantidadPersonalizada({ objetivo, onCambiar, resaltar = false, etiqueta = "Otra:" }) {
  return (
    <div className={`cantidad-personalizada ${resaltar ? "cantidad-personalizada-activa" : ""}`}>
      <span className="popularidad-label">{etiqueta}</span>
      <input
        type="number"
        inputMode="numeric"
        className="widget-input cantidad-input"
        min={LIMITES_OBJETIVO[objetivo.tipo].min}
        max={LIMITES_OBJETIVO[objetivo.tipo].max}
        value={objetivo.valor}
        onChange={(e) => onCambiar({ tipo: objetivo.tipo, valor: e.target.value })}
        onBlur={(e) => onCambiar(ajustarObjetivo(objetivo.tipo, e.target.value))}
        aria-label="Cantidad"
      />
      <select
        className="widget-input cantidad-unidad"
        value={objetivo.tipo}
        onChange={(e) => onCambiar(ajustarObjetivo(e.target.value, objetivo.valor))}
        aria-label="Unidad"
      >
        <option value="canciones">canciones</option>
        <option value="minutos">minutos</option>
      </select>
    </div>
  );
}
