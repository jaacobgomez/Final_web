/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { codificarGusto } from "@/lib/grupo";

const MAX_ARTISTAS = 10;

// Para quien no está en la lista de la app: elige sus artistas a mano y manda su enlace
// de gusto a quien vaya a hacer la mezcla. No hace falta cuenta de Spotify.
export default function GustoManual() {
  const [nombre, setNombre] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [elegidos, setElegidos] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [enlace, setEnlace] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const buscar = async (e) => {
    e.preventDefault();
    setError("");
    setBuscando(true);
    try {
      const respuesta = await fetch(`/api/buscar-artistas?${new URLSearchParams({ q: busqueda.trim() })}`);
      const datos = await respuesta.json();
      if (!respuesta.ok) throw new Error(datos.error);
      setResultados(datos.artistas);
    } catch (err) {
      setError(err.message || "No se pudo buscar.");
    } finally {
      setBuscando(false);
    }
  };

  const elegir = (artista) => {
    if (!elegidos.some((a) => a.id === artista.id) && elegidos.length < MAX_ARTISTAS) {
      setElegidos([...elegidos, { id: artista.id, name: artista.name }]);
      setEnlace("");
    }
    setResultados([]);
    setBusqueda("");
  };

  const compartir = async () => {
    setMensaje("");
    const url = `${window.location.origin}/grupo?gusto=${codificarGusto({ nombre: nombre.trim(), artistas: elegidos })}`;
    setEnlace(url);
    const texto = "Este es mi gusto musical para la mezcla de grupo 🎵";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Mi gusto musical", text: texto, url });
      } catch {
        // canceló el menú de compartir: el enlace queda visible para copiarlo
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setMensaje("📋 Enlace copiado: pégalo en WhatsApp a quien haga la mezcla.");
      } catch {
        setMensaje("Copia el enlace de abajo y mándaselo a quien haga la mezcla.");
      }
    }
  };

  return (
    <div className="grupo-manual">
      <h3 className="widget-titulo">¿No puedes iniciar sesión? Elige tu gusto a mano</h3>
      <p className="widget-texto">
        Escoge hasta {MAX_ARTISTAS} artistas que te encanten y manda tu enlace a quien vaya a hacer la mezcla.
        No hace falta cuenta de Spotify.
      </p>

      <input
        className="widget-input"
        placeholder="Tu nombre"
        value={nombre}
        maxLength={30}
        onChange={(e) => setNombre(e.target.value)}
      />

      <form className="botones-playlist" onSubmit={buscar}>
        <input
          className="widget-input"
          placeholder={elegidos.length >= MAX_ARTISTAS ? "Ya tienes 10 artistas" : "Busca un artista…"}
          value={busqueda}
          disabled={elegidos.length >= MAX_ARTISTAS}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit" className="boton-playlist secundario" disabled={buscando || busqueda.trim().length < 2}>
          {buscando ? "Buscando…" : "Buscar"}
        </button>
      </form>

      {resultados.length > 0 && (
        <ul className="fiesta-resultados">
          {resultados.map((a) => (
            <li key={a.id}>
              <button type="button" onClick={() => elegir(a)}>
                {a.images?.[0]?.url ? (
                  <img src={a.images[0].url} alt="" className="resumen-foto" />
                ) : (
                  <span className="resumen-foto track-card-sin-imagen">♫</span>
                )}
                <span className="fiesta-resultado-texto">{a.name}</span>
                <span>{elegidos.some((x) => x.id === a.id) ? "✓" : "➕"}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {elegidos.length > 0 && (
        <div className="chips-artistas">
          {elegidos.map((a) => (
            <span key={a.id} className="chip-filtro">
              {a.name}
              <button
                type="button"
                onClick={() => {
                  setElegidos(elegidos.filter((x) => x.id !== a.id));
                  setEnlace("");
                }}
                aria-label={`Quitar ${a.name}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        className="boton-playlist"
        onClick={compartir}
        disabled={!nombre.trim() || elegidos.length < 3}
      >
        📤 Compartir mi gusto
      </button>
      {elegidos.length > 0 && elegidos.length < 3 && (
        <p className="texto-pequeno">Elige al menos 3 artistas.</p>
      )}
      {enlace && (
        <input type="text" className="widget-input" value={enlace} readOnly onFocus={(e) => e.target.select()} />
      )}
      {mensaje && <p className="texto-estado-busqueda">{mensaje}</p>}
      {error && <p className="texto-error-busqueda">{error}</p>}
    </div>
  );
}
