"use client"

import { useEffect, useRef, useState } from "react"

export function ManifestoSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="manifiesto" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent via-50% to-black/90" />

      <div className="absolute inset-0 bg-background/20 backdrop-blur-sm border-y border-primary/20" />

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, oklch(0.65 0.2 250) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Accent Line */}
          <div className="w-24 h-px bg-primary mx-auto mb-12" />

          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-8">Nuestro Manifiesto</p>

          <blockquote
            className={`font-serif text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-12 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="text-primary">"</span>
            Creemos en el poder del arte para transformar. En las voces que aún no han sido escuchadas. En los espacios
            donde lo imposible
            <span className="text-primary italic"> se hace real</span>.<span className="text-primary">"</span>
          </blockquote>

          <div
            className={`transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
              orb no es solo un club. Es una plataforma de lanzamiento para el talento emergente. Un punto de encuentro
              donde artistas, creadores y visionarios convergen para dar forma a la cultura de mañana.
            </p>

            <div className="flex flex-wrap justify-center gap-8 text-sm uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary" />
                Arte
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary" />
                Comunidad
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary" />
                Innovación
              </span>
            </div>
          </div>

          {/* Accent Line */}
          <div className="w-24 h-px bg-primary mx-auto mt-12" />
        </div>
      </div>
    </section>
  )
}
