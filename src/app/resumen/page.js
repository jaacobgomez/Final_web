'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSesion } from '@/lib/useSesion';
import { obtenerMiPerfil, obtenerMisTops } from '@/lib/spotify';
import { actualizarEstado } from '@/lib/estado';
import { crearImagenResumen } from '@/lib/imagenResumen';

const PERIODOS = [
  { clave: 'short_term', etiqueta: 'Últimas 4 semanas' },
  { clave: 'medium_term', etiqueta: 'Últimos 6 meses' },
  { clave: 'long_term', etiqueta: 'Desde siempre' },
];

export default function PaginaResumen() {
  const sesion = useSesion();
  const router = useRouter();
  const [periodo, setPeriodo] = useState('short_term');
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (sesion !== true) return;
    let activo = true;
    Promise.all([
      obtenerMiPerfil(),
      obtenerMisTops('artists', 10, periodo),
      obtenerMisTops('tracks', 50, periodo),
    ])
      .then(([perfil, artistas, canciones]) => {
        if (!activo) return;
        // Géneros más repetidos entre tus artistas (si Spotify los da)
        const cuenta = new Map();
        artistas.forEach((a) => (a.genres || []).forEach((g) => cuenta.set(g, (cuenta.get(g) || 0) + 1)));
        const generos = [...cuenta.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([g]) => g);
        setDatos({ periodo, nombre: (perfil.display_name || 'Yo').split(' ')[0], artistas, canciones, generos });
        setError('');
      })
      .catch((err) => {
        if (activo) setError(err.message || 'No he podido leer tu top.');
      });
    return () => {
      activo = false;
    };
  }, [sesion, periodo]);

  const etiquetaPeriodo = PERIODOS.find((p) => p.clave === periodo).etiqueta;
  const cargando = !error && datos?.periodo !== periodo;

  const compartirImagen = async () => {
    setMensaje('');
    const blob = await crearImagenResumen({
      nombre: datos.nombre,
      periodo: etiquetaPeriodo,
      artistas: datos.artistas,
      canciones: datos.canciones,
    });
    const archivo = new File([blob], 'mi-top-taste-mixer.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [archivo] })) {
      try {
        await navigator.share({ files: [archivo], title: 'Mi top musical' });
      } catch {
        // canceló el menú de compartir
      }
      return;
    }
    // Ordenador: se descarga
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = archivo.name;
    enlace.click();
    URL.revokeObjectURL(enlace.href);
    setMensaje('📥 Imagen descargada.');
  };

  const hacerPlaylist = () => {
    // Sus artistas quedan en los widgets del panel para seguir con «Añadir más»
    const preferencias = {
      artistas: datos.artistas.slice(0, 10).map(({ id, name }) => ({ id, name })),
      canciones: [],
      generos: [],
      decadas: [],
      playlistBase: null,
    };
    actualizarEstado({
      preferencias,
      listaReproduccion: datos.canciones,
      guardada: null,
      nombreSugerido: `Mi top · ${etiquetaPeriodo.toLowerCase()}`,
      avisos: [`⭐ Tus ${datos.canciones.length} canciones más escuchadas (${etiquetaPeriodo.toLowerCase()}).`],
      ultimosParametros: {
        preferencias,
        opcionesMezcla: { modo: 'equilibrado', objetivo: { tipo: 'canciones', valor: 30 }, usarMiGusto: false },
      },
    });
    router.push('/dashboard');
  };

  if (sesion === null) return null;

  if (sesion === false) {
    return (
      <section className="portada-inicio">
        <div className="tarjeta-inicio card">
          <h2 className="titulo-inicio">Tu resumen musical</h2>
          <p className="texto-descripcion">Inicia sesión con Spotify para ver tu top.</p>
          <Link href="/" className="boton-inicio">Ir al inicio</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="portada-inicio">
      <div className="tarjeta-inicio card">
        <p className="texto-pequeno">Tu resumen musical</p>
        <h2 className="titulo-inicio">{datos ? `El top de ${datos.nombre}` : 'Tu top'}</h2>

        <div className="botones-popularidad">
          {PERIODOS.map((p) => (
            <button
              key={p.clave}
              type="button"
              className={`boton-popularidad ${periodo === p.clave ? 'boton-popularidad-activo' : ''}`}
              onClick={() => setPeriodo(p.clave)}
            >
              {p.etiqueta}
            </button>
          ))}
        </div>

        {error && <p className="texto-error-busqueda">{error}</p>}
        {cargando && <p className="texto-estado-busqueda">Cargando tu top…</p>}

        {!cargando && datos && (
          <>
            {datos.artistas.length === 0 ? (
              <p className="lista-vacia">Spotify aún no tiene datos tuyos para este periodo.</p>
            ) : (
              <>
                <h3 className="widget-titulo">Artistas</h3>
                <ol className="resumen-lista">
                  {datos.artistas.map((a) => (
                    <li key={a.id}>
                      {a.images?.length > 0 && (
                        <img src={a.images[a.images.length - 1].url} alt="" className="resumen-foto" />
                      )}
                      {a.name}
                    </li>
                  ))}
                </ol>

                {datos.generos.length > 0 && (
                  <p className="widget-texto">🏷️ Lo tuyo: {datos.generos.join(' · ')}</p>
                )}

                <h3 className="widget-titulo">Canciones</h3>
                <ol className="resumen-lista">
                  {datos.canciones.slice(0, 10).map((c) => (
                    <li key={c.id}>
                      {c.name} <span className="track-card-artista">· {c.artists?.map((x) => x.name).join(', ')}</span>
                    </li>
                  ))}
                </ol>

                <div className="botones-playlist">
                  <button type="button" className="boton-playlist" onClick={compartirImagen}>
                    📤 Compartir imagen
                  </button>
                  <button type="button" className="boton-playlist secundario" onClick={hacerPlaylist}>
                    🎛️ Playlist con mi top
                  </button>
                </div>
                {mensaje && <p className="texto-estado-busqueda">{mensaje}</p>}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
