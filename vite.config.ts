import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'JEE Edge — CBT Practice',
        short_name: 'JEE Edge',
        description: 'Offline-first JEE Main CBT practice with 2,340 original questions.',
        theme_color: '#070b16',
        background_color: '#070b16',
        display: 'standalone',
        orientation: 'any',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,woff2}'],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /\/pdfs\/.*\.pdf$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jee-edge-pdfs',
              expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/vendor\/.*\.mjs$/,
            handler: 'CacheFirst',
            options: { cacheName: 'jee-edge-pdfjs', expiration: { maxEntries: 8 } },
          },
        ],
      },
    }),
  ],
  build: { chunkSizeWarningLimit: 2500 },
});
