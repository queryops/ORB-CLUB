"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, ArrowLeft, Tag, ChevronDown, ChevronUp, Info } from "lucide-react"
import Link from "next/link"
import { type OrbEvent, getActiveEvents, formatEventDate, syncEventsFromGitHub } from "@/lib/events-store"
import { EventCountdown } from "@/components/event-countdown"
import { TicketModal } from "@/components/ticket-modal"

export default function CalendarioPage() {
  const [events, setEvents] = useState<OrbEvent[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [buyEvent, setBuyEvent] = useState<OrbEvent | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setEvents(getActiveEvents())
    // Pull fresh data from GitHub, then re-render
    syncEventsFromGitHub().then(() => setEvents(getActiveEvents()))
  }, [])

  const toggleExpand = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id))
  }

  if (!mounted) return null

  return (
    <>
      {/* SEO - inline since this is a client component */}
      <title>Calendario de Eventos | ORB Club Social</title>

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Header */}
        <header className="border-b border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
            <Link
              href="/#eventos"
              className="flex items-center gap-2 text-[#555] hover:text-[#4d9de0] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline uppercase tracking-wider text-xs">Volver</span>
            </Link>
            <div className="flex-1 text-center">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-bold tracking-tighter">O.R.B</span>
                <span className="text-[#4d9de0] text-2xl">.</span>
              </Link>
            </div>
            <div className="w-16" />
          </div>
        </header>

        {/* Hero */}
        <div className="relative py-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#4d9de0]/5 to-transparent pointer-events-none" />
          <p className="text-xs uppercase tracking-[0.4em] text-[#4d9de0] mb-4">Agenda Cultural</p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl text-white uppercase tracking-wide mb-4"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Calendario Completo
          </h1>
          <p className="text-[#555] text-sm max-w-md mx-auto leading-relaxed">
            Todos los próximos eventos de ORB Club Social en Zipaquirá.
            Compra tu boleta vía WhatsApp.
          </p>
        </div>

        {/* Events Grid */}
        <div className="max-w-6xl mx-auto px-6 pb-20">
          {events.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-12 h-12 text-[#222] mx-auto mb-4" />
              <h2 className="text-xl text-[#444] uppercase tracking-widest mb-2"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                No hay eventos próximos
              </h2>
              <p className="text-[#333] text-sm mb-6">Pronto anunciaremos nuevas fechas</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#4d9de0] text-sm hover:underline"
              >
                <ArrowLeft className="w-4 h-4" /> Volver al inicio
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.map((event) => {
                const isExpanded = expanded === event.id
                const date = new Date(event.eventDatetime)
                const day = date.toLocaleDateString("es-CO", { day: "numeric" })
                const month = date.toLocaleDateString("es-CO", { month: "short" }).toUpperCase()
                const year = date.toLocaleDateString("es-CO", { year: "numeric" })

                return (
                  <article
                    key={event.id}
                    className="bg-[#0d0d0d] border border-[#1a1a1a] hover:border-[#4d9de0]/20 transition-colors flex flex-col"
                  >
                    {/* Flyer */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
                      {event.flyerUrl ? (
                        <img
                          src={event.flyerUrl}
                          alt={`Flyer ${event.title}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                          <Calendar className="w-12 h-12 text-[#222]" />
                          <span className="text-[#333] text-xs uppercase tracking-widest">Sin flyer</span>
                        </div>
                      )}
                      {/* Date badge */}
                      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-2 text-center border border-[#4d9de0]/20">
                        <span className="block text-2xl font-bold text-white leading-none">{day}</span>
                        <span className="block text-[10px] uppercase tracking-widest text-[#4d9de0]">{month} {year}</span>
                      </div>
                      {/* Category badge */}
                      <div className="absolute top-4 right-4">
                        <span className="text-[10px] uppercase tracking-widest bg-[#4d9de0] text-white px-2 py-1">
                          {event.category}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col flex-1">
                      <h2
                        className="text-xl font-bold text-white uppercase tracking-wide mb-3 leading-tight"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {event.title}
                      </h2>

                      <div className="space-y-2 mb-4 text-[#666] text-xs">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#4d9de0]" />
                          {formatEventDate(event.eventDatetime, { weekday: "long", day: "numeric", month: "long" })} · {event.timeDisplay}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#4d9de0]" />
                          {event.venue}, Zipaquirá
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-[#4d9de0]" />
                          <span className="text-[#4d9de0] font-semibold">{event.price}</span>
                        </div>
                      </div>

                      {/* Countdown */}
                      <div className="mb-4 p-3 bg-[#111] border border-[#1a1a1a]">
                        <p className="text-[10px] uppercase tracking-widest text-[#444] mb-2">Cuenta regresiva</p>
                        <EventCountdown eventDatetime={event.eventDatetime} size="sm" />
                      </div>

                      {/* Description (expandable) */}
                      {event.description && (
                        <div className="mb-4">
                          <button
                            onClick={() => toggleExpand(event.id)}
                            className="flex items-center gap-2 text-xs text-[#555] hover:text-[#4d9de0] transition-colors uppercase tracking-wider"
                          >
                            <Info className="w-3.5 h-3.5" />
                            {isExpanded ? "Ocultar detalles" : "Ver detalles"}
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                          {isExpanded && (
                            <p className="mt-3 text-[#777] text-sm leading-relaxed border-l-2 border-[#4d9de0]/30 pl-3">
                              {event.description}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mt-auto">
                        <button
                          onClick={() => setBuyEvent(event)}
                          className="w-full py-3 bg-[#4d9de0] hover:bg-[#3d8dd0] text-white text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Comprar Boleta
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer mini */}
        <div className="border-t border-[#1a1a1a] py-8 text-center">
          <p className="text-[#333] text-xs uppercase tracking-widest">
            © 2026 ORB Club Social · Zipaquirá, Cundinamarca
          </p>
        </div>
      </div>

      {/* Ticket Modal */}
      {buyEvent && (
        <TicketModal event={buyEvent} onClose={() => setBuyEvent(null)} />
      )}
    </>
  )
}
