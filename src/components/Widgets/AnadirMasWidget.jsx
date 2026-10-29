"use client";

import { useState } from "react";
import { CantidadPersonalizada, ajustarObjetivo } from "./MezclaWidget";

// Panel de "Añadir más canciones": usa los mismos filtros que los widgets del panel.
// Quitar un filtro aquí lo quita también de su widget (y al revés), así no se desincronizan.

const NOMBRES_MODO = { conocidas: "Conocidas", equilibrado: "Equilibrado", descubrir: "Descubrir" };

const SIN_FILTROS = { artistas: [], canciones: [], generos: [], decadas: [], playlistBase: null };

function hayFiltros(preferencias, opcionesMezcla) {
  return (
    preferencias.artistas.length > 0 ||
    preferencias.canciones.length > 0 ||
    preferencias.generos.length > 0 ||
    preferencias.decadas.length > 0 ||
    Boolean(preferencias.playlistBase) ||
    Boolean(opcionesMezcla.usarMiGusto)
  );
}

export default function AnadirMasWidget({
  preferencias,
  opcionesMezcla,
  onCambiarPreferencias,
  onCambiarOpciones,
  loading,
  onAnadir,
  onCerrar,
}) {
  const [objetivo, setObjetivo] = useState({ tipo: "canciones", valor: 10 });

  const conFiltros = hayFiltros(preferencias, opcionesMezcla);
  const conElegidos = preferencias.artistas.length > 0 || preferencias.canciones.length > 0;

  const quitar = (campo, id) =>
    onCambiarPreferencias({ ...preferencias, [campo]: preferencias[campo].filter((x) => (x.id ?? x) !== id) });
  const cambiarOpcion = (campo, valor) => onCambiarOpciones({ ...opcionesMezcla, [campo]: valor });

  const chips = [
    ...(preferencias.playlistBase
      ? [{ clave: "base", texto: `📂 ${preferencias.playlistBase.name}`, quitar: () =>
          onCambiarPreferencias({ ...preferencias, playlistBase: null }) }]
      : []),
    ...preferencias.artistas.map((a) => ({ clave: `a-${a.id}`, texto: `🎤 ${a.name}`, quitar: () => quitar("artistas", a.id) })),
    ...preferencias.canciones.map((c) => ({ clave: `c-${c.id}`, texto: `🎵 ${c.name}`, quitar: () => quitar("canciones", c.id) })),
    ...preferencias.generos.map((g) => ({ clave: `g-${g}`, texto: `🏷️ ${g}`, quitar: () => quitar("generos", g) })),
    ...preferencias.decadas.map((d) => ({ clave: `d-${d}`, texto: `📅 ${d}`, quitar: () => quitar("decadas", d) })),
    ...(opcionesMezcla.usarMiGusto
      ? [{ clave: "gusto", texto: "⭐ Mis más escuchados", quitar: () => cambiarOpcion("usarMiGusto", false) }]
      : []),
    ...(opcionesMezcla.sinExplicitas
      ? [{ clave: "explicitas", texto: "🔞 Sin explícitas", quitar: () => cambiarOpcion("sinExplicitas", false) }]
      : []),
  ];

  const quitarTodos = () => {
    onCambiarPreferencias(SIN_FILTROS);
    onCambiarOpciones({ ...opcionesMezcla, usarMiGusto: false });
  };

  const objetivoFinal = ajustarObjetivo(objetivo.tipo, objetivo.valor);
  const textoBoton =
    objetivoFinal.tipo === "canciones"
      ? `➕ Añadir ${objetivoFinal.valor} ${objetivoFinal.valor === 1 ? "canción" : "canciones"}`
      : `➕ Añadir unos ${objetivoFinal.valor} min`;

  return (
    <div className="panel-anadir">
      <p className="widget-texto">
        {conFiltros
          ? `Se añadirán con los filtros del panel (modo ${NOMBRES_MODO[opcionesMezcla.modo] || "Equilibrado"}). Quita los que no quieras o añade otros en los widgets:`
          : "Sin filtros: elige artistas, canciones o géneros en los widgets (o añadiré de tus más escuchados)."}
      </p>

      {chips.length > 0 && (
        <div className="chips-artistas">
          {chips.map((chip) => (
            <span key={chip.clave} className="chip-filtro">
              {chip.texto}
              <button type="button" onClick={chip.quitar} aria-label={`Quitar ${chip.texto}`}>
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {conElegidos && (
        <label className="popularidad-label">
          <input
            type="checkbox"
            checked={Boolean(opcionesMezcla.soloElegidos)}
            onChange={(e) => cambiarOpcion("soloElegidos", e.target.checked)}
          />{" "}
          🎯 Solo los artistas elegidos
        </label>
      )}

      {conFiltros && (
        <div className="botones-playlist">
          <button type="button" className="boton-info-decadas" onClick={quitarTodos}>
            Quitar todos los filtros
          </button>
        </div>
      )}

      <CantidadPersonalizada etiqueta="¿Cuántas más?" objetivo={objetivo} onCambiar={setObjetivo} />

      <div className="botones-playlist">
        <button
          type="button"
          className="boton-playlist"
          disabled={loading}
          onClick={() => onAnadir({ preferencias, opcionesMezcla }, objetivoFinal)}
        >
          {loading ? "Añadiendo..." : textoBoton}
        </button>
        <button type="button" className="boton-playlist secundario" onClick={onCerrar}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
