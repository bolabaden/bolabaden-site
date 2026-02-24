import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { config } from '@/lib/config'

const inter = Inter({ subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: `${config.OWNER_NAME} | ${config.JOB_TITLE} & Platform Developer`,
  description: `${config.OWNER_NAME} — ${config.JOB_SUBTITLE}. ${config.BIO}`,
  keywords: ['infrastructure engineer', 'kubernetes', 'self-hosted', 'cloud platforms', 'backend engineer', 'remote work', 'terraform', 'oracle cloud', 'docker', 'devops'],
  authors: [{ name: config.OWNER_NAME, url: config.SITE_URL }],
  creator: config.OWNER_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: config.SITE_URL,
    title: `${config.OWNER_NAME} — ${config.JOB_TITLE}`,
    description: 'Infrastructure automation, self-hosted services, and open-source tools — demos and code on GitHub.',
    siteName: `${config.OWNER_NAME} Portfolio`,
    images: [
      {
        url: '/images/og-preview.png',
        width: 1200,
        height: 630,
        alt: `${config.OWNER_NAME} — ${config.JOB_TITLE} Portfolio`
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.OWNER_NAME} — ${config.JOB_TITLE}`,
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
  metadataBase: new URL(config.SITE_URL),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.OWNER_NAME,
    jobTitle: config.JOB_TITLE,
    url: config.SITE_URL,
    sameAs: [
      config.GITHUB_URL,
      config.LINKEDIN_URL,
    ],
    knowsAbout: ['Kubernetes', 'Terraform', 'Docker', 'Oracle Cloud', 'Infrastructure as Code', 'Backend Development'],
    description: `${config.JOB_SUBTITLE} specializing in production-grade systems, Kubernetes orchestration, and cloud infrastructure automation.`
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