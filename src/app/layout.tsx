// src/app/layout.tsx (Server Component)
// import { ClientLayout } from '../components/ClientLayout';
// import './globals.css';

// export const metadata = {
//   title: 'EcoGanha - São João de Caruaru',
//   description: 'Transforme lixo em luxo com nossos eco-descontos',
//   manifest: '/manifest.json',
//   themeColor: '#003F25',
//   viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: 'black-translucent',
//     title: 'EcoGanha',
//   },
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="pt-BR">
//       <body>
//         <ClientLayout>{children}</ClientLayout>
//       </body>
//     </html>
//   )
// }


// src/app/layout.tsx (Server Component)
import { ClientLayout } from '../components/ClientLayout';
import './globals.css';

export const metadata = {
  title: 'EcoGanha - São João de Caruaru',
  description: 'Transforme lixo em luxo com nossos eco-descontos no São João de Caruaru',
  manifest: '/manifest.json',
  themeColor: '#003F25',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  
  // Open Graph para WhatsApp/Facebook
  openGraph: {
    title: 'EcoGanha - São João de Caruaru',
    description: 'Transforme lixo em luxo com nossos eco-descontos no São João de Caruaru',
    url: 'https://www.ecoganha.com.br',
    siteName: 'EcoGanha',
    images: [
      {
        url: 'https://www.ecoganha.com.br/icons/icon-512x512.png', 
        width: 1200,
        height: 630,
        alt: 'EcoGanha - São João de Caruaru',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'EcoGanha - São João de Caruaru',
    description: 'Transforme lixo em luxo com nossos eco-descontos no São João de Caruaru',
    images: ['https://www.ecoganha.com.br/icons/icon-512x512.png'],
  },

  // Substitua appleWebApp por outras tags
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'EcoGanha',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}