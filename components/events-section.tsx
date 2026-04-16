"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar, Clock, MapPin, ArrowRight, Tag, ChevronDown, ChevronUp,
  Ticket, Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { imgSrc } from "@/lib/image-path"
import {
  type OrbEvent,
  getActiveEvents,
  deactivateEvent,
  buildWhatsAppReport,
  openWhatsApp,
  formatEventDate,
  syncEventsFromGitHub,
} from "@/lib/events-store"
import { EventCountdown } from "@/components/event-countdown"
import { TicketModal } from "@/components/ticket-modal"

export function EventsSection() {
  const [events, setEvents] = useState<OrbEvent[]>([])
  const [activeEvent, setActiveEvent] = useState<OrbEvent | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [buyEvent, setBuyEvent] = useState<OrbEvent | null>(null)
  const [mounted, setMounted] = useState(false)

  const loadEvents = useCallback(() => {
    const active = getActiveEvents()
    setEvents(active)
    if (active.length > 0) {
      setActiveEvent((prev) => {
        if (prev && active.find((e) => e.id === prev.id)) return prev
        return active[0]
      })
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    // First load from localStorage cache immediately (no flicker)
    loadEvents()
    // Then sync from GitHub in background — updates localStorage and re-renders
    syncEventsFromGitHub()

    window.addEventListener('orb:events-changed', loadEvents)
    window.addEventListener('storage', loadEvents)
    return () => {
      window.removeEventListener('orb:events-changed', loadEvents)
      window.removeEventListener('storage', loadEvents)
    }
  }, [loadEvents])

  const handleEventExpire = useCallback(
    (event: OrbEvent) => {
      // Send final WhatsApp report then deactivate
      const msg = buildWhatsAppReport(event)
      openWhatsApp(msg)
      deactivateEvent(event.id)
      // Reload events list (expired one is now removed)
      setTimeout(loadEvents, 500)
    },
    [loadEvents]
  )

  if (!mounted) return null

  return (
    <section id="eventos" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent via-50% to-black/90 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* ── Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-primary mb-4">Calendario</p>
            <h2
              className="font-urban text-4xl md:text-6xl text-foreground uppercase tracking-wide"
            >
              Próximos Eventos
            </h2>
          </div>
          <Link
            href="/calendario"
            className="flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
          >
            Ver calendario completo
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ── No events */}
        {events.length === 0 ? (
          <div className="border border-dashed border-primary/10 py-20 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground text-sm uppercase tracking-widest">
              No hay eventos próximos
            </p>
            <p className="text-muted-foreground/50 text-xs mt-2">
              Pronto anunciaremos nuevas fechas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ── Featured Event Panel */}
            {activeEvent && (
              <div className="relative overflow-hidden group bg-background/60 backdrop-blur-xl border border-primary/20">
                {/* Flyer image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {activeEvent.flyerUrl ? (
                    activeEvent.flyerUrl.startsWith("data:") ? (
                      <img
                        src={activeEvent.flyerUrl}
                        alt={activeEvent.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <Image
                        src={imgSrc(activeEvent.flyerUrl)}
                        alt={activeEvent.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                    )
                  ) : (
                    <div className="w-full h-full bg-background flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-primary/20" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                </div>

                {/* Featured info overlay */}
                <div className="p-8">
                  <span className="inline-block px-3 py-1 text-xs uppercase tracking-widest bg-primary text-primary-foreground mb-4">
                    {activeEvent.category}
                  </span>
                  <h3
                    className="font-urban text-3xl md:text-4xl text-foreground mb-4 uppercase tracking-wider"
                  >
                    {activeEvent.title}
                  </h3>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-5 text-muted-foreground mb-5">
                    <span className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      {formatEventDate(activeEvent.eventDatetime, { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      {activeEvent.timeDisplay}
                    </span>
                    <span className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      {activeEvent.venue}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-primary font-semibold">
                      <Tag className="w-4 h-4" />
                      {activeEvent.price}
                    </span>
                  </div>

                  {/* Countdown */}
                  <div className="mb-5 p-4 bg-background/60 border border-primary/10">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-3">
                      Cuenta regresiva
                    </p>
                    <EventCountdown
                      eventDatetime={activeEvent.eventDatetime}
                      onExpire={() => handleEventExpire(activeEvent)}
                      size="md"
                    />
                  </div>

                  {/* Description (expandable) */}
                  {activeEvent.description && (
                    <div className="mb-5">
                      <button
                        onClick={() =>
                          setExpandedId((id) =>
                            id === activeEvent.id ? null : activeEvent.id
                          )
                        }
                        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
                      >
                        <Info className="w-3.5 h-3.5" />
                        {expandedId === activeEvent.id ? "Ocultar detalles" : "Ver detalles del evento"}
                        {expandedId === activeEvent.id ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {expandedId === activeEvent.id && (
                        <p className="mt-3 text-muted-foreground text-sm leading-relaxed border-l-2 border-primary/30 pl-4">
                          {activeEvent.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setBuyEvent(activeEvent)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold uppercase tracking-widest transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Comprar Boleta
                    </button>
                    <Link
                      href="/calendario"
                      className="flex items-center justify-center gap-2 px-5 py-3 border border-primary/30 text-muted-foreground hover:text-primary hover:border-primary text-xs uppercase tracking-widest transition-colors"
                    >
                      <Ticket className="w-4 h-4" />
                      Ver todos
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* ── Events List */}
            <div className="flex flex-col gap-4">
              {events.map((event) => {
                const isActive = activeEvent?.id === event.id
                const dateDay = new Date(event.eventDatetime).toLocaleDateString("es-CO", { day: "numeric" })
                const dateMonth = new Date(event.eventDatetime).toLocaleDateString("es-CO", { month: "short" }).toUpperCase()

                return (
                  <div
                    key={event.id}
                    onClick={() => setActiveEvent(event)}
                    className={cn(
                      "flex gap-4 p-5 cursor-pointer transition-all duration-300 border backdrop-blur-xl",
                      isActive
                        ? "border-primary bg-primary/10"
                        : "border-primary/15 bg-background/40 hover:bg-background/60 hover:border-primary/30"
                    )}
                  >
                    {/* Date block */}
                    <div className="flex-shrink-0 w-14 text-center">
                      <span className="block text-2xl font-bold text-foreground leading-none">{dateDay}</span>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{dateMonth}</span>
                    </div>

                    {/* Event info */}
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-widest text-primary mb-1 block">
                        {event.category}
                      </span>
                      <h4
                        className="font-urban text-lg text-foreground mb-1 uppercase tracking-wide truncate"
                      >
                        {event.title}
                      </h4>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.timeDisplay}
                        </span>
                        <span className="flex items-center gap-1 text-primary">
                          <Tag className="w-3 h-3" />
                          {event.price}
                        </span>
                      </div>
                      {/* Mini countdown */}
                      {isActive && (
                        <div className="mt-2">
                          <EventCountdown
                            eventDatetime={event.eventDatetime}
                            onExpire={() => handleEventExpire(event)}
                            size="sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* Buy quick-action */}
                    <div className="flex-shrink-0 self-center flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setBuyEvent(event)
                        }}
                        className={cn(
                          "p-2 transition-all duration-300",
                          isActive
                            ? "bg-[#25D366] text-white opacity-100"
                            : "bg-transparent text-muted-foreground opacity-0 group-hover:opacity-100"
                        )}
                        aria-label="Comprar boleta"
                        title="Comprar boleta"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* View all link */}
              <Link
                href="/calendario"
                className="flex items-center justify-center gap-2 p-5 border border-dashed border-primary/10 text-muted-foreground/50 hover:text-primary hover:border-primary/30 transition-colors text-xs uppercase tracking-widest"
              >
                Ver calendario completo
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Ticket purchase modal */}
      {buyEvent && (
        <TicketModal event={buyEvent} onClose={() => setBuyEvent(null)} />
      )}
    </section>
  )
}
