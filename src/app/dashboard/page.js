'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import GenreWidget from "@/components/Widgets/GenreWidget";
import DecadeWidget from "@/components/Widgets/DecadeWidget";
import PopularityWidget from "@/components/Widgets/PopularityWidget";


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
            <div className="card widget-placeholder">
              <h3 className="widget-titulo">Widget de artistas</h3>
              <p className="widget-texto">
                Aquí buscarás y guardarás tus artistas clave.
              </p>
            </div>
          </div>
        </div>

         <div className="dashboard-columna-derecha">
          <div className="card bloque-playlist">
            <div className="bloque-cabecera">
              <h3 className="bloque-titulo">Playlist generada</h3>
              <p className="bloque-subtitulo">
                Aquí aparecerán las canciones según tus widgets.
              </p>
            </div>

            {listaReproduccion.length === 0 ? (
              <p className="lista-vacia">
                Todavía no hay canciones. Cuando tengamos los widgets listos,
                podrás generar tu primera mezcla aquí.
              </p>
            ) : (
            <ul>
                {/* Más adelante: mapear cada canción */}
            </ul>
          )}
        </div>
        <div className="card bloque-favoritos">
            <div className="bloque-cabecera">
              <h3 className="bloque-titulo">Tus canciones favoritas</h3>
              <p className="bloque-subtitulo">
                Se guardan usando <code>localStorage</code>.
              </p>
            </div>

            {favoritos.length === 0 ? (
              <p className="lista-vacia">
                Aún no has marcado ninguna canción como favorita.
              </p>
            ) : (
              <ul>
                {/* Más adelante listaremos aquí los favoritos */}
              </ul>
            )}
          </div>
        </div>
    </section>
  );
}