'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSesion } from '@/lib/useSesion';
import { generarMezclaGrupo, obtenerMiGusto } from '@/lib/spotify';
import { cargarGrupo, codificarGusto, decodificarGusto, guardarGrupo } from '@/lib/grupo';
import { actualizarEstado } from '@/lib/estado';

// useSearchParams necesita un <Suspense> alrededor para el build de producción
export default function PaginaGrupo() {
  return (
    <Suspense fallback={null}>
      <Grupo />
    </Suspense>
  );
}

function Grupo() {
  const sesion = useSesion();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [participantes, setParticipantes] = useState([]);
  const [pegado, setPegado] = useState('');
  const [incluirme, setIncluirme] = useState(true);
  const [sinExplicitas, setSinExplicitas] = useState(false);
  const [miEnlace, setMiEnlace] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Gusto recibido por enlace (?gusto=...), pendiente de que lo acepte
  const pendiente = searchParams.get('gusto') ? decodificarGusto(searchParams.get('gusto')) : null;

  useEffect(() => {
    let activo = true;
    Promise.resolve(cargarGrupo()).then((grupo) => {
      if (activo) setParticipantes(grupo);
    });
    return () => {
      activo = false;
    };
  }, []);

  const cambiarParticipantes = (nuevos) => {
    setParticipantes(nuevos);
    guardarGrupo(nuevos);
  };

  const anadirParticipante = (gusto) => {
    // Si ya estaba (mismo nombre), se actualiza su gusto
    const resto = participantes.filter((p) => p.nombre !== gusto.nombre);
    cambiarParticipantes([...resto, gusto]);
    setMensaje(`✅ Añadido el gusto de ${gusto.nombre}.`);
  };

  const aceptarPendiente = () => {
    anadirParticipante(pendiente);
    router.replace('/grupo');
  };

  const anadirPegado = () => {
    const gusto = decodificarGusto(pegado);
    if (!gusto) {
      setError('Ese enlace o código no es válido.');
      return;
    }
    setError('');
    setPegado('');
    anadirParticipante(gusto);
  };

  const compartirMiGusto = async () => {
    setError('');
    try {
      const gusto = await obtenerMiGusto();
      const enlace = `${window.location.origin}/grupo?gusto=${codificarGusto(gusto)}`;
      setMiEnlace(enlace);
      const texto = `Únete a mi mezcla de grupo en Taste Mixer 🎵`;
      if (navigator.share) {
        try {
          await navigator.share({ title: 'Mi gusto musical', text: texto, url: enlace });
        } catch {
          // canceló el menú de compartir: el enlace queda visible para copiarlo
        }
      } else {
        await navigator.clipboard.writeText(enlace);
        setMensaje('📋 Enlace copiado: pégalo en WhatsApp a quien haga la mezcla.');
      }
    } catch (err) {
      setError(err.message || 'No he podido leer tu gusto.');
    }
  };

  const generar = async () => {
    setError('');
    setCargando(true);
    try {
      const todos = [...participantes];
      if (incluirme) {
        const miGusto = await obtenerMiGusto();
        todos.push(miGusto);
      }
      if (todos.length < 2) {
        setError('Hacen falta al menos 2 personas.');
        return;
      }

      const { tracks, avisos, comunes, artistas } = await generarMezclaGrupo(todos, { sinExplicitas });
      const nombres = todos.map((p) => p.nombre).join(', ');

      // Se abre en el panel con todo lo de siempre: guardar, actualizar, compartir…
      actualizarEstado({
        listaReproduccion: tracks,
        guardada: null,
        // "Añadir más" en el panel seguirá con los artistas del grupo
        ultimosParametros: {
          preferencias: { artistas, canciones: [], generos: [], decadas: [], playlistBase: null },
          opcionesMezcla: {
            modo: 'equilibrado',
            objetivo: { tipo: 'canciones', valor: 30 },
            usarMiGusto: false,
            sinExplicitas,
          },
        },
        nombreSugerido: `Mezcla · ${nombres}`.slice(0, 90),
        avisos: [
          `👥 Mezcla de grupo: ${nombres}.`,
          comunes.length > 0
            ? `En común: ${comunes.slice(0, 5).join(', ')}.`
            : 'No tenéis artistas en común: he repartido los favoritos de cada uno.',
          ...avisos,
        ],
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'No se pudo generar la mezcla.');
    } finally {
      setCargando(false);
    }
  };

  if (sesion === null) return null;

  if (sesion === false) {
    return (
      <section className="portada-inicio">
        <div className="tarjeta-inicio card">
          <h2 className="titulo-inicio">Mezcla de grupo</h2>
          <p className="texto-descripcion">
            Inicia sesión con Spotify para unirte o crear una mezcla. Después vuelve a abrir el
            enlace que te han pasado.
          </p>
          <Link href="/" className="boton-inicio">Ir al inicio</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="portada-inicio">
      <div className="tarjeta-inicio card">
        <p className="texto-pequeno">Para viajes, quedadas y regalos</p>
        <h2 className="titulo-inicio">Mezcla de grupo</h2>
        <div className="grupo-explicacion">
          <p>
            <strong>Qué hace:</strong> junta los artistas favoritos de varias personas y crea una playlist con lo que
            tenéis en común y un poco de cada uno. No hace falta estar juntos: cada uno manda su enlace cuando pueda.
          </p>
          <p>
            <strong>¿Y una Jam de Spotify?</strong> En una Jam elegís canción a canción en directo. Aquí no tenéis que
            pensar nada: la app elige por vosotros según lo que escucha cada uno.{' '}
            ¿Estáis juntos y queréis votar lo que suena? Usa <Link href="/fiesta">🎉 Fiesta</Link>.
          </p>
        </div>

        {pendiente && (
          <div className="card">
            <p className="texto-descripcion">
              🎧 <strong>{pendiente.nombre}</strong> te ha pasado su gusto (
              {pendiente.artistas.slice(0, 3).map((a) => a.name).join(', ')}…).
            </p>
            <div className="botones-playlist">
              <button type="button" className="boton-playlist" onClick={aceptarPendiente}>
                Añadir al grupo
              </button>
              <button
                type="button"
                className="boton-playlist secundario"
                onClick={() => router.replace('/grupo')}
              >
                Ignorar
              </button>
            </div>
          </div>
        )}

        <h3 className="widget-titulo">1. Cada amigo comparte su gusto</h3>
        <p className="widget-texto">
          Desde su móvil, con su sesión iniciada, pulsa este botón y te manda el enlace. Solo se
          comparten su nombre y sus 10 artistas favoritos.
        </p>
        <button type="button" className="boton-playlist secundario" onClick={compartirMiGusto}>
          📤 Compartir mi gusto
        </button>
        {miEnlace && (
          <input type="text" className="widget-input" value={miEnlace} readOnly onFocus={(e) => e.target.select()} />
        )}

        <h3 className="widget-titulo">2. Quien hace la mezcla junta los enlaces</h3>
        <p className="widget-texto">
          Abre los enlaces que te pasen (se añaden solos) o pégalos aquí:
        </p>
        <div className="botones-playlist">
          <input
            type="text"
            className="widget-input"
            placeholder="Pega aquí el enlace o el código"
            value={pegado}
            onChange={(e) => setPegado(e.target.value)}
          />
          <button type="button" className="boton-playlist secundario" onClick={anadirPegado}>
            Añadir
          </button>
        </div>

        {participantes.length > 0 ? (
          <ul className="lista-favoritos">
            {participantes.map((p) => (
              <li key={p.nombre}>
                <strong>{p.nombre}</strong> · {p.artistas.slice(0, 3).map((a) => a.name).join(', ')}…{' '}
                <button
                  type="button"
                  className="boton-info-decadas"
                  onClick={() => cambiarParticipantes(participantes.filter((x) => x.nombre !== p.nombre))}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="lista-vacia">Todavía no hay nadie en el grupo.</p>
        )}

        <label className="popularidad-label">
          <input type="checkbox" checked={incluirme} onChange={(e) => setIncluirme(e.target.checked)} />{' '}
          Incluir también mi gusto
        </label>
        <label className="popularidad-label">
          <input type="checkbox" checked={sinExplicitas} onChange={(e) => setSinExplicitas(e.target.checked)} />{' '}
          🔞 Sin canciones explícitas
        </label>

        <h3 className="widget-titulo">3. Generar</h3>
        <button type="button" className="boton-inicio" onClick={generar} disabled={cargando}>
          {cargando ? 'Mezclando…' : '🎛️ Generar mezcla de grupo'}
        </button>

        {mensaje && <p className="texto-estado-busqueda">{mensaje}</p>}
        {error && <p className="texto-error-busqueda">{error}</p>}
      </div>
    </section>
  );
}
