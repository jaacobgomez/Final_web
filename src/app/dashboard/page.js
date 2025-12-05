'use client';

import { useEffect, useState } from 'react';
import { getRandomSpotifyImage } from '@/lib/spotify';

export default function DashboardPage() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getRandomSpotifyImage()
      .then(setImage)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  return (
    <div>
      <h1>Estamos en el Dashboard</h1>
      {/* Contenido del dashboard */}
      {error && (
        <p className="text-red-500 mb-4">
          Error: {error}
        </p>
      )}
      {image && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">
            {image.name} — {image.artist}
          </p>
          <img src={image.url} alt={image.name}/>
        </div>
      )}
    </div>
  );
}