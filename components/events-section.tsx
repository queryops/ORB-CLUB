"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const events = [
  {
    id: 1,
    title: "VALENTINE FEST",
    date: "14 FEB",
    time: "3:00 PM",
    category: "URBANO",
    image: "/electronic-music-event-dark-club-synthesizers-blue.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "GOTAS DE RAP - UNDERGROUND",
    date: "18 ABRIL",
    time: "3:00 PM",
    category: "HIP - HOP",
    image: "/art-exhibition-dark-gallery-dramatic-lighting-inst.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "YAWAR CROW",
    date: "AGOST",
    time: "3:00 PM",
    category: "HIP - HOP",
    image: "/underground-dj-session-dark-nightclub-crowd-dancin.jpg",
    featured: false,
  },
]

export function EventsSection() {
  const [activeEvent, setActiveEvent] = useState(events[0])

  return (
    <section id="eventos" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent via-50% to-black/90" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">Calendario</p>
            <h2 className="font-serif text-4xl md:text-6xl text-foreground">Próximos Eventos</h2>
          </div>
          <a
            href="#"
            className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
          >
            Ver calendario completo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Events Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Event Image */}
          <div className="relative aspect-[4/3] overflow-hidden group bg-background/60 backdrop-blur-xl border border-primary/20">
            <Image
              src={activeEvent.image || "/placeholder.svg"}
              alt={activeEvent.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

            {/* Featured Event Details */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="inline-block px-3 py-1 text-xs uppercase tracking-widest bg-primary text-primary-foreground mb-4">
                {activeEvent.category}
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{activeEvent.title}</h3>
              <div className="flex flex-wrap gap-6 text-muted-foreground">
                <span className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  {activeEvent.date}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  {activeEvent.time}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  orb Club
                </span>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => setActiveEvent(event)}
                className={cn(
                  "flex gap-6 p-6 cursor-pointer transition-all duration-300 border backdrop-blur-xl",
                  activeEvent.id === event.id
                    ? "border-primary bg-primary/10"
                    : "border-primary/20 bg-background/40 hover:bg-background/60",
                )}
              >
                {/* Date Block */}
                <div className="flex-shrink-0 w-16 text-center">
                  <span className="block text-2xl font-bold text-foreground">{event.date.split(" ")[0]}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    {event.date.split(" ")[1]}
                  </span>
                </div>

                {/* Event Info */}
                <div className="flex-1">
                  <span className="text-xs uppercase tracking-widest text-primary mb-1 block">{event.category}</span>
                  <h4 className="font-serif text-xl text-foreground mb-2">{event.title}</h4>
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {event.time}
                  </span>
                </div>

                {/* Arrow Indicator */}
                <div
                  className={cn(
                    "flex-shrink-0 self-center transition-all duration-300",
                    activeEvent.id === event.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
                  )}
                >
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
