'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSesion } from '@/lib/useSesion';
import { cargarEstado } from '@/lib/estado';
import {
  obtenerCancionesPlaylist,
  obtenerMiPerfil,
  obtenerMisPlaylists,
  guardarPlaylistEnSpotify,
  ponerEnCola,
  sincronizarPlaylistEnSpotify,
} from '@/lib/spotify';
import {
  accionAnfitrion,
  cargarFiestaAnfitrion,
  crearFiesta,
  escucharFiesta,
  fiestaDisponible,
  guardarFiestaAnfitrion,
  leerFiesta,
  ranking,
} from '@/lib/fiesta';
import FiestaRanking from '@/components/FiestaRanking';
import CodigoQR from '@/components/CodigoQR';

// Pantalla del anfitrión: crear la fiesta, enseñar el QR, ver el ranking en directo,
// pasarlo a Spotify y poner en la cola la más votada.
export default function PaginaFiesta() {
  const sesion = useSesion();
  const [anfitrion, setAnfitrion] = useState(undefined); // undefined = cargando, null = sin fiesta

  useEffect(() => {
    let activo = true;
    Promise.resolve().then(() => {
      if (activo) setAnfitrion(cargarFiestaAnfitrion());
    });
    return () => {
      activo = false;
    };
  }, []);

  const cambiarAnfitrion = (datos) => {
    guardarFiestaAnfitrion(datos);
    setAnfitrion(datos);
  };

  if (sesion === null || anfitrion === undefined) return null;

  if (!fiestaDisponible()) {
    return (
      <Aviso titulo="Fiesta con votos" texto="Esta función aún no está configurada (faltan las claves de Supabase)." />
    );
  }

  if (sesion === false) {
    return (
      <Aviso
        titulo="Fiesta con votos"
        texto="Para organizar una fiesta inicia sesión con Spotify. ¿Te han invitado? Abre el enlace o el QR que te han pasado: no necesitas cuenta."
        enlace
      />
    );
  }

  return anfitrion ? (
    <PanelAnfitrion anfitrion={anfitrion} onCambiar={cambiarAnfitrion} />
  ) : (
    <CrearFiesta onCreada={cambiarAnfitrion} />
  );
}

function Aviso({ titulo, texto, enlace = false }) {
  return (
    <section className="portada-inicio">
      <div className="tarjeta-inicio card">
        <h2 className="titulo-inicio">{titulo}</h2>
        <p className="texto-descripcion">{texto}</p>
        {enlace && <Link href="/" className="boton-inicio">Ir al inicio</Link>}
      </div>
    </section>
  );
}

