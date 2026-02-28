"use client"

import { useState } from "react"
import Image from "next/image"
import { Music, ExternalLink } from "lucide-react"

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  )
}
import { cn } from "@/lib/utils"

type ArtistSocial = {
  instagram?: string
  spotify?: string
  youtube?: string
  website?: string
}

type Artist = {
  id: number
  name: string
  discipline: string
  photo: string
  image: string
  description: string
  social: ArtistSocial
}

const artists: Artist[] = [
  {
    id: 1,
    name: "RAFA",
    discipline: "ARTISTA",
    photo: "/artistas/RAFA.jpeg",
    image: "/RAFA.png",
    description: "REGGAETON · AFROBEAT · DANCEHALL",
    social: {
      instagram: "https://www.instagram.com/rafa.orb?igsh=MXF2N2dwem15YzdyeA==",
      spotify: "https://open.spotify.com/artist/6Bl6scWVQQ8F14lHmZ8Bqo?si=yPie65mFQF-Yf8OAQGFv7A",
      youtube: "https://youtube.com/@orbmusic-pk9ii?si=DsXFButiyBEmsvz0",
    },
  },
  {
    id: 2,
    name: "JHOEL D.",
    discipline: "ARTISTA",
    photo: "/artistas/JHOELD.jpeg",
    image: "/performance-artists-with-neon-lights-dramatic-dark.png",
    description: "HIP-HOP · AFROBEAT · DANCEHALL",
    social: {
      instagram: "https://www.instagram.com/jhoel_d_oficial?igsh=MTFvNXlybnppdmkyMg==",
      spotify: "https://open.spotify.com/artist/6Bl6scWVQQ8F14lHmZ8Bqo?si=yPie65mFQF-Yf8OAQGFv7A",
      youtube: "https://youtube.com/@orbmusic-pk9ii?si=DsXFButiyBEmsvz0",
    },
  },
  {
    id: 3,
    name: "MAC",
    discipline: "ARTISTA",
    photo: "/artistas/MAC.jpeg",
    image: "/musician-producer-in-dark-studio-with-ambient-ligh.png",
    description: "HIP-HOP · AFROBEAT · DANCEHALL",
    social: {
      instagram: "https://www.instagram.com/mac_oficial07?igsh=MWV4eTZvbDA3OWM3cA==",
      spotify: "https://open.spotify.com/artist/6Bl6scWVQQ8F14lHmZ8Bqo?si=yPie65mFQF-Yf8OAQGFv7A",
      youtube: "https://youtube.com/@orbmusic-pk9ii?si=DsXFButiyBEmsvz0",
    },
  },
  {
    id: 4,
    name: "TEBAN VISUAL",
    discipline: "DJ · PRODUCTOR · MANAGER",
    photo: "/artistas/TEBAN-VISUAL.jpg",
    image: "/female-dj-with-headphones-in-dark-club-lighting-bl.png",
    description: "Sonidos electrónicos que fusionan lo orgánico con lo digital.",
    social: {
      instagram: "https://www.instagram.com/tebanvisual?igsh=c2k0ODd1OGM4c3hj",
      youtube: "https://youtube.com/@orbmusic-pk9ii?si=DsXFButiyBEmsvz0",
    },
  },
  {
    id: 5,
    name: "JABERTH",
    discipline: "PRODUCTOR MUSICAL",
    photo: "/artistas/JABERTH.jpg",
    image: "/male-visual-artist-with-projections-dark-urban-set.png",
    description: "Instalaciones que transforman el espacio en experiencia.",
    social: {
      instagram: "https://www.instagram.com/jaberth_?igsh=NThuaGZlZHhheTBx",
      youtube: "https://youtube.com/@orbmusic-pk9ii?si=DsXFButiyBEmsvz0",
    },
  },
  {
    id: 6,
    name: "CAM-PHOTOS",
    discipline: "FOTÓGRAFA",
    photo: "/artistas/CAM-PHOTOS.jpg",
    image: "/CAM.png",
    description: "Fotografía profesional. Capturando momentos que definen la escena.",
    social: {
      instagram: "https://www.instagram.com/cami.garcia2501?igsh=MXg3cG9ub3pnazE2cQ==",
    },
  },
  {
    id: 7,
    name: "QueryOps",
    discipline: "DISEÑO · DESARROLLO WEB",
    photo: "/artistas/QueryOPS.jpg",
    image: "/musician-producer-in-dark-studio-with-ambient-ligh.png",
    description: "Diseño web y desarrollo de aplicaciones digitales.",
    social: {
      instagram: "https://www.instagram.com/queryops?igsh=MTV0c251YjJ0cG9yZw==",
    },
  },
]

