"use client"

import { useState } from "react"
import { X, User, Hash, Phone, CheckCircle, MessageCircle } from "lucide-react"
import { type OrbEvent, savePurchase, generateId, formatEventDate, WHATSAPP_NUMBER } from "@/lib/events-store"

interface TicketModalProps {
  event: OrbEvent
  onClose: () => void
}

export function TicketModal({ event, onClose }: TicketModalProps) {
  const [form, setForm] = useState({ name: "", cedula: "", phone: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim() || form.name.trim().length < 3) {
      e.name = "Ingresa tu nombre completo (mínimo 3 caracteres)"
    }
    if (!form.cedula.trim() || !/^\d{6,12}$/.test(form.cedula.trim())) {
      e.cedula = "Número de cédula inválido (solo dígitos, 6-12 caracteres)"
    }
    if (form.phone.trim() && !/^\+?[\d\s\-()]{7,16}$/.test(form.phone.trim())) {
      e.phone = "Número de teléfono inválido"
    }
    return e
  }

  function buildMessage() {
    const dateStr = formatEventDate(event.eventDatetime)
    return (
      `🎫 *SOLICITUD DE BOLETA — ORB CLUB*\n\n` +
      `🎵 *Evento:* ${event.title}\n` +
      `📅 *Fecha:* ${dateStr}\n` +
      `🕐 *Hora:* ${event.timeDisplay}\n` +
      `💰 *Precio:* ${event.price}\n` +
      `📍 *Lugar:* ${event.venue}, Zipaquirá\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Datos del comprador:*\n` +
      `Nombre: ${form.name.trim()}\n` +
      `Cédula: ${form.cedula.trim()}\n` +
      (form.phone.trim() ? `Teléfono: ${form.phone.trim()}\n` : "") +
      `\n━━━━━━━━━━━━━━━━━━\n` +
      `Por favor envía el comprobante de pago para confirmar tu boleta. 🙏\n\n` +
      `_ORB Club Social — Zipaquirá_`
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setIsLoading(true)

    // Save request locally
    savePurchase({
      id: generateId(),
      eventId: event.id,
      eventTitle: event.title,
      buyerName: form.name.trim(),
      buyerCedula: form.cedula.trim(),
      buyerPhone: form.phone.trim(),
      status: "sin_confirmar",
      requestedAt: new Date().toISOString(),
    })

    setIsLoading(false)
    setSubmitted(true)

    // Open WhatsApp after short delay
    setTimeout(() => {
      const msg = buildMessage()
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
        "_blank",
        "noopener,noreferrer"
      )
    }, 400)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Comprar boleta para ${event.title}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md bg-[#0f0f0f] border border-[#4d9de0]/20 shadow-2xl shadow-black/60 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#4d9de0]/10 sticky top-0 bg-[#0f0f0f] z-10">
          <div>
            <h2
              className="text-lg font-bold text-white uppercase tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Comprar Boleta
            </h2>
            <p className="text-[#4d9de0] text-xs mt-0.5 truncate max-w-[280px]">{event.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#555] hover:text-white transition-colors p-1 flex-shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!submitted ? (
            <>
              {/* Event summary */}
              <div className="mb-6 p-4 bg-[#4d9de0]/5 border border-[#4d9de0]/15 space-y-2">
                <Row label="Fecha" value={formatEventDate(event.eventDatetime, { day: "numeric", month: "long", year: "numeric" })} />
                <Row label="Hora" value={event.timeDisplay} />
                <Row label="Lugar" value={`${event.venue}, Zipaquirá`} />
                <div className="flex justify-between pt-1 border-t border-[#4d9de0]/10">
                  <span className="text-xs text-[#555] uppercase tracking-wider">Precio</span>
                  <span className="text-[#4d9de0] font-bold text-lg">{event.price}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#777] mb-2">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                    <input
                      type="text"
                      value={form.name}
                      autoComplete="name"
                      onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((er) => ({ ...er, name: "" })) }}
                      placeholder="Tu nombre completo"
                      className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#4d9de0]/15 focus:border-[#4d9de0] text-white placeholder:text-[#333] outline-none transition-colors text-sm"
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Cedula */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#777] mb-2">
                    Número de Cédula *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={form.cedula}
                      onChange={(e) => { setForm((f) => ({ ...f, cedula: e.target.value.replace(/\D/g, "") })); setErrors((er) => ({ ...er, cedula: "" })) }}
                      placeholder="Número de cédula"
                      maxLength={12}
                      className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#4d9de0]/15 focus:border-[#4d9de0] text-white placeholder:text-[#333] outline-none transition-colors text-sm font-mono"
                    />
                  </div>
                  {errors.cedula && <p className="text-red-400 text-xs mt-1">{errors.cedula}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#777] mb-2">
                    Teléfono <span className="normal-case text-[#444]">(opcional)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444]" />
                    <input
                      type="tel"
                      value={form.phone}
                      autoComplete="tel"
                      onChange={(e) => { setForm((f) => ({ ...f, phone: e.target.value })); setErrors((er) => ({ ...er, phone: "" })) }}
                      placeholder="+57 300 000 0000"
                      className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#4d9de0]/15 focus:border-[#4d9de0] text-white placeholder:text-[#333] outline-none transition-colors text-sm"
                    />
                  </div>
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                </div>

                {/* Note */}
                <p className="text-[10px] text-[#444] leading-relaxed bg-[#111] border border-[#1a1a1a] p-3">
                  Al continuar, se abrirá WhatsApp con tu solicitud pre-cargada.
                  <strong className="text-[#666]"> Debes ENVIAR el mensaje</strong> para que tu solicitud quede registrada.
                  El equipo ORB te confirmará el pago por ese medio.
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1aaa50] text-white font-bold uppercase tracking-[0.15em] transition-colors disabled:opacity-60 text-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Procesando...
                    </span>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5" />
                      Solicitar por WhatsApp
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* ── Success state */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#25D366]/15 border border-[#25D366]/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-[#25D366]" />
              </div>
              <h3
                className="text-xl font-bold text-white uppercase tracking-widest mb-3"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                ¡Solicitud Enviada!
              </h3>
              <p className="text-[#666] text-sm mb-2 leading-relaxed">
                Se ha abierto WhatsApp con tu solicitud.
              </p>
              <p className="text-[#555] text-xs mb-8 leading-relaxed">
                Envía el mensaje y espera confirmación del equipo ORB. Una vez realizado el pago,
                recibirás la confirmación de tu boleta.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    window.open(
                      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildMessage())}`,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm uppercase tracking-wider hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir WhatsApp de nuevo
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 border border-[#222] text-[#555] text-sm uppercase tracking-wider hover:text-white hover:border-[#444] transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-[#555] uppercase tracking-wider">{label}</span>
      <span className="text-white text-right max-w-[200px]">{value}</span>
    </div>
  )
}
