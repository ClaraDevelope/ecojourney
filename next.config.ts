/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {} // Corregido para evitar el warning
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'maps.googleapis.com',
      'res.cloudinary.com'
    ]
  },

  pageExtensions: ['tsx', 'ts'] // 🔹 Asegura que detecte archivos .tsx y .ts
}

export default nextConfig
