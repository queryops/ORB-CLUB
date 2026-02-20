"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const spaces = [
  {
    id: 1,
    name: "LA ORBITA",
    description:
      "El espacio principal con sistema de sonido Funktion-One y iluminación arquitectónica programable.",
    capacity: "400 personas",
    image: "/dark-nightclub-main-hall-industrial-design-dramati.jpg",
  },
  {
    id: 2,
    name: "The Vault",
    description: "Espacio con sets experimentales y experiencias inmersivas.",
    capacity: "Comparte tu experiencia en nuestras redes sociales.",
    image: "/underground-vault-club-intimate-dark-space-ambient.jpg",
  },
  {
    id: 3,
    name: "Gallery",
    description: "Galería de arte contemporáneo con Decoracion Inmersiva.",
    capacity: "150 personas",
    image: "/modern-art-gallery-dark-walls-dramatic-spot-lighti.jpg",
  },
  {
    id: 4,
    name: "Rooftop",
    description: "Panorámica con bar y área lounge para eventos privados.",
    capacity: "UNA EXPERIENCIA INOLVIDABLE",
    image: "/rooftop-bar-lounge-night-city-view-ambient-lightin.jpg",
  },
]

export function VenueSection() {
  const [activeSpace, setActiveSpace] = useState(spaces[0])

  return (
    <section id="espacio" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">El Espacio</p>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground mb-6">
             UNETE A LA ORBITA QUE ESTA TRANSFORMANDO . 
            <br />
            <span className="text-primary italic">ZIPAQUIRA Y EL MUNDO</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            En O.R.B, cada rincón está diseñado para ofrecer una experiencia única, donde la música y el arte se fusionan con un ambiente inmersivo y exclusivo.
          </p>
        </div>

        {/* Main Image */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden mb-8 bg-background/50 backdrop-blur-xl border border-primary/20">
          <Image
            src={activeSpace.image || "/placeholder.svg"}
            alt={activeSpace.name}
            fill
            className="object-cover transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />

          {/* Space Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-xl">
              <h3 className="font-serif text-3xl md:text-5xl text-foreground mb-4">{activeSpace.name}</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">{activeSpace.description}</p>
              <span className="text-sm uppercase tracking-widest text-primary">Capacidad: {activeSpace.capacity}</span>
            </div>
          </div>
        </div>

        {/* Space Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {spaces.map((space) => (
            <button
              key={space.id}
              onClick={() => setActiveSpace(space)}
              className={cn(
                "relative overflow-hidden aspect-video group transition-all duration-300 backdrop-blur-lg",
                activeSpace.id === space.id ? "ring-2 ring-primary" : "ring-1 ring-primary/30 hover:ring-primary/60",
              )}
            >
              <Image
                src={space.image || "/placeholder.svg"}
                alt={space.name}
                fill
                className={cn(
                  "object-cover transition-all duration-500",
                  activeSpace.id === space.id ? "scale-100" : "scale-110 group-hover:scale-105",
                )}
              />
              <div
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  activeSpace.id === space.id ? "bg-primary/20" : "bg-background/60 group-hover:bg-background/40",
                )}
              />
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center text-sm uppercase tracking-widest transition-colors",
                  activeSpace.id === space.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                {space.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
