"use client";

// Artistas que no quieres que salgan nunca (se vetan con 🚫 desde la playlist)
export default function VetadosWidget({ vetados, onQuitar }) {
  if (vetados.length === 0) return null;

  return (
    <div className="card widget-canciones">
      <h3 className="widget-titulo">🚫 Artistas vetados</h3>
      <p className="widget-texto">
        No saldrán al generar, al añadir más, al cambiar canciones ni en la mezcla de grupo.
      </p>
      <div className="chips-artistas">
        {vetados.map((artista) => (
          <span key={artista.id} className="chip-filtro">
            {artista.name}
            <button
              type="button"
              onClick={() => onQuitar(artista.id)}
              aria-label={`Quitar el veto a ${artista.name}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
