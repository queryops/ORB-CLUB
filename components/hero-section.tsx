"use client"

import Image from "next/image"
import { ChevronDown } from "lucide-react"

function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (element) {
    const headerHeight = 80
    const top = element.getBoundingClientRect().top + window.scrollY - headerHeight
    window.scrollTo({ top, behavior: "smooth" })
  }
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background nightclub image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/dark-nightclub-interior-with-dramatic-blue-neon-li.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-background/80 to-black z-[1]" />

      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden z-[2]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[200px] h-[200px] bg-primary/4 rounded-full blur-[60px] pointer-events-none" />
      </div>

      {/* Grid overlay effect */}
      <div
        className="absolute inset-0 opacity-[0.07] z-[2]"
        style={{
          backgroundImage: `
            linear-gradient(to right, oklch(0.65 0.2 250 / 1) 1px, transparent 1px),
            linear-gradient(to bottom, oklch(0.65 0.2 250 / 1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center pt-20 pb-16">
        {/* ORB Logo — grande y prominente */}
        <div className="mb-4 md:mb-6">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-52 md:h-52 lg:w-64 lg:h-64 mx-auto drop-shadow-[0_0_40px_oklch(0.65_0.2_250/0.4)]">
            <Image
              src="/ORB.png"
              alt="ORB Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-primary mb-4 md:mb-6">
          Club Social para Artistas Emergentes
        </p>

        <h1 className="font-urban text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 md:mb-8 tracking-wide leading-[1.05] uppercase">
          <span className="block">Donde el Arte</span>
          <span className="block text-primary">Cobra Vida</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-8 md:mb-12 leading-relaxed px-2">
          Una plataforma de apoyo y lanzamiento para artistas emergentes. Arte, comunidad y sofisticación en un solo
          espacio.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center w-full max-w-xs sm:max-w-none">
          <button
            onClick={() => scrollToSection("eventos")}
            className="px-7 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground text-xs sm:text-sm uppercase tracking-widest hover:bg-primary/90 active:bg-primary/80 transition-all duration-300 w-full sm:w-auto"
          >
            Próximos Eventos
          </button>
          <button
            onClick={() => scrollToSection("artistas")}
            className="px-7 md:px-8 py-3 md:py-4 border border-foreground/30 text-foreground text-xs sm:text-sm uppercase tracking-widest hover:border-primary hover:text-primary active:border-primary active:text-primary transition-all duration-300 w-full sm:w-auto"
          >
            Conoce a los Artistas
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
        <ChevronDown className="w-4 h-4 text-primary" />
      </div>

      {/* Side accent lines — desktop only */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
    </section>
  )
}
