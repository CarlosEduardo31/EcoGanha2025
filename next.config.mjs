// next.config.mjs - CONFIGURAÇÃO MÍNIMA PWA

import NextPWA from 'next-pwa';

const withPWA = NextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

export default withPWA({
  // suas outras configurações do Next.js, se existirem
});
