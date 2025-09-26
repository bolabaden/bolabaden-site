import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Boden Crouch | Self-Taught Infrastructure Engineer',
  description: 'Professional portfolio showcasing expertise in self-hosted infrastructure, Kubernetes, cloud platforms, and backend development. Available for remote work.',
  keywords: ['infrastructure engineer', 'kubernetes', 'self-hosted', 'cloud platforms', 'backend engineer', 'remote work'],
  authors: [{ name: 'Boden Crouch' }],
  creator: 'Boden Crouch',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bolabaden.org',
    title: 'Boden Crouch | Self-Taught Infrastructure Engineer',
    description: 'Professional portfolio showcasing expertise in self-hosted infrastructure, Kubernetes, cloud platforms, and backend development.',
    siteName: 'Boden Crouch Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boden Crouch | Self-Taught Infrastructure Engineer',
    description: 'Professional portfolio showcasing expertise in self-hosted infrastructure, Kubernetes, cloud platforms, and backend development.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://bolabaden.org'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
} 