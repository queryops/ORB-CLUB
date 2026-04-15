/** @type {import('next').NextConfig} */

// Nombre del repositorio en GitHub (case-sensitive).
// Ejemplo: repo "ORB-CLUB" → basePath "/ORB-CLUB"
// Si es la página raíz (username.github.io sin sub-ruta) → ""
const REPO_NAME = process.env.NEXT_PUBLIC_BASE_PATH ?? '/ORB-CLUB'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  // basePath prefija TODAS las rutas: páginas, imágenes next/image, _next/static/
  // NO usar assetPrefix junto con basePath — genera rutas dobles /ORB-CLUB//_next/
  basePath: REPO_NAME,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
