/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {} // Corregido para evitar el warning
  }
}

export default nextConfig
