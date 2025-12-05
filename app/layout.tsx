import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Boden Crouch | Infrastructure Engineer & Platform Developer',
  description: 'Boden Crouch — self-taught infrastructure engineer. I design, deploy, and maintain production-grade systems (Kubernetes, Terraform, Oracle Cloud). Open to remote roles.',
  keywords: ['infrastructure engineer', 'kubernetes', 'self-hosted', 'cloud platforms', 'backend engineer', 'remote work', 'terraform', 'oracle cloud', 'docker', 'devops'],
  authors: [{ name: 'Boden Crouch', url: 'https://bolabaden.org' }],
  creator: 'Boden Crouch',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bolabaden.org',
    title: 'Boden Crouch — Infrastructure Engineer',
    description: 'Infrastructure automation, self-hosted services, and open-source tools — demos and code on GitHub.',
    siteName: 'Boden Crouch Portfolio',
    images: [
      {
        url: '/images/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'Boden Crouch — Infrastructure Engineer Portfolio'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boden Crouch — Infrastructure Engineer',
    description: 'Infrastructure automation, self-hosted services, and open-source tools — demos and code on GitHub.',
    images: ['/images/og-preview.png'],
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/images/apple-touch-icon.png',
  },
  metadataBase: new URL('https://bolabaden.org'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Boden Crouch',
    jobTitle: 'Infrastructure Engineer',
    url: 'https://bolabaden.org',
    sameAs: [
      'https://github.com/bolabaden',
      'https://linkedin.com/in/boden-crouch-555897193/'
    ],
    knowsAbout: ['Kubernetes', 'Terraform', 'Docker', 'Oracle Cloud', 'Infrastructure as Code', 'Backend Development'],
    description: 'Self-taught infrastructure engineer specializing in production-grade systems, Kubernetes orchestration, and cloud infrastructure automation.'
  }

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
} 