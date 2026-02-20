"use client"

import { useState } from "react"
import Image from "next/image"
import { Instagram, Music, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

const artists = [
    {
    id: 1,
    name: "JABERTH",
    discipline: "PRODUCTOR MUSICAL",
    image: "/male-visual-artist-with-projections-dark-urban-set.jpg",
    description: "Instalaciones que transforman el espacio en experiencia.",
    social: { instagram: "https://www.instagram.com/jaberth_?igsh=NThuaGZlZHhheTBx", website: "https://youtube.com/@orbmusic-pk9ii?si=DsXFButiyBEmsvz0" },
  },
  {
    id: 2,
    name: "RAFA",
    discipline: "ARTISTA",
    image: "/musician-producer-in-dark-studio-with-ambient-ligh.jpg",
    description: "REGGAETON - AFROBEAT - DANCEHALL.",
    social: { instagram: "https://www.instagram.com/rafa.orb?igsh=MXF2N2dwem15YzdyeA==", spotify: "https://open.spotify.com/artist/6Bl6scWVQQ8F14lHmZ8Bqo?si=yPie65mFQF-Yf8OAQGFv7A", youtube: "https://youtube.com/@orbmusic-pk9ii?si=DsXFButiyBEmsvz0" },
  },

  {
    id: 3,
    name: "JHOEL D.",
    discipline: "ARTISTA",
    image: "/performance-artists-with-neon-lights-dramatic-dark.jpg",
    description: "HIP-HOP - AFROBEAT - DANCEHALL.",
    social: { instagram: "https://www.instagram.com/jhoel_d_oficial?igsh=MTFvNXlybnppdmkyMg==", youtube: "https://youtube.com/@orbmusic-pk9ii?si=DsXFButiyBEmsvz0", spotify: "https://open.spotify.com/artist/6Bl6scWVQQ8F14lHmZ8Bqo?si=yPie65mFQF-Yf8OAQGFv7A" },
  },
  {
    id: 4,
    name: "MAC",
    discipline: "ARTISTA",
    image: "/musician-producer-in-dark-studio-with-ambient-ligh.jpg",
    description: "HIP-HOP - AFROBEAT - DANCEHALL.",
    social: { instagram: "https://www.instagram.com/mac_oficial07?igsh=MWV4eTZvbDA3OWM3cA==", spotify: "https://open.spotify.com/artist/6Bl6scWVQQ8F14lHmZ8Bqo?si=yPie65mFQF-Yf8OAQGFv7A", youtube: "https://youtube.com/@orbmusic-pk9ii?si=DsXFButiyBEmsvz0" },
  },
  
  {
    id: 5,
    name: "TEBAN VISUAL",
    discipline: "DJ / Productor / Manager",
    image: "/female-dj-with-headphones-in-dark-club-lighting-bl.jpg",
    description: "Sonidos electrónicos que fusionan lo orgánico con lo digital.",
    social: { instagram: "https://www.instagram.com/tebanvisual?igsh=c2k0ODd1OGM4c3hj", website: "https://youtube.com/@orbmusic-pk9ii?si=DsXFButiyBEmsvz0"},
  },
  {
    id: 6,
    name: "CAM-PHOTOS",
    discipline: "FOTOGRAFA",
    image: "/musician-producer-in-dark-studio-with-ambient-ligh.jpg",
    description: "FOTOGRAFIA PROFESIONAL.",
    social: { instagram: "https://www.instagram.com/cami.garcia2501?igsh=MXg3cG9ub3pnazE2cQ==" },
  },
  {
    id: 7,
    name: "QueryOps",
    discipline: "DISEÑO - DESARROLLO WEB",
    image: "/musician-producer-in-dark-studio-with-ambient-ligh.jpg",
    description: "Diseño web y desarrollo de aplicaciones digitales.",
    social: { instagram: "https://www.instagram.com/queryops?igsh=MTV0c251YjJ0cG9yZw==" },
  },
]

export function ArtistsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="artistas" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">Talento Emergente</p>
            <h2 className="font-serif text-4xl md:text-6xl text-foreground">Artistas</h2>
          </div>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            Descubre a los creadores que están definiendo el sonido y la estética de una nueva generación.
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="group relative overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredId(artist.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image Container */}
              <div className="relative aspect-[2/3] overflow-hidden bg-background/70 backdrop-blur-md border border-primary/20">
                <Image
                  src={artist.image || "/placeholder.svg"}
                  alt={artist.name}
                  fill
                  className={cn(
                    "object-cover transition-all duration-700",
                    hoveredId === artist.id ? "scale-110" : "scale-100",
                  )}
                />
                {/* Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent transition-opacity duration-500",
                    hoveredId === artist.id ? "opacity-90" : "opacity-60",
                  )}
                />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs uppercase tracking-widest text-primary mb-2">{artist.discipline}</p>
                <h3 className="font-serif text-2xl text-foreground mb-2">{artist.name}</h3>
                <p
                  className={cn(
                    "text-sm text-muted-foreground transition-all duration-500 overflow-hidden",
                    hoveredId === artist.id ? "max-h-20 opacity-100" : "max-h-0 opacity-0",
                  )}
                >
                  {artist.description}
                </p>

                {/* Social Links */}
                <div
                  className={cn(
                    "flex gap-4 mt-4 transition-all duration-500",
                    hoveredId === artist.id ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                  )}
                >
                  {artist.social.instagram && (
                    <a
                      href={artist.social.instagram}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {artist.social.spotify && (
                    <a
                      href={artist.social.spotify}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Music className="w-5 h-5" />
                    </a>
                  )}
                  {artist.social.website && (
                    <a
                      href={artist.social.website}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Border accent */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-1 bg-primary transition-all duration-500",
                  hoveredId === artist.id ? "opacity-100" : "opacity-0",
                )}
              />
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
          >
            Ver todos los artistas
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  )
}
