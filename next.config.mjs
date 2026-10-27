/** @type {import('next').NextConfig} */
const nextConfig = {
  // Spotify obliga a usar 127.0.0.1 (no localhost) como redirect en local,
  // y Next 16.4 bloquea los recursos de desarrollo desde otros orígenes
  allowedDevOrigins: ['127.0.0.1'],
};

export default nextConfig;
