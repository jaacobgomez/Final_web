/* eslint-disable @next/next/no-img-element */
"use client";

// Lista de la fiesta ordenada por votos (la usan invitados y anfitrión)
export default function FiestaRanking({ items, onVotar, ocupadoId, anfitrion = false, onQuitar, encoladas = [] }) {
  if (items.length === 0) {
    return (
      <p className="lista-vacia">
        Aún no hay canciones. {anfitrion ? "Espera a que voten tus invitados." : "¡Busca una y sé el primero!"}
      </p>
    );
  }

  return (
    <ol className="fiesta-lista">
      {items.map((item, posicion) => {
        const c = item.datos;
        const imagen = c.album?.images?.[0]?.url;
        const enCola = encoladas.includes(item.track_id);
        return (
          <li key={item.id} className={`fiesta-fila ${item.miVoto ? "fiesta-fila-votada" : ""}`}>
            <span className="fiesta-posicion">{posicion + 1}</span>
            {imagen ? (
              <img src={imagen} alt="" className="track-card-imagen fiesta-imagen" />
            ) : (
              <span className="track-card-imagen track-card-sin-imagen fiesta-imagen">♫</span>
            )}
            <div className="track-card-info">
              <span className="track-card-nombre">
                {c.explicit && <span className="etiqueta-explicita">E</span>}
                {c.name}
              </span>
              <span className="track-card-artista">
                {c.artists?.map((a) => a.name).join(", ")}
                {item.propuesta_por ? ` · la trajo ${item.propuesta_por}` : ""}
                {enCola ? " · ✓ en la cola" : ""}
              </span>
              {item.votantes.length > 0 && (
                <span className="fiesta-votantes">
                  {item.votantes.slice(0, 3).join(", ")}
                  {item.votantes.length > 3 ? ` y ${item.votantes.length - 3} más` : ""}
                </span>
              )}
            </div>

            {anfitrion ? (
              <>
                <span className="fiesta-contador">🔥 {item.votos}</span>
                <button
                  type="button"
                  className="track-card-mas"
                  onClick={() => onQuitar(item)}
                  aria-label={`Quitar ${c.name} de la fiesta`}
                >
                  ✕
                </button>
              </>
            ) : (
              <button
                type="button"
                className={`fiesta-voto ${item.miVoto ? "fiesta-voto-activo" : ""}`}
                onClick={() => onVotar(item)}
                disabled={ocupadoId === item.id}
                aria-label={item.miVoto ? `Quitar mi voto a ${c.name}` : `Votar ${c.name}`}
              >
                👍 {item.votos}
              </button>
            )}
          </li>
        );
      })}
    </ol>
  );
}
