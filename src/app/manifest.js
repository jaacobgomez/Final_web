// Manifiesto PWA: permite "Añadir a pantalla de inicio" en iPhone y Android
export default function manifest() {
  return {
    name: 'Spotify Taste Mixer',
    short_name: 'Taste Mixer',
    description: 'Crea playlists mezclando tus artistas, géneros y épocas favoritas.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#121212',
    theme_color: '#121212',
    lang: 'es',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
