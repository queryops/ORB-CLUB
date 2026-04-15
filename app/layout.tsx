import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const siteUrl = "https://orbclubsocial.github.io"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ORB Club Social | Club para Artistas Emergentes — Zipaquirá",
    template: "%s | ORB Club Social",
  },
  description:
    "ORB Club Social: espacio cultural en Zipaquirá donde artistas emergentes encuentran su escenario. Hip-hop, música en vivo, freestyle, eventos y boletería online.",
  keywords: [
    "ORB Club Social", "club social Zipaquirá", "artistas emergentes Colombia",
    "hip-hop Zipaquirá", "eventos musicales Cundinamarca", "música en vivo Zipaquirá",
    "freestyle Zipaquirá", "rap Colombia", "conciertos Zipaquirá",
    "eventos culturales Cundinamarca", "boletería eventos Colombia",
  ],
  authors: [{ name: "ORB Club Social", url: siteUrl }],
  creator: "ORB Club Social",
  publisher: "ORB Club Social",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteUrl,
    siteName: "ORB Club Social",
    title: "ORB Club Social | Donde el Arte Cobra Vida — Zipaquirá",
    description: "Club social para artistas emergentes en Zipaquirá. Hip-hop, freestyle, música en vivo y eventos culturales.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "ORB Club Social — Zipaquirá" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ORB Club Social | Club para Artistas Emergentes",
    description: "El espacio cultural en Zipaquirá donde los artistas emergentes encuentran su escenario.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: siteUrl },
  category: "entertainment",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Fuentes via CDN — evita self-hosting issues con static export */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* SEO & PWA */}
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="color-scheme" content="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* Geo tags para SEO local */}
        <meta name="geo.region" content="CO-CUN" />
        <meta name="geo.placename" content="Zipaquirá, Cundinamarca, Colombia" />
        <meta name="geo.position" content="5.0245;-74.0045" />
        <meta name="ICBM" content="5.0245, -74.0045" />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
