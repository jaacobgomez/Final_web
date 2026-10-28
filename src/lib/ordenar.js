// Formas de ordenar la lista. Todas devuelven una copia.

export function barajarLista(tracks) {
  const copia = [...tracks];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

const anio = (track) => parseInt(track.album?.release_date?.slice(0, 4), 10) || 9999;

// De la más antigua a la más reciente (las que no tienen fecha, al final)
export function ordenarPorAnio(tracks) {
  return [...tracks].sort((a, b) => anio(a) - anio(b));
}

// Que no suenen dos seguidas del mismo artista mientras se pueda evitar:
// en cada paso, la siguiente del artista con más canciones pendientes
export function alternarArtistas(tracks) {
  const porArtista = new Map();
  for (const track of tracks) {
    const id = track.artists?.[0]?.id || track.id;
    if (!porArtista.has(id)) porArtista.set(id, []);
    porArtista.get(id).push(track);
  }

  const resultado = [];
  let anterior = null;
  while (resultado.length < tracks.length) {
    const candidatos = [...porArtista.entries()]
      .filter(([id, lista]) => lista.length > 0 && id !== anterior)
      .sort((a, b) => b[1].length - a[1].length);
    // Si solo queda el mismo artista, no hay más remedio que repetir
    const [id, lista] = candidatos[0] || [...porArtista.entries()].find(([, l]) => l.length > 0);
    resultado.push(lista.shift());
    anterior = id;
  }
  return resultado;
}
