'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { cargarEstado, guardarEstado } from "@/lib/estado";
import { cargarVetados, guardarVetados } from "@/lib/vetados";
import { crearPortada } from "@/lib/portada";
import {
  generarPlaylist,
  guardarPlaylistEnSpotify,
  obtenerCancionesPlaylist,
  subirPortadaPlaylist,
  sincronizarPlaylistEnSpotify,
} from "@/lib/spotify";
import GenreWidget from "@/components/Widgets/GenreWidget";
import DecadeWidget from "@/components/Widgets/DecadeWidget";
import MezclaWidget, { ajustarObjetivo } from "@/components/Widgets/MezclaWidget";
import AnadirMasWidget from "@/components/Widgets/AnadirMasWidget";
import VetadosWidget from "@/components/Widgets/VetadosWidget";
import ArtistWidget from "@/components/Widgets/ArtistWidget";
import TrackWidget from "@/components/Widgets/TrackWidget";
import PlaylistBaseWidget from "@/components/Widgets/PlaylistBaseWidget";
import PlaylistDisplay from "@/components/PlaylistDisplay";

export default function DashboardPage() {
  const router = useRouter();

  const [preferencias, setPreferencias] = useState({
    artistas: [],
    canciones: [],
    generos: [],
    decadas: [],
    playlistBase: null,
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
  // Playlist ya creada en Spotify: { id, url, nombre, ids, publica } (ids = canciones en el último guardado)
  const [guardada, setGuardada] = useState(null);
  const [nombreSugerido, setNombreSugerido] = useState("");
  const [estadoCargado, setEstadoCargado] = useState(false);
  // Filtros con los que se generó la lista: "Añadir más" los reutiliza
  const [ultimosParametros, setUltimosParametros] = useState(null);
  const [panelAnadirAbierto, setPanelAnadirAbierto] = useState(false);
  const [abriendoPlaylist, setAbriendoPlaylist] = useState(false);
  const [vetados, setVetados] = useState([]);
  const [cambiandoId, setCambiandoId] = useState(null);

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

  // Recuperar la última sesión guardada en el dispositivo (lista, filtros y playlist vinculada)
  useEffect(() => {
    const estado = cargarEstado();
    if (estado) {
      if (estado.preferencias) setPreferencias((p) => ({ ...p, ...estado.preferencias }));
      if (estado.opcionesMezcla) setOpcionesMezcla(estado.opcionesMezcla);
      if (Array.isArray(estado.listaReproduccion)) setListaReproduccion(estado.listaReproduccion);
      if (estado.guardada) setGuardada(estado.guardada);
      if (Array.isArray(estado.avisos)) setAvisos(estado.avisos);
      if (estado.nombreSugerido) setNombreSugerido(estado.nombreSugerido);
      if (estado.ultimosParametros) setUltimosParametros(estado.ultimosParametros);
    }
    setVetados(cargarVetados());
    setEstadoCargado(true);
  }, []);

  // Guardar cada cambio (solo después de haber recuperado lo anterior, para no pisarlo)
  useEffect(() => {
    if (!estadoCargado) return;
    guardarEstado({
      preferencias,
      opcionesMezcla,
      listaReproduccion,
      guardada,
      avisos,
      nombreSugerido,
      ultimosParametros,
    });
  }, [estadoCargado, preferencias, opcionesMezcla, listaReproduccion, guardada, avisos, nombreSugerido, ultimosParametros]);

  // Generar playlist usando las preferencias
  async function manejarGenerar() {
    setCargandoPlaylist(true);
    setErrorPlaylist("");
    setAvisos([]);
    setEstadoGuardado({ guardando: false, mensaje: "", error: "" });
    setPanelAnadirAbierto(false);
    // Una lista nueva nunca debe sustituir a una playlist tuya abierta: se desvincula
    if (guardada?.existente) setGuardada(null);

    try {
      const opciones = {
        ...opcionesMezcla,
        objetivo: ajustarObjetivo(opcionesMezcla.objetivo.tipo, opcionesMezcla.objetivo.valor),
      };
      setOpcionesMezcla(opciones);
      const { tracks, avisos } = await generarPlaylist(preferencias, opciones);
      setListaReproduccion(tracks);
      setAvisos(avisos);
      setVecesAnadidas(0);
      setUltimosParametros({ preferencias, opcionesMezcla: opciones });
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

  // Añadir más canciones sobre la playlist actual (sin repetir), con los filtros elegidos
  async function agregarMasCanciones(parametros, objetivo) {
    setCargandoPlaylist(true);
    setErrorPlaylist("");

    try {
      const siguiente = vecesAnadidas + 1;
      const { tracks, avisos } = await generarPlaylist(parametros.preferencias, {
        ...parametros.opcionesMezcla,
        objetivo,
        excluirIds: listaReproduccion.map((t) => t.id),
        desplazamiento: siguiente,
      });
      setListaReproduccion((prev) => [...prev, ...tracks]);
      setVecesAnadidas(siguiente);
      setUltimosParametros(parametros);
      const siguientePaso = guardada
        ? `Pulsa «Actualizar «${guardada.nombre}» en Spotify» para guardarlas.`
        : "Guarda la playlist para tenerlas en Spotify.";
      setAvisos(
        tracks.length === 0
          ? ["No quedan más canciones nuevas con estos filtros."]
          : [
              `➕ Añadidas ${tracks.length} canciones al final de la lista${guardada ? " (marcadas como NUEVA)" : ""}. ${siguientePaso}`,
              ...avisos,
            ]
      );
    } catch (error) {
      console.error(error);
      setErrorPlaylist(error.message || "Error al añadir más canciones.");
    } finally {
      setCargandoPlaylist(false);
    }
  }

  // Abrir una playlist tuya para añadirle canciones: queda vinculada y "Actualizar" las guarda en ella
  async function abrirPlaylistExistente(playlist) {
    setAbriendoPlaylist(true);
    setErrorPlaylist("");
    setEstadoGuardado({ guardando: false, mensaje: "", error: "" });
    try {
      const tracks = await obtenerCancionesPlaylist(playlist.id);
      setListaReproduccion(tracks);
      setGuardada({
        id: playlist.id,
        url: playlist.external_urls?.spotify || `https://open.spotify.com/playlist/${playlist.id}`,
        nombre: playlist.name,
        ids: tracks.map((t) => t.id).join(","),
        publica: playlist.public !== false,
        existente: true,
      });
      setNombreSugerido(playlist.name);
      setVecesAnadidas(0);
      setUltimosParametros({
        preferencias: {
          artistas: [],
          canciones: [],
          generos: [],
          decadas: [],
          playlistBase: { id: playlist.id, name: playlist.name },
        },
        opcionesMezcla,
      });
      setAvisos([
        `📂 Has abierto «${playlist.name}» (${tracks.length} canciones). Elige cuántas añadir; luego pulsa «Actualizar» para guardarlas en ella.`,
      ]);
      setPanelAnadirAbierto(true);
      // En el móvil la lista queda más abajo: se baja hasta ella
      requestAnimationFrame(() =>
        document.getElementById("playlist-generada")?.scrollIntoView({ behavior: "smooth" })
      );
    } catch (error) {
      console.error(error);
      setErrorPlaylist(error.message || "No se pudo abrir la playlist.");
    } finally {
      setAbriendoPlaylist(false);
    }
  }

  // Crear la playlist de verdad en la cuenta de Spotify del usuario
  async function manejarGuardar(nombre, publica = true, conPortada = true) {
    setEstadoGuardado({ guardando: true, mensaje: "", error: "" });
    try {
      const { id, url } = await guardarPlaylistEnSpotify(nombre, listaReproduccion, publica);
      setGuardada({ id, url, nombre, ids: idsActuales, publica });

      // La portada es un extra: si falla, la playlist ya está guardada igualmente
      let aviso = "";
      if (conPortada) {
        try {
          const portada = crearPortada(nombre);
          const puesta = portada && (await subirPortadaPlaylist(id, portada));
          if (!puesta) {
            aviso = " No he podido ponerle portada: cierra sesión y vuelve a entrar para dar el permiso nuevo.";
          }
        } catch (error) {
          console.error("Portada", error);
          aviso = " No he podido ponerle portada.";
        }
      }
      setEstadoGuardado({ guardando: false, mensaje: `✅ Guardada en tu Spotify.${aviso}`, error: "" });
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
      const { tracks, conservadas, quitadasEnSpotify } = await sincronizarPlaylistEnSpotify(
        guardada.id,
        listaReproduccion,
        guardada.ids.split(",")
      );
      // La app se queda igual que Spotify, incluidas las canciones añadidas allí
      setListaReproduccion(tracks);
      setGuardada((prev) => ({ ...prev, ids: tracks.map((t) => t.id).join(",") }));

      const detalles = [];
      if (conservadas > 0) {
        detalles.push(`se han conservado ${conservadas} canciones que añadiste desde Spotify`);
      }
      if (quitadasEnSpotify > 0) {
        detalles.push(`no he vuelto a meter ${quitadasEnSpotify} que quitaste allí`);
      }
      setEstadoGuardado({
        guardando: false,
        mensaje: `✅ «${guardada.nombre}» actualizada${detalles.length ? `: ${detalles.join(" y ")}` : ""}.`,
        error: "",
      });
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
  // Cambiar una canción por otra del mismo artista (con las décadas y el modo de la última vez)
  async function cambiarCancion(track) {
    const artista = track.artists?.[0];
    if (!artista) return;
    setCambiandoId(track.id);
    setErrorPlaylist("");
    try {
      const parametros = ultimosParametros || { preferencias, opcionesMezcla };
      const intentar = (decadas) =>
        generarPlaylist(
          { artistas: [artista], canciones: [], generos: [], decadas, playlistBase: null },
          {
            modo: parametros.opcionesMezcla.modo,
            objetivo: { tipo: "canciones", valor: 1 },
            excluirIds: listaReproduccion.map((t) => t.id),
          }
        );
      let { tracks } = await intentar(parametros.preferencias.decadas || []);
      // Si con esas décadas no queda ninguna, se prueba sin ellas
      if (tracks.length === 0 && parametros.preferencias.decadas?.length) {
        ({ tracks } = await intentar([]));
      }
      if (tracks.length === 0) {
        setAvisos([`No quedan más canciones de ${artista.name} para cambiarla.`]);
        return;
      }
      setListaReproduccion((prev) => prev.map((t) => (t.id === track.id ? tracks[0] : t)));
      setAvisos([`🔄 «${track.name}» → «${tracks[0].name}».`]);
    } catch (error) {
      console.error(error);
      setErrorPlaylist(error.message || "No se pudo cambiar la canción.");
    } finally {
      setCambiandoId(null);
    }
  }

  // Vetar un artista: no vuelve a salir y se quitan sus canciones de la lista
  function vetarArtista(artista) {
    const suyas = listaReproduccion.filter((t) => t.artists?.some((a) => a.id === artista.id));
    const confirmado = window.confirm(
      `¿No quieres más canciones de ${artista.name}? Se quitarán sus ${suyas.length} de esta lista y no volverá a salir (puedes deshacerlo en "Artistas vetados").`
    );
    if (!confirmado) return;
    const nuevos = [...vetados.filter((a) => a.id !== artista.id), { id: artista.id, name: artista.name }];
    setVetados(nuevos);
    guardarVetados(nuevos);
    setListaReproduccion((prev) => prev.filter((t) => !t.artists?.some((a) => a.id === artista.id)));
    setAvisos([`🚫 ${artista.name} vetado.`]);
  }

  function quitarVeto(idArtista) {
    const nuevos = vetados.filter((a) => a.id !== idArtista);
    setVetados(nuevos);
    guardarVetados(nuevos);
  }

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
              Elige artistas, canciones, géneros y décadas (o parte de una playlist
              tuya), decide el tipo de mezcla y genera. Después guárdala en tu Spotify.
              ¿Con amigos? Prueba la <Link href="/grupo">mezcla de grupo</Link>.
            </p>
          </header>

          <PlaylistBaseWidget
            key={estadoCargado ? "listo" : "cargando"}
            playlistBase={preferencias.playlistBase}
            onAbrirPlaylist={abrirPlaylistExistente}
            abriendo={abriendoPlaylist}
            onCambiarPlaylistBase={(playlistBase) =>
              setPreferencias((previas) => ({ ...previas, playlistBase }))
            }
          />

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

          <VetadosWidget vetados={vetados} onQuitar={quitarVeto} />
        </div>

        <div className="dashboard-columna-derecha">
          {/* Junto al botón de generar, que es donde se busca */}
          <MezclaWidget
            opciones={opcionesMezcla}
            onCambiarOpciones={setOpcionesMezcla}
          />

          <PlaylistDisplay
            key={nombreSugerido || "playlist"}
            nombreSugerido={nombreSugerido}
            tracks={listaReproduccion}
            loading={cargandoPlaylist}
            error={errorPlaylist}
            avisos={avisos}
            onGenerate={manejarGenerar}
            panelAnadirAbierto={panelAnadirAbierto}
            onPanelAnadir={setPanelAnadirAbierto}
            renderAnadirMas={(cerrar) => (
              <AnadirMasWidget
                key={JSON.stringify(ultimosParametros)}
                parametros={ultimosParametros || { preferencias, opcionesMezcla }}
                parametrosPanel={{ preferencias, opcionesMezcla }}
                loading={cargandoPlaylist}
                onCerrar={cerrar}
                onAnadir={async (parametros, objetivo) => {
                  await agregarMasCanciones(parametros, objetivo);
                  cerrar();
                }}
              />
            )}
            onSave={manejarGuardar}
            onUpdate={manejarActualizar}
            guardada={guardada}
            hayCambiosSinGuardar={hayCambiosSinGuardar}
            estadoGuardado={estadoGuardado}
            isFavorite={esFavorito}
            onToggleFavorite={toggleFavorito}
            onRemoveTrack={eliminarTrackDePlaylist}
            onSwapTrack={cambiarCancion}
            cambiandoId={cambiandoId}
            onBanArtist={vetarArtista}
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
