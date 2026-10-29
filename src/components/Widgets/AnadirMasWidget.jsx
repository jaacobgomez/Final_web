"use client";

import { useState } from "react";
import { CantidadPersonalizada, ajustarObjetivo } from "./MezclaWidget";

// Panel de "Añadir más canciones": reutiliza los filtros de la última generación,
// deja quitar los que sobren (o todos) y elegir cuántas canciones más.

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

function mismosFiltros(a, b) {
  return (
    JSON.stringify(a.preferencias) === JSON.stringify(b.preferencias) &&
    a.opcionesMezcla.modo === b.opcionesMezcla.modo &&
    Boolean(a.opcionesMezcla.usarMiGusto) === Boolean(b.opcionesMezcla.usarMiGusto) &&
    Boolean(a.opcionesMezcla.sinExplicitas) === Boolean(b.opcionesMezcla.sinExplicitas)
  );
}

export default function AnadirMasWidget({ parametros, parametrosPanel, loading, onAnadir, onCerrar }) {
  const [filtros, setFiltros] = useState(parametros);
  const [objetivo, setObjetivo] = useState({ tipo: "canciones", valor: 10 });

  const { preferencias, opcionesMezcla } = filtros;
  const conFiltros = hayFiltros(preferencias, opcionesMezcla);
  const panelDistinto = !mismosFiltros(filtros, parametrosPanel);

  const quitar = (campo, id) =>
    setFiltros((f) => ({
      ...f,
      preferencias: { ...f.preferencias, [campo]: f.preferencias[campo].filter((x) => (x.id ?? x) !== id) },
    }));

  const chips = [
    ...(preferencias.playlistBase
      ? [{ clave: "base", texto: `📂 ${preferencias.playlistBase.name}`, quitar: () =>
          setFiltros((f) => ({ ...f, preferencias: { ...f.preferencias, playlistBase: null } })) }]
      : []),
    ...preferencias.artistas.map((a) => ({ clave: `a-${a.id}`, texto: `🎤 ${a.name}`, quitar: () => quitar("artistas", a.id) })),
    ...preferencias.canciones.map((c) => ({ clave: `c-${c.id}`, texto: `🎵 ${c.name}`, quitar: () => quitar("canciones", c.id) })),
    ...preferencias.generos.map((g) => ({ clave: `g-${g}`, texto: `🏷️ ${g}`, quitar: () => quitar("generos", g) })),
    ...preferencias.decadas.map((d) => ({ clave: `d-${d}`, texto: `📅 ${d}`, quitar: () => quitar("decadas", d) })),
    ...(opcionesMezcla.usarMiGusto
      ? [{ clave: "gusto", texto: "⭐ Mis más escuchados", quitar: () =>
          setFiltros((f) => ({ ...f, opcionesMezcla: { ...f.opcionesMezcla, usarMiGusto: false } })) }]
      : []),
    ...(opcionesMezcla.sinExplicitas
      ? [{ clave: "explicitas", texto: "🔞 Sin explícitas", quitar: () =>
          setFiltros((f) => ({ ...f, opcionesMezcla: { ...f.opcionesMezcla, sinExplicitas: false } })) }]
      : []),
  ];

  const quitarTodos = () =>
    setFiltros((f) => ({ preferencias: SIN_FILTROS, opcionesMezcla: { ...f.opcionesMezcla, usarMiGusto: false } }));

  const objetivoFinal = ajustarObjetivo(objetivo.tipo, objetivo.valor);
  const textoBoton =
    objetivoFinal.tipo === "canciones"
      ? `➕ Añadir ${objetivoFinal.valor} ${objetivoFinal.valor === 1 ? "canción" : "canciones"}`
      : `➕ Añadir unos ${objetivoFinal.valor} min`;

  return (
    <div className="panel-anadir">
      <p className="widget-texto">
        {conFiltros
          ? `Se añadirán con estos filtros (modo ${NOMBRES_MODO[opcionesMezcla.modo] || "Equilibrado"}). Quita los que no quieras:`
          : "⚠️ Sin filtros: añadiré canciones de tus artistas más escuchados."}
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

      <div className="botones-playlist">
        {conFiltros && (
          <button type="button" className="boton-info-decadas" onClick={quitarTodos}>
            Quitar todos los filtros
          </button>
        )}
        {panelDistinto && (
          <button type="button" className="boton-info-decadas" onClick={() => setFiltros(parametrosPanel)}>
            Usar los filtros actuales del panel
          </button>
        )}
      </div>

      <CantidadPersonalizada etiqueta="¿Cuántas más?" objetivo={objetivo} onCambiar={setObjetivo} />

      <div className="botones-playlist">
        <button
          type="button"
          className="boton-playlist"
          disabled={loading}
          onClick={() => onAnadir(filtros, objetivoFinal)}
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
