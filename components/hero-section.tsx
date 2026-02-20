"use client"

import { useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/dark-nightclub-interior-with-dramatic-blue-neon-li.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      {/* Grid overlay effect */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(0.65 0.2 250 / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.65 0.2 250 / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-primary mb-6 animate-fade-in">
          Club Social para Artistas Emergentes
        </p>

        <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-foreground mb-8 tracking-tight">
          <span className="block text-balance">Donde el Arte</span>
          <span className="block text-primary italic">Cobra Vida</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
          Una plataforma de apoyo y lanzamiento para artistas emergentes. Arte, comunidad y sofisticación en un solo
          espacio.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#eventos"
            className="px-8 py-4 bg-primary text-primary-foreground text-sm uppercase tracking-widest hover:bg-primary/90 transition-all duration-300"
          >
            Próximos Eventos
          </a>
          <a
            href="#artistas"
            className="px-8 py-4 border border-foreground/30 text-foreground text-sm uppercase tracking-widest hover:border-primary hover:text-primary transition-all duration-300"
          >
            Conoce a los Artistas
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
        <ChevronDown className="w-5 h-5 text-primary" />
      </div>

      {/* Side accent lines */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
    </section>
  )
}
