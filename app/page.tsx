import type { Metadata } from "next"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ArtistsSection } from "@/components/artists-section"
import { EventsSection } from "@/components/events-section"
import { VenueSection } from "@/components/venue-section"
import { ServicesSection } from "@/components/services-section"
import { ManifestoSection } from "@/components/manifesto-section"
import { FaqSection } from "@/components/faq-section"
import { FloatingButtons } from "@/components/floating-buttons"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "ORB Club Social | Donde el Arte Cobra Vida — Zipaquirá",
  description:
    "Club social para artistas emergentes en Zipaquirá. Eventos de hip-hop, freestyle y música en vivo. Compra tu boleta online vía WhatsApp. Carrera 16 # 14-53.",
  alternates: {
    canonical: "https://queryops.github.io",
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["NightClub", "MusicVenue"],
      "@id": "https://queryops.github.io/#venue",
      name: "ORB Club Social",
      description:
        "Club social para artistas emergentes en Zipaquirá. Donde el arte, la comunidad y la sofisticación convergen.",
      url: "https://queryops.github.io",
      telephone: "+573106081378",
      email: "ORBCLUB@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Carrera 16 # 14-53",
        addressLocality: "Zipaquirá",
        addressRegion: "Cundinamarca",
        addressCountry: "CO",
        postalCode: "250251",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 5.0245,
        longitude: -74.0045,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Friday", "Saturday"],
          opens: "18:00",
          closes: "03:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Sunday"],
          opens: "14:00",
          closes: "22:00",
        },
      ],
      sameAs: [
        "https://www.instagram.com/orb_clubsocial",
        "https://www.instagram.com/orb.music00",
        "https://open.spotify.com/artist/6Bl6scWVQQ8F14lHmZ8Bqo",
        "https://youtube.com/@orbmusic-pk9ii",
      ],
      image: "https://queryops.github.io/og-image.jpg",
      priceRange: "$$",
      currenciesAccepted: "COP",
      paymentAccepted: "Cash, Transfer",
    },
    {
      "@type": "Organization",
      "@id": "https://queryops.github.io/#org",
      name: "ORB Club Social",
      url: "https://queryops.github.io",
      logo: {
        "@type": "ImageObject",
        url: "https://queryops.github.io/icon.svg",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+573106081378",
        contactType: "customer service",
        availableLanguage: "Spanish",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://queryops.github.io/#website",
      url: "https://queryops.github.io",
      name: "ORB Club Social",
      description: "Club social para artistas emergentes — Zipaquirá, Cundinamarca",
      inLanguage: "es-CO",
    },
  ],
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <ArtistsSection />
        <EventsSection />
        <VenueSection />
        <ServicesSection />
        <ManifestoSection />
        <FaqSection />
        <Footer />
      </main>
      <FloatingButtons />
    </>
  )
}