export function ArtistsSection() {
  const [activeId, setActiveId] = useState<number | null>(null)

  return (
    <section id="artistas" className="py-16 md:py-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-16 gap-3 md:gap-6">
          <div>
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary mb-2 md:mb-4">
              Talento Emergente
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground">Artistas</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm md:max-w-md leading-relaxed">
            Descubre a los creadores que están definiendo el sonido y la estética de una nueva generación.
          </p>
        </div>

        {/* Artists Grid — 2 cols mobile, 3 tablet, 4 desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
          {artists.map((artist) => {
            const isActive = activeId === artist.id
            return (
              <div
                key={artist.id}
                className="group relative overflow-hidden cursor-pointer select-none"
                onMouseEnter={() => setActiveId(artist.id)}
                onMouseLeave={() => setActiveId(null)}
                onClick={() => setActiveId(isActive ? null : artist.id)}
              >
                {/* Main Artist Photo */}
                <div className="relative aspect-[3/4] overflow-hidden bg-black border border-primary/20">
                  <Image
                    src={artist.photo}
                    alt={artist.name}
                    fill
                    className={cn(
                      "object-cover object-top transition-all duration-700 ease-out",
                      isActive ? "scale-110" : "scale-100",
                    )}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />

                  {/* Dark gradient overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-opacity duration-500",
                      "bg-gradient-to-t from-black via-black/40 to-black/10",
                      isActive ? "opacity-85" : "opacity-60",
                    )}
                  />

                  {/* Circular logo badge — top right corner */}
                  <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-black bg-black flex-shrink-0 z-10">
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={`${artist.name} avatar`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <p className="text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest text-primary mb-0.5 sm:mb-1 leading-none">
                      {artist.discipline}
                    </p>
                    <h3 className="font-serif text-sm sm:text-base md:text-lg lg:text-xl text-white leading-tight font-medium">
                      {artist.name}
                    </h3>

                    {/* Description + social — visible on hover/tap */}
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-500 ease-in-out",
                        isActive ? "max-h-28 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0",
                      )}
                    >
                      <p className="text-[10px] sm:text-xs text-gray-300 leading-relaxed mb-2">
                        {artist.description}
                      </p>

                      {/* Social Icons */}
                      <div className="flex gap-2.5 sm:gap-3">
                        {artist.social.instagram && (
                          <a
                            href={artist.social.instagram}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary active:text-primary transition-colors"
                            aria-label="Instagram"
                          >
                            <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </a>
                        )}
                        {artist.social.spotify && (
                          <a
                            href={artist.social.spotify}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary active:text-primary transition-colors"
                            aria-label="Spotify"
                          >
                            <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </a>
                        )}
                        {artist.social.youtube && (
                          <a
                            href={artist.social.youtube}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary active:text-primary transition-colors"
                            aria-label="YouTube"
                          >
                            <YoutubeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </a>
                        )}
                        {artist.social.website && (
                          <a
                            href={artist.social.website}
                            onClick={(e) => e.stopPropagation()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary active:text-primary transition-colors"
                            aria-label="Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 bg-primary transition-opacity duration-500",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
