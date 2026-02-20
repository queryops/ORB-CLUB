import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ArtistsSection } from "@/components/artists-section"
import { EventsSection } from "@/components/events-section"
import { VenueSection } from "@/components/venue-section"
import { ManifestoSection } from "@/components/manifesto-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <div className="relative">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage: "url('/images/cosmic-pillars.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10">
          <ArtistsSection />
          <EventsSection />
          <VenueSection />
          <ManifestoSection />
        </div>
      </div>
      <Footer />
    </main>
  )
}
