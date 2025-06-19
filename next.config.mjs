// next.config.mjs - CONFIGURAÇÃO MÍNIMA PWA

import NextPWA from 'next-pwa';

const withPWA = NextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  
  // ✅ CACHE MÍNIMO - PÁGINAS OFFLINE + API ECOGANHA
  runtimeCaching: [
    {
      // 🎯 PÁGINAS - Funciona offline após visita
      urlPattern: ({ request }) => request.destination === 'document',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'pages',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 dias
        },
      },
    },
    {
      // 🎯 API ECOGANHA - Cache com fallback offline
      urlPattern: /^https:\/\/api\.ecoganha\.com\.br\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'ecoganha-api',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 2 * 60 * 60, // 2 horas
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
  
  // ✅ PÁGINA OFFLINE
  fallbacks: {
    document: '/offline',
  },
});

export default withPWA({
  // suas outras configurações do Next.js, se existirem
});