import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'gerenciador-de-velidades',
  description: 'Criado com Next.js e PWA',
  // Adicione as tags do manifest aqui
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#000000', // A linha 'themeColor' foi MOVIDA para cá.
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
