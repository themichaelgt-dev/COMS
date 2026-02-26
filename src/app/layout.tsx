import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { StoreProvider } from '@/context/StoreContext'
import { Toaster } from '@/components/ui/sonner'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'COMS — Community Outreach Management System',
  description: 'Community outreach and mass communication tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-mono bg-background text-foreground antialiased`} style={{ fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }}>
        <AuthProvider>
          <StoreProvider>
            {children}
            <Toaster position="top-right" />
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
