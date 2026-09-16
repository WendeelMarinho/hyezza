import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Site 100% estatico: `npm run build` gera a pasta out/, servivel por qualquer nginx/caddy.
  output: 'export',
  // As imagens ja sao otimizadas por `npm run images` (WebP responsivo).
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
}

export default nextConfig
