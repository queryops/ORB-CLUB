"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    q: "¿Dónde está ubicado ORB Club Social?",
    a: "Estamos en Carrera 16 # 14-53, Barrio San Carlos, Zipaquirá, Cundinamarca, Colombia. A pocos minutos del centro histórico.",
  },
  {
    q: "¿Cómo compro boletas para los eventos?",
    a: "Puedes comprar tus entradas directamente desde la sección de eventos en nuestra página web. Selecciona el evento, completa tu nombre y cédula, y se abrirá WhatsApp con tu solicitud pre-cargada. Envía el mensaje y el equipo ORB te confirmará el pago.",
  },
  {
    q: "¿Puedo comprar más de una entrada a la vez?",
    a: "Sí, en el formulario de compra puedes seleccionar la cantidad de entradas que necesitas (hasta 10 por solicitud). El total se calcula automáticamente.",
  },
  {
    q: "¿Cuáles son los géneros musicales que se presentan en ORB?",
    a: "ORB Club Social es un espacio abierto al talento emergente. Presentamos hip-hop, trap, reggaeton, freestyle, afrobeat, dancehall, electrónica y más. Cada evento tiene su propio lineup de artistas locales y nacionales.",
  },
  {
    q: "¿ORB Club Social apoya a artistas independientes?",
    a: "Sí, esa es nuestra misión principal. Somos una plataforma de lanzamiento para artistas emergentes de Zipaquirá y Cundinamarca. Si eres artista y quieres presentarte, contáctanos por WhatsApp o Instagram.",
  },
  {
    q: "¿Cuál es el horario de atención y eventos?",
    a: "Los eventos se realizan principalmente viernes y sábados desde las 6:00 PM, y domingos desde las 2:00 PM. Los horarios específicos de cada evento se publican en nuestra página y redes sociales.",
  },
  {
    q: "¿Cómo me entero de los próximos eventos?",
    a: "Sigue nuestras redes sociales (@orb_clubsocial en Instagram) y revisa la sección de eventos en esta página. Los eventos se actualizan en tiempo real.",
  },
  {
    q: "¿Ofrecen servicios para eventos privados?",
    a: "Sí, disponemos de diferentes espacios para eventos privados, lanzamientos musicales y sesiones fotográficas. Contáctanos por WhatsApp al +57 317 7920477 para más información.",
  },
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 md:py-24 relative bg-background/50">
      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-10 md:mb-16">
          <p className="text-xs uppercase tracking-[0.35em] text-primary mb-3">Información</p>
          <h2 className="font-urban text-3xl sm:text-4xl md:text-5xl text-foreground uppercase tracking-wide">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="border border-border/50 bg-card/30 backdrop-blur-sm">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-primary/5 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-medium text-foreground leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-primary flex-shrink-0 transition-transform duration-300",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-64" : "max-h-0"
                  )}
                >
                  <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
