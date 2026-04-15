/** @type {import('next').NextConfig} */

// Nombre exacto del repositorio en GitHub (case-sensitive)
// Si el repo se llama "ORB-CLUB", el basePath es "/ORB-CLUB"
// Si es la página raíz (usuario.github.io sin subruta), déjalo en ""
const REPO_NAME = process.env.NEXT_PUBLIC_BASE_PATH ?? '/ORB-CLUB'

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: REPO_NAME,
  assetPrefix: REPO_NAME + '/',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
