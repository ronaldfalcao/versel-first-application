import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Diário Perdido',
    short_name: 'Diário Perdido',
    lang: 'pt-BR',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF7F2',
    theme_color: '#2B2660',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any', purpose: 'any' },
      { src: '/icon-192.png', type: 'image/png', sizes: '192x192', purpose: 'maskable' },
      { src: '/icon-512.png', type: 'image/png', sizes: '512x512', purpose: 'maskable' },
    ],
  }
}
