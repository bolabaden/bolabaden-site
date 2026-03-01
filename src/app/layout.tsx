import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { config } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: `${config.SITE_NAME} | ${config.SITE_SECTION_LABEL}`,
  description: config.SITE_META_DESCRIPTION,
  keywords: config.SITE_META_KEYWORDS,
  authors: [{ name: config.SITE_NAME, url: config.SITE_URL }],
  creator: config.SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.SITE_URL,
    title: `${config.SITE_NAME} — ${config.SITE_SECTION_LABEL}`,
    description: config.SITE_OG_DESCRIPTION,
    siteName: config.SITE_NAME,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${config.SITE_NAME} home preview`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${config.SITE_NAME} — ${config.SITE_SECTION_LABEL}`,
    description: config.SITE_OG_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },
  metadataBase: new URL(config.SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.SITE_NAME,
    url: config.SITE_URL,
    description: config.SITE_JSONLD_DESCRIPTION,
  };

  return (
    <html lang={config.HTML_LANG} className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.className} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
