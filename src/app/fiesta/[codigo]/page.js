'use client';

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FiestaRanking from '@/components/FiestaRanking';
import {
  buscarParaFiesta,
  cargarInvitado,
  escucharFiesta,
  guardarNombreInvitado,
  leerFiesta,
  proponerCancion,
  quitarVoto,
  ranking,
  votar,
  votosUsados,
} from '@/lib/fiesta';

// Pantalla del invitado: no necesita cuenta de Spotify, solo un nombre.
export default function PaginaInvitado() {
  const { codigo } = useParams();
  const [invitado, setInvitado] = useState(null);
  const [nombre, setNombre] = useState('');
  const [datos, setDatos] = useState(undefined); // undefined = cargando, null = no existe
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [ocupadoId, setOcupadoId] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const recargar = useCallback(async () => {
    try {
      setDatos(await leerFiesta(codigo));
    } catch {
      setError('No me llega la fiesta. ¿Tienes conexión?');
    }
  }, [codigo]);

  useEffect(() => {
    let activo = true;
    Promise.resolve().then(() => {
      if (!activo) return;
      setInvitado(cargarInvitado());
      recargar();
    });
    return () => {
      activo = false;
    };
  }, [recargar]);

  const fiestaId = datos?.fiesta?.id;
  useEffect(() => {
    if (!fiestaId) return undefined;
    return escucharFiesta(fiestaId, recargar);
  }, [fiestaId, recargar]);

  if (datos === undefined || invitado === null) {
    return <section className="portada-inicio"><p className="texto-estado-busqueda">Entrando en la fiesta…</p></section>;
  }

  if (datos === null) {
    return (
      <section className="portada-inicio">
        <div className="tarjeta-inicio card">
          <h2 className="titulo-inicio">Esta fiesta no existe</h2>
          <p className="texto-descripcion">O ya ha terminado. Pídele el enlace nuevo a quien la organiza.</p>
        </div>
      </section>
    );
  }

  const { fiesta } = datos;

  if (!invitado.nombre) {
    return (
      <section className="portada-inicio">
        <form
          className="tarjeta-inicio card"
          onSubmit={(e) => {
            e.preventDefault();
            if (nombre.trim()) setInvitado(guardarNombreInvitado(nombre.trim().slice(0, 30)));
          }}
        >
          <p className="texto-pequeno">🎉 Te han invitado a</p>
          <h2 className="titulo-inicio">{fiesta.nombre}</h2>
          <p className="texto-descripcion">
            Tienes {fiesta.votos_por_persona} votos para elegir lo que suena. No hace falta cuenta de Spotify.
          </p>
          <input
            className="widget-input"
            placeholder="¿Cómo te llamas?"
            value={nombre}
            maxLength={30}
            onChange={(e) => setNombre(e.target.value)}
            autoFocus
          />
          <button type="submit" className="boton-inicio" disabled={!nombre.trim()}>
            Entrar
          </button>
        </form>
      </section>
    );
  }

  const lista = ranking(datos, invitado.id);
  const usados = votosUsados(datos, invitado.id);
  const quedan = fiesta.votos_por_persona - usados;
  const idsEnFiesta = new Map(lista.map((item) => [item.track_id, item]));

  const ejecutar = async (id, accion, textoOk) => {
    setError('');
    setMensaje('');
    setOcupadoId(id);
    try {
      await accion();
      if (textoOk) setMensaje(textoOk);
      await recargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setOcupadoId(null);
    }
  };

  const alternarVoto = (item) =>
    ejecutar(item.id, () =>
      item.miVoto ? quitarVoto(fiesta.codigo, item.id, invitado) : votar(fiesta.codigo, item.id, invitado)
    );

  const buscar = async (e) => {
    e.preventDefault();
    setError('');
    setBuscando(true);
    try {
      setResultados(await buscarParaFiesta(fiesta.codigo, busqueda.trim()));
    } catch (err) {
      setError(err.message);
    } finally {
      setBuscando(false);
    }
  };

  const elegirResultado = (cancion) => {
    const yaEsta = idsEnFiesta.get(cancion.id);
    if (yaEsta) {
      if (!yaEsta.miVoto) alternarVoto(yaEsta);
      else setMensaje('Esa ya la has votado 😉');
    } else {
      ejecutar(cancion.id, () => proponerCancion(fiesta.codigo, cancion, invitado), `✅ «${cancion.name}» añadida con tu voto.`);
    }
    setResultados([]);
    setBusqueda('');
  };

  return (
    <section className="portada-inicio">
      <div className="tarjeta-inicio card fiesta-tarjeta">
        <p className="texto-pequeno">🎉 {fiesta.nombre}</p>
        <h2 className="titulo-inicio">Hola, {invitado.nombre}</h2>
        <p className={`fiesta-votos-restantes ${quedan === 0 ? 'agotados' : ''}`}>
          {quedan > 0
            ? `Te quedan ${quedan} de ${fiesta.votos_por_persona} votos`
            : 'Has usado todos tus votos: toca uno tuyo para quitarlo y votar otra'}
        </p>

        <form className="botones-playlist" onSubmit={buscar}>
          <input
            className="widget-input"
            placeholder="Busca una canción para añadirla…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button type="submit" className="boton-playlist secundario" disabled={buscando || busqueda.trim().length < 2}>
            {buscando ? 'Buscando…' : 'Buscar'}
          </button>
        </form>

        {resultados.length > 0 && (
          <ul className="fiesta-resultados">
            {resultados.map((c) => {
              const yaEsta = idsEnFiesta.get(c.id);
              return (
                <li key={c.id}>
                  <button type="button" onClick={() => elegirResultado(c)} disabled={quedan === 0 && !yaEsta?.miVoto}>
                    {c.album?.images?.[0]?.url && <img src={c.album.images[0].url} alt="" className="resumen-foto" />}
                    <span className="fiesta-resultado-texto">
                      <strong>{c.name}</strong> · {c.artists.map((a) => a.name).join(', ')}
                    </span>
                    <span>{yaEsta ? (yaEsta.miVoto ? '✓' : '👍') : '➕'}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {mensaje && <p className="texto-estado-busqueda">{mensaje}</p>}
        {error && <p className="texto-error-busqueda">{error}</p>}

        <FiestaRanking items={lista} onVotar={alternarVoto} ocupadoId={ocupadoId} />
      </div>
    </section>
  );
}