function CrearFiesta({ onCreada }) {
  const [nombre, setNombre] = useState('');
  const [votos, setVotos] = useState(3);
  const [base, setBase] = useState('ninguna');
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState('');
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState('');
  const [listaPanel, setListaPanel] = useState([]);

  useEffect(() => {
    let activo = true;
    Promise.resolve().then(() => {
      if (activo) setListaPanel(cargarEstado()?.listaReproduccion || []);
    });
    obtenerMiPerfil()
      .then((perfil) => activo && setNombre((n) => n || `Fiesta de ${(perfil.display_name || 'Jacob').split(' ')[0]}`))
      .catch(() => {});
    obtenerMisPlaylists()
      .then((lista) => activo && setPlaylists(lista))
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, []);

  const crear = async (e) => {
    e.preventDefault();
    setError('');
    setCreando(true);
    try {
      let canciones = [];
      if (base === 'panel') canciones = listaPanel;
      if (base === 'playlist' && playlistId) canciones = await obtenerCancionesPlaylist(playlistId);
      const { codigo, claveAnfitrion } = await crearFiesta(nombre.trim(), votos, canciones.slice(0, 300));
      onCreada({ codigo, clave: claveAnfitrion, playlistId: null, idsGuardados: [], encoladas: [] });
    } catch (err) {
      setError(err.message);
      setCreando(false);
    }
  };

  return (
    <section className="portada-inicio">
      <form className="tarjeta-inicio card" onSubmit={crear}>
        <p className="texto-pequeno">Para cumpleaños, cenas y fiestas</p>
        <h2 className="titulo-inicio">🗳️ Fiesta con votos</h2>
        <p className="texto-descripcion">
          Tus invitados escanean un QR, añaden y votan canciones desde su móvil (sin cuenta de Spotify) y la
          lista se ordena sola.
        </p>

        <label className="popularidad-label" htmlFor="nombre-fiesta">Nombre</label>
        <input id="nombre-fiesta" className="widget-input" value={nombre} maxLength={60} onChange={(e) => setNombre(e.target.value)} />

        <label className="popularidad-label" htmlFor="votos-fiesta">Votos por persona</label>
        <input
          id="votos-fiesta"
          type="number"
          min={1}
          max={10}
          className="widget-input cantidad-input"
          value={votos}
          onChange={(e) => setVotos(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
        />

        <p className="popularidad-label">Lista de partida (opcional)</p>
        <label className="popularidad-label">
          <input type="radio" name="base" checked={base === 'ninguna'} onChange={() => setBase('ninguna')} /> Ninguna:
          empezáis de cero
        </label>
        <label className="popularidad-label">
          <input
            type="radio"
            name="base"
            checked={base === 'panel'}
            disabled={listaPanel.length === 0}
            onChange={() => setBase('panel')}
          />{' '}
          La lista del panel ({listaPanel.length} canciones)
        </label>
        <label className="popularidad-label">
          <input type="radio" name="base" checked={base === 'playlist'} onChange={() => setBase('playlist')} /> Una de
          tus playlists
        </label>
        {base === 'playlist' && (
          <select className="widget-input" value={playlistId} onChange={(e) => setPlaylistId(e.target.value)}>
            <option value="">— Elige una —</option>
            {playlists.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}

        <button
          type="submit"
          className="boton-inicio"
          disabled={creando || !nombre.trim() || (base === 'playlist' && !playlistId)}
        >
          {creando ? 'Creando…' : '🎉 Crear fiesta'}
        </button>
        {error && <p className="texto-error-busqueda">{error}</p>}
      </form>
    </section>
  );
}

function PanelAnfitrion({ anfitrion, onCambiar }) {
  const [datos, setDatos] = useState(undefined);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState('');
  const [enlace, setEnlace] = useState('');

  const recargar = useCallback(async () => {
    try {
      const leido = await leerFiesta(anfitrion.codigo);
      setDatos(leido);
    } catch {
      setError('No me llega la fiesta. ¿Tienes conexión?');
    }
  }, [anfitrion.codigo]);

  useEffect(() => {
    let activo = true;
    Promise.resolve().then(() => {
      if (!activo) return;
      setEnlace(`${window.location.origin}/fiesta/${anfitrion.codigo}`);
      recargar();
    });
    return () => {
      activo = false;
    };
  }, [anfitrion.codigo, recargar]);

  const fiestaId = datos?.fiesta?.id;
  useEffect(() => {
    if (!fiestaId) return undefined;
    return escucharFiesta(fiestaId, recargar);
  }, [fiestaId, recargar]);

  if (datos === undefined) return <Aviso titulo="Cargando la fiesta…" texto="" />;

  // Caducada o terminada desde otro sitio
  if (datos === null) {
    return (
      <section className="portada-inicio">
        <div className="tarjeta-inicio card">
          <h2 className="titulo-inicio">La fiesta ha terminado</h2>
          <p className="texto-descripcion">Han pasado 24 h o se cerró. Puedes crear otra cuando quieras.</p>
          <button type="button" className="boton-inicio" onClick={() => onCambiar(null)}>
            Crear otra fiesta
          </button>
        </div>
      </section>
    );
  }

  const { fiesta } = datos;
  const lista = ranking(datos, null);
  const personas = new Set(datos.votos.map((v) => v.invitado_id)).size;

  const ejecutar = async (clave, accion) => {
    setError('');
    setMensaje('');
    setOcupado(clave);
    try {
      await accion();
    } catch (err) {
      setError(err.message);
    } finally {
      setOcupado('');
    }
  };

  const compartir = async () => {
    const texto = `🎉 Vota la música de «${fiesta.nombre}»`;
    if (navigator.share) {
      try {
        await navigator.share({ title: fiesta.nombre, text: texto, url: enlace });
      } catch {
        // canceló el menú de compartir
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${texto}: ${enlace}`)}`, '_blank', 'noreferrer');
    }
  };

  // Crea la playlist la primera vez; después la pone al día en el orden de los votos
  const pasarASpotify = () =>
    ejecutar('spotify', async () => {
      const tracks = lista.map((item) => item.datos);
      if (tracks.length === 0) throw new Error('Todavía no hay canciones.');
      let { playlistId } = anfitrion;
      if (!playlistId) {
        ({ id: playlistId } = await guardarPlaylistEnSpotify(`🎉 ${fiesta.nombre}`, tracks, false));
      } else {
        await sincronizarPlaylistEnSpotify(playlistId, tracks, anfitrion.idsGuardados || [], true);
      }
      onCambiar({ ...anfitrion, playlistId, idsGuardados: tracks.map((t) => t.id) });
      setMensaje(`✅ Playlist «🎉 ${fiesta.nombre}» al día en tu Spotify, en el orden de los votos.`);
    });

  const siguiente = lista.find((item) => !(anfitrion.encoladas || []).includes(item.track_id));
  const ponerSiguiente = () =>
    ejecutar('cola', async () => {
      await ponerEnCola(siguiente.datos.uri);
      onCambiar({ ...anfitrion, encoladas: [...(anfitrion.encoladas || []), siguiente.track_id] });
      setMensaje(`⏭️ «${siguiente.datos.name}» está en la cola de tu Spotify.`);
    });

  const quitar = (item) => {
    if (!window.confirm(`¿Quitar «${item.datos.name}» de la fiesta? Se perderán sus votos.`)) return;
    ejecutar(`quitar-${item.id}`, async () => {
      await accionAnfitrion(fiesta.codigo, anfitrion.clave, 'quitar', { cancionId: item.id });
      await recargar();
    });
  };

  const terminar = () => {
    if (!window.confirm('¿Terminar la fiesta? Se borran las canciones, los votos y los nombres de los invitados. La playlist de Spotify se queda.')) return;
    ejecutar('terminar', async () => {
      await accionAnfitrion(fiesta.codigo, anfitrion.clave, 'terminar');
      onCambiar(null);
    });
  };

  return (
    <section className="portada-inicio">
      <div className="tarjeta-inicio card fiesta-tarjeta">
        <p className="texto-pequeno">🎉 Eres el anfitrión</p>
        <h2 className="titulo-inicio">{fiesta.nombre}</h2>

        <div className="fiesta-entrada">
          {enlace && <CodigoQR texto={enlace} />}
          <div>
            <p className="widget-texto">Que escaneen el QR o entren con el código:</p>
            <p className="fiesta-codigo">{fiesta.codigo}</p>
            <div className="botones-playlist">
              <button type="button" className="boton-playlist secundario" onClick={compartir}>📤 Enviar enlace</button>
              <Link href={`/fiesta/${fiesta.codigo}`} className="boton-info-decadas">Votar yo también</Link>
            </div>
          </div>
        </div>

        <p className="widget-texto">
          👥 {personas} {personas === 1 ? 'persona ha' : 'personas han'} votado · {fiesta.votos_por_persona} votos cada una ·
          se actualiza sola
        </p>

        <div className="botones-playlist">
          <button type="button" className="boton-playlist" onClick={pasarASpotify} disabled={ocupado !== '' || lista.length === 0}>
            {ocupado === 'spotify' ? 'Pasando…' : anfitrion.playlistId ? '🔄 Actualizar en Spotify' : '📲 Pasar a Spotify'}
          </button>
          <button type="button" className="boton-playlist secundario" onClick={ponerSiguiente} disabled={ocupado !== '' || !siguiente}>
            {ocupado === 'cola' ? 'Poniendo…' : '⏭️ Poner la más votada en la cola'}
          </button>
        </div>
        {siguiente && <p className="texto-pequeno">Siguiente para la cola: {siguiente.datos.name}</p>}

        {mensaje && <p className="texto-estado-busqueda">{mensaje}</p>}
        {error && <p className="texto-error-busqueda">{error}</p>}

        <FiestaRanking items={lista} anfitrion onQuitar={quitar} encoladas={anfitrion.encoladas || []} />

        <button type="button" className="boton-info-decadas" onClick={terminar} disabled={ocupado !== ''}>
          Terminar la fiesta
        </button>
      </div>
    </section>
  );
}
