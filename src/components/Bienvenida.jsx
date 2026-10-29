"use client";

import { useEffect, useState } from "react";

// Guía de la primera vez: 3 pasos y, si no está instalada, cómo ponerla en la pantalla de inicio.
// Se puede volver a abrir desde "❓ Cómo funciona".

const CLAVE_VISTA = "taste_mixer_bienvenida_vista";

const PASOS = [
  {
    titulo: "1. Elige qué te apetece",
    texto:
      "Lo más rápido: una plantilla (Estudiar, Gimnasio, Fiesta…). Si quieres afinar, elige artistas, canciones, géneros o décadas, o parte de una de tus playlists.",
  },
  {
    titulo: "2. Genera y retócala",
    texto:
      "Pulsa «Generar playlist». Toca la carátula para escucharla y el botón ⋯ de cada canción para cambiarla, quitarla o vetar al artista. «Añadir más» y «Ordenar» están justo encima.",
  },
  {
    titulo: "3. Guárdala en tu Spotify",
    texto:
      "«Guardar en mi Spotify» la crea en tu cuenta con portada. Si luego la cambias, «Actualizar» la pone al día. Con «📤 Compartir» se la mandas a quien quieras.",
  },
];

function leerVista() {
  try {
    return localStorage.getItem(CLAVE_VISTA) === "1";
  } catch {
    return true;
  }
}

function marcarVista() {
  try {
    localStorage.setItem(CLAVE_VISTA, "1");
  } catch {
    // sin almacenamiento: se volverá a mostrar, no pasa nada
  }
}

function detectarPlataforma() {
  const instalada =
    window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const esIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  return { instalada, esIOS };
}

export default function Bienvenida({ abrirAhora = 0 }) {
  const [abierta, setAbierta] = useState(false);
  const [paso, setPaso] = useState(0);
  const [plataforma, setPlataforma] = useState({ instalada: true, esIOS: false });
  const [eventoInstalar, setEventoInstalar] = useState(null);

  // Primera visita (o cuando se pide desde "Cómo funciona")
  useEffect(() => {
    let activo = true;
    Promise.resolve().then(() => {
      if (!activo) return;
      setPlataforma(detectarPlataforma());
      if (abrirAhora > 0 || !leerVista()) {
        setPaso(0);
        setAbierta(true);
      }
    });
    return () => {
      activo = false;
    };
  }, [abrirAhora]);

  // Android / Chrome: el navegador avisa de que se puede instalar
  useEffect(() => {
    const guardarEvento = (e) => {
      e.preventDefault();
      setEventoInstalar(e);
    };
    window.addEventListener("beforeinstallprompt", guardarEvento);
    return () => window.removeEventListener("beforeinstallprompt", guardarEvento);
  }, []);

  if (!abierta) return null;

  const pasos = plataforma.instalada ? PASOS : [...PASOS, { titulo: "4. Tenla a mano", instalar: true }];
  const actual = pasos[paso];
  const esUltimo = paso === pasos.length - 1;

  const cerrar = () => {
    marcarVista();
    setAbierta(false);
  };

  const instalar = async () => {
    eventoInstalar.prompt();
    await eventoInstalar.userChoice;
    setEventoInstalar(null);
    cerrar();
  };

  return (
    <div className="bienvenida-fondo" role="dialog" aria-modal="true" aria-label="Cómo funciona">
      <div className="bienvenida card">
        <p className="texto-pequeno">👋 Bienvenido a Taste Mixer</p>
        <h3 className="widget-titulo">{actual.titulo}</h3>

        {actual.instalar ? (
          plataforma.esIOS ? (
            <ol className="bienvenida-lista">
              <li>Ábrela en <strong>Safari</strong>.</li>
              <li>Toca el botón <strong>Compartir</strong> (el cuadrado con la flecha ⬆️).</li>
              <li>Baja y elige <strong>«Añadir a pantalla de inicio»</strong>.</li>
              <li>Listo: tendrás el icono como una app más.</li>
            </ol>
          ) : eventoInstalar ? (
            <>
              <p className="widget-texto">Instálala y la tendrás como una app más, sin tienda.</p>
              <button type="button" className="boton-playlist" onClick={instalar}>
                📲 Instalar la app
              </button>
            </>
          ) : (
            <p className="widget-texto">
              En el menú del navegador (⋮) elige <strong>«Instalar app»</strong> o{" "}
              <strong>«Añadir a pantalla de inicio»</strong>.
            </p>
          )
        ) : (
          <p className="widget-texto">{actual.texto}</p>
        )}

        <div className="bienvenida-puntos" aria-hidden="true">
          {pasos.map((p, i) => (
            <span key={p.titulo} className={i === paso ? "activo" : ""} />
          ))}
        </div>

        <div className="botones-playlist">
          {paso > 0 && (
            <button type="button" className="boton-playlist secundario" onClick={() => setPaso(paso - 1)}>
              Atrás
            </button>
          )}
          <button
            type="button"
            className="boton-playlist"
            onClick={esUltimo ? cerrar : () => setPaso(paso + 1)}
          >
            {esUltimo ? "¡A mezclar!" : "Siguiente"}
          </button>
          {!esUltimo && (
            <button type="button" className="boton-info-decadas" onClick={cerrar}>
              Saltar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
