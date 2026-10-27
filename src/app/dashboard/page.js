'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import {
  actualizarPlaylistEnSpotify,
  generarPlaylist,
  guardarPlaylistEnSpotify,
} from "@/lib/spotify";
import GenreWidget from "@/components/Widgets/GenreWidget";
import DecadeWidget from "@/components/Widgets/DecadeWidget";
import MezclaWidget from "@/components/Widgets/MezclaWidget";
import ArtistWidget from "@/components/Widgets/ArtistWidget";
import TrackWidget from "@/components/Widgets/TrackWidget";
import PlaylistDisplay from "@/components/PlaylistDisplay";

export default function DashboardPage() {
  const router = useRouter();

  const [preferencias, setPreferencias] = useState({
    artistas: [],
    canciones: [],
    generos: [],
    decadas: [],
  });

  const [opcionesMezcla, setOpcionesMezcla] = useState({
    modo: "equilibrado",
    objetivo: { tipo: "canciones", valor: 30 },
    usarMiGusto: false,
  });

  const [listaReproduccion, setListaReproduccion] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [cargandoPlaylist, setCargandoPlaylist] = useState(false);
  const [errorPlaylist, setErrorPlaylist] = useState("");
  const [avisos, setAvisos] = useState([]);
  const [vecesAnadidas, setVecesAnadidas] = useState(0);
  const [estadoGuardado, setEstadoGuardado] = useState({ guardando: false, mensaje: "", error: "" });
  // Playlist ya creada en Spotify: { id, url, nombre, ids } (ids = canciones en el último guardado)
  const [guardada, setGuardada] = useState(null);

  const idsActuales = listaReproduccion.map((t) => t.id).join(",");
  const hayCambiosSinGuardar = guardada !== null && guardada.ids !== idsActuales;

  // Si no está autenticado, devolverlo al inicio
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  // Cargar favoritos desde localStorage (si existen)
  useEffect(() => {
    try {
      const guardados = localStorage.getItem("favorite_tracks");
      if (guardados) {
        setFavoritos(JSON.parse(guardados));
      }
    } catch (error) {
      console.error("Error leyendo favoritos de localStorage", error);
    }
  }, []);

  // Generar playlist usando las preferencias
  async function manejarGenerar() {
    setCargandoPlaylist(true);
    setErrorPlaylist("");
    setAvisos([]);
    setEstadoGuardado({ guardando: false, mensaje: "", error: "" });

    try {
      const { tracks, avisos } = await generarPlaylist(preferencias, opcionesMezcla);
      setListaReproduccion(tracks);
      setAvisos(avisos);
      setVecesAnadidas(0);
    } catch (error) {
      console.error(error);
      setErrorPlaylist(
        error.message || "Error al generar la playlist. Inténtalo de nuevo."
      );
      setListaReproduccion([]);
    } finally {
      setCargandoPlaylist(false);
    }
  }

  // Añadir más canciones sobre la playlist actual (sin repetir)
  async function agregarMasCanciones() {
    if (listaReproduccion.length === 0) {
      await manejarGenerar();
      return;
    }

    setCargandoPlaylist(true);
    setErrorPlaylist("");

    try {
      const siguiente = vecesAnadidas + 1;
      const { tracks } = await generarPlaylist(preferencias, {
        ...opcionesMezcla,
        objetivo: { tipo: "canciones", valor: 10 },
        excluirIds: listaReproduccion.map((t) => t.id),
        desplazamiento: siguiente,
      });
      setListaReproduccion((prev) => [...prev, ...tracks]);
      setVecesAnadidas(siguiente);
      if (tracks.length === 0) {
        setAvisos(["No quedan más canciones nuevas con estos filtros."]);
      }
    } catch (error) {
      console.error(error);
      setErrorPlaylist(error.message || "Error al añadir más canciones.");
    } finally {
      setCargandoPlaylist(false);
    }
  }

  // Crear la playlist de verdad en la cuenta de Spotify del usuario
  async function manejarGuardar(nombre) {
    setEstadoGuardado({ guardando: true, mensaje: "", error: "" });
    try {
      const { id, url } = await guardarPlaylistEnSpotify(nombre, listaReproduccion);
      setGuardada({ id, url, nombre, ids: idsActuales });
      setEstadoGuardado({ guardando: false, mensaje: "✅ Guardada en tu Spotify.", error: "" });
    } catch (error) {
      console.error(error);
      setEstadoGuardado({
        guardando: false,
        mensaje: "",
        error: error.message || "No se pudo guardar en Spotify.",
      });
    }
  }

  // Sustituir las canciones de la playlist ya guardada por las actuales
  async function manejarActualizar() {
    if (!guardada) return;
    setEstadoGuardado({ guardando: true, mensaje: "", error: "" });
    try {
      await actualizarPlaylistEnSpotify(guardada.id, listaReproduccion);
      setGuardada((prev) => ({ ...prev, ids: idsActuales }));
      setEstadoGuardado({ guardando: false, mensaje: `✅ «${guardada.nombre}» actualizada.`, error: "" });
    } catch (error) {
      console.error(error);
      setEstadoGuardado({
        guardando: false,
        mensaje: "",
        error: error.message || "No se pudo actualizar la playlist.",
      });
    }
  }

  // Eliminar una canción de la playlist
  function eliminarTrackDePlaylist(idTrack) {
    setListaReproduccion((prev) => prev.filter((t) => t.id !== idTrack));
  }

  // Toggle favorito y persistir en localStorage
  function toggleFavorito(track) {
    setFavoritos((prev) => {
      const existe = prev.some((t) => t.id === track.id);
      const nuevaLista = existe
        ? prev.filter((t) => t.id !== track.id)
        : [...prev, track];

      try {
        localStorage.setItem("favorite_tracks", JSON.stringify(nuevaLista));
      } catch (error) {
        console.error("Error guardando favoritos en localStorage", error);
      }

      return nuevaLista;
    });
  }

  function esFavorito(trackId) {
    return favoritos.some((t) => t.id === trackId);
  }

  return (
    <section className="dashboard">
      <div className="dashboard-contenedor">
        <div className="dashboard-columna-izquierda">
          <header className="dashboard-cabecera">
            <h2 className="dashboard-titulo">Panel de mezcla</h2>
            <p className="dashboard-texto">
              Elige artistas, canciones, géneros y décadas, decide el tipo de
              mezcla y genera tu playlist. Después puedes guardarla en tu Spotify.
            </p>
          </header>

          <ArtistWidget
            artistasSeleccionados={preferencias.artistas}
            onCambiarArtistas={(nuevosArtistas) =>
              setPreferencias((previas) => ({ ...previas, artistas: nuevosArtistas }))
            }
          />

          <TrackWidget
            cancionesSeleccionadas={preferencias.canciones}
            onCambiarCanciones={(nuevasCanciones) =>
              setPreferencias((previas) => ({ ...previas, canciones: nuevasCanciones }))
            }
          />

          <div className="grid-widgets">
            <GenreWidget
              generosSeleccionados={preferencias.generos}
              onCambiarGeneros={(nuevosGeneros) =>
                setPreferencias((previas) => ({ ...previas, generos: nuevosGeneros }))
              }
            />
          </div>

          <DecadeWidget
            decadasSeleccionadas={preferencias.decadas}
            onCambiarDecadas={(nuevasDecadas) =>
              setPreferencias((previas) => ({ ...previas, decadas: nuevasDecadas }))
            }
          />

        </div>

        <div className="dashboard-columna-derecha">
          {/* Junto al botón de generar, que es donde se busca */}
          <MezclaWidget
            opciones={opcionesMezcla}
            onCambiarOpciones={setOpcionesMezcla}
          />

          <PlaylistDisplay
            tracks={listaReproduccion}
            loading={cargandoPlaylist}
            error={errorPlaylist}
            avisos={avisos}
            onGenerate={manejarGenerar}
            onAddMore={agregarMasCanciones}
            onSave={manejarGuardar}
            onUpdate={manejarActualizar}
            guardada={guardada}
            hayCambiosSinGuardar={hayCambiosSinGuardar}
            estadoGuardado={estadoGuardado}
            isFavorite={esFavorito}
            onToggleFavorite={toggleFavorito}
            onRemoveTrack={eliminarTrackDePlaylist}
          />

          <div className="card bloque-favoritos">
            <div className="bloque-cabecera">
              <h3 className="bloque-titulo">Tus canciones favoritas</h3>
              <p className="bloque-subtitulo">
                Se guardan en este dispositivo. Puedes marcarlas desde la playlist.
              </p>
            </div>

            {favoritos.length === 0 ? (
              <p className="lista-vacia">
                Aún no has marcado ninguna canción como favorita.
              </p>
            ) : (
              <ul className="lista-favoritos">
                {favoritos.map((track) => (
                  <li key={track.id}>
                    {track.name} · {track.artists?.map((a) => a.name).join(", ")}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
