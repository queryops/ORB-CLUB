"use client"

import { Building2, Mic2, Music2 } from "lucide-react"

const services = [
  {
    id: 1,
    icon: Building2,
    title: "ALQUILER DE ESPACIOS",
    subtitle: "Para todo tipo de evento",
    description:
      "Eventos Familiares · Cumpleaños · Eventos Corporativos · Seminarios · Reuniones · Exposiciones",
    highlight: "Espacios únicos para momentos únicos",
    accent: "Reserva tu fecha",
  },
  {
    id: 2,
    icon: Music2,
    title: "ZONA DE ENSAYO",
    subtitle: "Lunes a Viernes",
    description:
      "Espacio equipado para que tu arte tome forma. Horario disponible de 2:00 PM a 6:00 PM.",
    highlight: "2PM — 6PM",
    accent: "Lunes a Viernes",
  },
  {
    id: 3,
    icon: Mic2,
    title: "PRESENTACIONES EN VIVO",
    subtitle: "Escenario para tu talento",
    description:
      "Conciertos · Karaoke · Competencias Musicales. La mejor plataforma para artistas emergentes.",
    highlight: "Sube al escenario",
    accent: "Próximas fechas",
  },
]

export function ServicesSection() {
  return (
    <section id="servicios" className="relative py-24 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-primary/4 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] bg-primary/3 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">Lo que ofrecemos</p>
          <h2 className="font-urban text-4xl md:text-6xl text-foreground mb-6 uppercase tracking-wide">
            Nuestros{" "}
            <span className="text-primary">Servicios</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            ORB Social Club es más que un espacio — es una plataforma viva para crear, ensayar y brillar.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="group relative flex flex-col border border-primary/20 bg-background/60 backdrop-blur-sm hover:border-primary/60 transition-all duration-500 overflow-hidden"
              >
                {/* Top accent line — reveals on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number badge */}
                <div className="absolute top-4 right-4 text-5xl font-bold text-primary/8 select-none leading-none">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="p-8 lg:p-10 flex flex-col gap-6 flex-1">
                  {/* Icon */}
                  <div className="w-12 h-12 flex items-center justify-center border border-primary/30 group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {service.subtitle}
                    </span>
                    <h3 className="font-urban text-2xl lg:text-3xl text-foreground uppercase tracking-wide leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Highlight pill */}
                  <div className="mt-auto">
                    <div className="inline-flex items-center gap-3">
                      <div className="w-8 h-[1px] bg-primary/60" />
                      <span className="text-xs uppercase tracking-widest text-primary font-medium">
                        {service.highlight}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA bar — slides up on hover */}
                <div className="h-0 group-hover:h-12 overflow-hidden transition-all duration-500 bg-primary/10 border-t border-primary/20 flex items-center justify-center">
                  <span className="text-xs uppercase tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {service.accent}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6 text-sm">
            ¿Listo para hacer parte de la órbita?
          </p>
          <button
            onClick={() => {
              const el = document.getElementById("contacto")
              if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 80
                window.scrollTo({ top, behavior: "smooth" })
              }
            }}
            className="px-8 py-4 border border-primary text-primary text-sm uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent cursor-pointer"
          >
            Contáctanos
          </button>
        </div>
      </div>
    </section>
  )
}
