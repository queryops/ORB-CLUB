import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ArtistsSection } from "@/components/artists-section"
import { EventsSection } from "@/components/events-section"
import { VenueSection } from "@/components/venue-section"
import { ServicesSection } from "@/components/services-section"
import { ManifestoSection } from "@/components/manifesto-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ArtistsSection />
      <EventsSection />
      <VenueSection />
      <ServicesSection />
      <ManifestoSection />
      <Footer />
    </main>
  )
}
