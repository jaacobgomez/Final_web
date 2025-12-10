'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { buscarCancionesSpotify } from "@/lib/spotify";
import GenreWidget from "@/components/Widgets/GenreWidget";
import DecadeWidget from "@/components/Widgets/DecadeWidget";
import PopularityWidget from "@/components/Widgets/PopularityWidget";
import ArtistWidget from "@/components/Widgets/ArtistWidget";
import TrackWidget from "@/components/Widgets/TrackWidget";
import PlaylistDisplay from "@/components/PlaylistDisplay"; 
import TrackCard from "@/components/TrackCard";
import {
  obtenerTopTracksArtista,
  buscarTracksPorGenero,
} from "@/lib/spotify";




export default function DashboardPage() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const router = useRouter();

  const [preferencias, setPreferencias] = useState({
    artistas: [],
    canciones: [],
    generos: [],
    decadas: [],
    popularidad: { min: 30, max: 90 },
    mood: { energia: 0.7, valencia: 0.7, baile: 0.7 },
  });


  const [listaReproduccion, setListaReproduccion] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [cargandoPlaylist, setCargandoPlaylist] = useState(false);
  const [errorPlaylist, setErrorPlaylist] = useState("");

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

  // Convertir "1980s" -> {min: 1980, max: 1989}
function rangoDecada(decada) {
  const inicio = parseInt(decada.slice(0, 4), 10);
  if (Number.isNaN(inicio)) return null;
  return { min: inicio, max: inicio + 9 };
}

function anioDeTrack(track) {
  const fecha = track.album?.release_date;
  if (!fecha) return null;
  // formato "YYYY-MM-DD" o "YYYY"
  const anio = parseInt(fecha.slice(0, 4), 10);
  return Number.isNaN(anio) ? null : anio;
}

// Generar playlist usando las preferencias
async function generarPlaylist() {
  setCargandoPlaylist(true);
  setErrorPlaylist("");

  try {
    let tracks = [];

    // 1) Top tracks de artistas seleccionados
    for (const artista of preferencias.artistas.slice(0, 3)) {
      const topTracks = await obtenerTopTracksArtista(artista.id);
      tracks.push(...topTracks.slice(0, 5)); // 5 por artista
    }

    // 2) Canciones por género
    for (const genero of preferencias.generos.slice(0, 3)) {
      const tracksGenero = await buscarTracksPorGenero(genero, 8);
      tracks.push(...tracksGenero);
    }

    // 3) Añadir canciones seleccionadas directamente en el widget de canciones
    tracks.push(...preferencias.canciones);

    // 4) Eliminar duplicados por id
    const mapa = new Map();
    for (const t of tracks) {
      if (!mapa.has(t.id)) {
        mapa.set(t.id, t);
      }
    }
    tracks = Array.from(mapa.values());

    // 5) Filtrar por popularidad
    const { min, max } = preferencias.popularidad;
    tracks = tracks.filter(
      (t) => t.popularity >= min && t.popularity <= max
    );

    // 6) Filtrar por década (si se han seleccionado)
    if (preferencias.decadas.length > 0) {
      const rangos = preferencias.decadas
        .map(rangoDecada)
        .filter(Boolean);

      tracks = tracks.filter((t) => {
        const anio = anioDeTrack(t);
        if (!anio) return false;
        return rangos.some((r) => anio >= r.min && anio <= r.max);
      });
    }

    // 7) Limitar tamaño final (por ejemplo 30 canciones)
    tracks = tracks.slice(0, 30);

    setListaReproduccion(tracks);
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

// Añadir más canciones sobre la playlist actual
async function agregarMasCanciones() {
  if (listaReproduccion.length === 0) {
    await generarPlaylist();
    return;
  }

  setCargandoPlaylist(true);
  setErrorPlaylist("");

  try {
    let nuevas = [];

    for (const artista of preferencias.artistas.slice(0, 2)) {
      const topTracks = await obtenerTopTracksArtista(artista.id);
      nuevas.push(...topTracks.slice(0, 5));
    }

    for (const genero of preferencias.generos.slice(0, 2)) {
      const tracksGenero = await buscarTracksPorGenero(genero, 5);
      nuevas.push(...tracksGenero);
    }

    const mapa = new Map();
    for (const t of [...listaReproduccion, ...nuevas]) {
      if (!mapa.has(t.id)) {
        mapa.set(t.id, t);
      }
    }

    setListaReproduccion(Array.from(mapa.values()).slice(0, 50));
  } catch (error) {
    console.error(error);
    setErrorPlaylist(
      error.message || "Error al añadir más canciones."
    );
  } finally {
    setCargandoPlaylist(false);
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
    let nuevaLista;

    if (existe) {
      nuevaLista = prev.filter((t) => t.id !== track.id);
    } else {
      nuevaLista = [...prev, track];
    }

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "favorite_tracks",
          JSON.stringify(nuevaLista)
        );
      } catch (error) {
        console.error("Error guardando favoritos en localStorage", error);
      }
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
            <h2 className="dashboard-titulo">Panel de mezcla
            <p className="dashboard-texto">
              Configura tus preferencias con los widgets (artistas, géneros,
              décadas, etc.) y genera una playlist personalizada.
            </p>
            </h2>
           </header>

            <div className="grid-widgets">
              <GenreWidget
                  generosSeleccionados={preferencias.generos}
                  onCambiarGeneros={(nuevosGeneros) =>
                    setPreferencias((previas) => ({
                      ...previas,
                      generos: nuevosGeneros,
                    }))
                  }
                />
            </div>

            <DecadeWidget
              decadasSeleccionadas={preferencias.decadas}
              onCambiarDecadas={(nuevasDecadas) =>
                setPreferencias((previas) => ({
                  ...previas,
                  decadas: nuevasDecadas,
                }))
              }
            />


            <PopularityWidget
              popularidad={preferencias.popularidad}
              onCambiarPopularidad={(nuevaPopularidad) =>
                setPreferencias((previas) => ({
                  ...previas,
                  popularidad: nuevaPopularidad,
                }))
              }
            />
            <ArtistWidget
              artistasSeleccionados={preferencias.artistas}
              onCambiarArtistas={(nuevosArtistas) =>
                setPreferencias((previas) => ({
                  ...previas,
                  artistas: nuevosArtistas,
                }))
              }
            />
            <TrackWidget
              cancionesSeleccionadas={preferencias.canciones}
              onCambiarCanciones={(nuevasCanciones) =>
                setPreferencias((previas) => ({
                  ...previas,
                  canciones: nuevasCanciones,
                }))
              }
            />
      </div>

      <div className="dashboard-columna-derecha">
         <div className="card bloque-playlist">
            <PlaylistDisplay
              tracks={listaReproduccion}
              loading={cargandoPlaylist}
              error={errorPlaylist}
              onGenerate={generarPlaylist}
              onAddMore={agregarMasCanciones}
              isFavorite={esFavorito}
              onToggleFavorite={toggleFavorito}
              onRemoveTrack={eliminarTrackDePlaylist}
            />
        <div className="card bloque-favoritos">
          <div className="bloque-cabecera">
            <h3 className="bloque-titulo">Tus canciones favoritas</h3>
            <p className="bloque-subtitulo">
              Se guardan en <code>localStorage</code>. Puedes marcarlas desde la playlist.
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
                  {track.name} ·{" "}
                  {track.artists?.map((a) => a.name).join(", ")}
                </li>
              ))}
            </ul>
          )}
        </div>
        </div>
      </div>
    </div>
  </section>
);}