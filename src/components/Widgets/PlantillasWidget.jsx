"use client";

// Plantillas rápidas: ponen modo, géneros y duración de un toque y generan.
// Los géneros tienen que estar en la lista de GenreWidget.
export const PLANTILLAS = [
  {
    clave: "estudiar",
    etiqueta: "📚 Para estudiar",
    generos: ["classical", "ambient", "chill"],
    modo: "equilibrado",
    objetivo: { tipo: "minutos", valor: 120 },
    usarMiGusto: false,
  },
  {
    clave: "gimnasio",
    etiqueta: "🏋️ Gimnasio",
    generos: ["edm", "hip-hop", "reggaeton"],
    modo: "conocidas",
    objetivo: { tipo: "minutos", valor: 60 },
    usarMiGusto: false,
  },
  {
    clave: "coche",
    etiqueta: "🚗 Viaje en coche",
    generos: ["pop", "rock"],
    modo: "conocidas",
    objetivo: { tipo: "minutos", valor: 120 },
    usarMiGusto: true,
  },
  {
    clave: "cena",
    etiqueta: "🍷 Cena tranquila",
    generos: ["jazz", "soul", "acoustic"],
    modo: "equilibrado",
    objetivo: { tipo: "minutos", valor: 90 },
    usarMiGusto: false,
  },
  {
    clave: "fiesta",
    etiqueta: "🎉 Fiesta",
    generos: ["reggaeton", "dance", "latin"],
    modo: "conocidas",
    objetivo: { tipo: "minutos", valor: 90 },
    usarMiGusto: false,
  },
];

export default function PlantillasWidget({ onElegir, cargando }) {
  return (
    <div className="card widget-canciones">
      <h3 className="widget-titulo">⚡ Plantillas rápidas</h3>
      <p className="widget-texto">
        Un toque y listo: pone los filtros por ti y genera la playlist. Luego puedes retocarla.
      </p>
      <div className="lista-decadas">
        {PLANTILLAS.map((plantilla) => (
          <button
            key={plantilla.clave}
            type="button"
            className="boton-decada"
            disabled={cargando}
            onClick={() => onElegir(plantilla)}
          >
            {plantilla.etiqueta}
          </button>
        ))}
      </div>
    </div>
  );
}
