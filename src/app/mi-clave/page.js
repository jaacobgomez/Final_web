'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  esClientIdValido,
  getSpotifyAuthUrl,
  quitarClientIdPropio,
  setClientIdPropio,
} from '@/lib/auth';
import { useClientIdPropio } from '@/lib/useSesion';

// Para quien no está en la lista de 5 usuarios de la app compartida:
// crea su propia app de Spotify (gratis) y usa aquí su Client ID con PKCE.
export default function PaginaMiClave() {
  const clientIdGuardado = useClientIdPropio();
  const [clientId, setClientId] = useState('');
  const [error, setError] = useState('');
  const [copiado, setCopiado] = useState(false);

  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || '';

  const copiarRedirect = async () => {
    try {
      await navigator.clipboard.writeText(redirectUri);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  };

  const guardarYEntrar = async () => {
    if (!esClientIdValido(clientId)) {
      setError('Eso no parece un Client ID: son 32 letras y números (sin espacios).');
      return;
    }
    setClientIdPropio(clientId);
    window.location.href = await getSpotifyAuthUrl();
  };

  return (
    <section className="portada-inicio">
      <div className="tarjeta-inicio card">
        <p className="texto-pequeno">Acceso con tu propia clave</p>
        <h2 className="titulo-inicio">Usa tu propia app de Spotify</h2>

        {clientIdGuardado ? (
          <>
            <p className="texto-descripcion">
              ✅ Este dispositivo usa tu propia clave (…{clientIdGuardado.slice(-6)}).
            </p>
            <Link href="/" className="boton-inicio">Volver al inicio</Link>
            <p className="nota-inicio">
              <button type="button" className="boton-info-decadas" onClick={quitarClientIdPropio}>
                Dejar de usar mi clave
              </button>
            </p>
          </>
        ) : (
          <>
            <p className="texto-descripcion">
              Spotify solo deja usar la app a 5 personas. Si no estás entre ellas,
              puedes crear gratis tu propia &quot;app&quot; de Spotify en 5 minutos y
              entrar con ella. Necesitas <strong>Spotify Premium</strong>.
            </p>

            <ol className="lista-caracteristicas">
              <li>
                1. Entra en{' '}
                <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer">
                  developer.spotify.com/dashboard
                </a>{' '}
                con tu cuenta de Spotify y acepta los términos.
              </li>
              <li>2. Pulsa <strong>Create app</strong>. Nombre y descripción: lo que quieras.</li>
              <li>
                3. En <strong>Redirect URIs</strong> pega esto y pulsa <strong>Add</strong>:
                <br />
                <code>{redirectUri}</code>{' '}
                <button type="button" className="boton-info-decadas" onClick={copiarRedirect}>
                  {copiado ? '¡Copiado!' : 'Copiar'}
                </button>
              </li>
              <li>4. Marca <strong>Web API</strong>, acepta los términos y pulsa <strong>Save</strong>.</li>
              <li>
                5. Copia el <strong>Client ID</strong> de tu app (¡el <em>secret</em> no, ese no
                se lo des a nadie) y pégalo aquí:
              </li>
            </ol>

            <input
              type="text"
              className="widget-input"
              placeholder="Client ID (32 caracteres)"
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setError('');
              }}
            />
            {error && <p className="texto-error-busqueda">{error}</p>}

            <button type="button" className="boton-inicio" onClick={guardarYEntrar}>
              Guardar e iniciar sesión
            </button>

            <p className="nota-inicio">
              Tu Client ID se guarda solo en este dispositivo. Si al generar te sale un
              error de acceso, añade tu correo de Spotify en la pestaña{' '}
              <strong>User Management</strong> de tu app.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
