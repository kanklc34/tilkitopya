import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages proje sitesi olarak yayınlanacağı için (kullanıcı.github.io
// yerine kullanıcı.github.io/tilkitopya/ şeklinde), base yolu repo adıyla
// eşleşmeli. Repo adı değişirse burası da güncellenmeli.
const BASE_PATH = '/tilkitopya/'

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png', 'icon-maskable-512.png'],
      manifest: {
        id: BASE_PATH,
        name: 'Tilkitopya - İlkokul Platformu',
        short_name: 'Tilkitopya',
        description: '1. sınıf çocuklar için oyunla öğrenen eğitim platformu',
        start_url: BASE_PATH,
        scope: BASE_PATH,
        display: 'standalone',
        background_color: '#EAF6FD',
        theme_color: '#FFC93C',
        lang: 'tr',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,json}'],
      },
    }),
  ],
})
