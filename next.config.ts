/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {} // Corregido para evitar el warning
  },
  images: {
    domains: ['lh3.googleusercontent.com'] // 👈 Permite imágenes desde Google
  }
}

export default nextConfig
