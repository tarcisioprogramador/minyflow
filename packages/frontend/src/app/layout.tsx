import type { Metadata } from 'next'
import './globals.css'
import { ToastContainer } from '@/components/Toast'

export const metadata: Metadata = {
  title: 'Minyflow - Automação de Mensagens',
  description: 'Plataforma de chatbots e automação de mensagens',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
