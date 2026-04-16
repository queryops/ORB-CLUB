"use client"

// ─── Types ─────────────────────────────────────────────────────────────────

export interface OrbEvent {
  id: string
  title: string
  /** ISO 8601 full datetime: "2026-04-18T15:00:00" */
  eventDatetime: string
  /** Display time string: "3:00 PM" */
  timeDisplay: string
  category: string
  description: string
  /** base64 data URI or public path to flyer image */
  flyerUrl: string
  price: string
  venue: string
  active: boolean
  createdAt: string
}

export interface PurchaseRequest {
  id: string
  eventId: string
  eventTitle: string
  buyerName: string
  buyerCedula: string
  buyerPhone: string
  status: 'sin_confirmar' | 'pago' | 'cancelado'
  requestedAt: string
  quantity: number
}

// ─── Constants ──────────────────────────────────────────────────────────────

const EVENTS_KEY = 'orb_events'
const PURCHASES_KEY = 'orb_purchases'
export const WHATSAPP_NUMBER = '573177920477'

export const EVENT_CATEGORIES = [
  'HIP-HOP',
  'TRAP',
  'REGGAETON',
  'FREESTYLE',
  'SALSA',
  'CUMBIA',
  'ELECTRÓNICA',
  'ROCK',
  'JAZZ',
  'OTRO',
]

/** Seed events shown to all visitors until admin creates their own */
export const DEFAULT_EVENTS: OrbEvent[] = [
  {
    id: 'evt-001',
    title: 'RAP DE LA MATA VOL. 2',
    eventDatetime: '2026-04-18T15:00:00',
    timeDisplay: '3:00 PM',
    category: 'HIP-HOP',
    description:
      'Una noche épica de hip-hop underground con los mejores artistas del escenario local emergente de Zipaquirá. Freestyle, rap en vivo y mucha energía.',
    flyerUrl: '/events/RAP DE LA MATA VOL2.webp',
    price: '$20.000',
    venue: 'ORB Club Social',
    active: true,
    createdAt: '2026-03-01T00:00:00',
  },
  {
    id: 'evt-002',
    title: 'YAWAR CRU',
    eventDatetime: '2026-08-15T18:00:00',
    timeDisplay: '6:00 PM',
    category: 'HIP-HOP',
    description:
      'El regreso de YAWAR CRU con un set especial en el ORB. Una noche para recordar llena de flows y beats únicos.',
    flyerUrl: '/underground-dj-session-dark-nightclub-crowd-dancin.webp',
    price: '$25.000',
    venue: 'ORB Club Social',
    active: true,
    createdAt: '2026-03-15T00:00:00',
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function isClient(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Dispatches a custom window event so any component on the same tab can react
 * to localStorage changes in real time (the native `storage` event only fires
 * in *other* tabs, not the originating one).
 */
function notifyEventsChanged(): void {
  if (!isClient()) return
  window.dispatchEvent(new CustomEvent('orb:events-changed'))
}

/**
 * Pull events from GitHub raw URL and overwrite localStorage cache.
 * Called on mount in public pages and admin dashboard.
 * Falls back silently to existing localStorage data if fetch fails.
 */
export async function syncEventsFromGitHub(): Promise<void> {
  if (!isClient()) return
  try {
    const { pullEventsFromGitHub } = await import('./github-sync')
    const remote = await pullEventsFromGitHub()
    if (remote && Array.isArray(remote)) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(remote))
      notifyEventsChanged()
    }
  } catch {
    // Network error or GitHub unavailable — use cached localStorage
  }
}

export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`
}

export function formatEventDate(isoDatetime: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    return new Date(isoDatetime).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    })
  } catch {
    return isoDatetime
  }
}

// ─── Events CRUD ────────────────────────────────────────────────────────────

export function getEvents(): OrbEvent[] {
  if (!isClient()) return DEFAULT_EVENTS
  try {
    const stored = localStorage.getItem(EVENTS_KEY)
    if (!stored) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(DEFAULT_EVENTS))
      return DEFAULT_EVENTS
    }
    return JSON.parse(stored) as OrbEvent[]
  } catch {
    return DEFAULT_EVENTS
  }
}

/** Returns only events that are active AND have not passed their datetime, sorted nearest first */
export function getActiveEvents(): OrbEvent[] {
  const now = new Date()
  return getEvents()
    .filter((e) => e.active && new Date(e.eventDatetime) > now)
    .sort((a, b) => new Date(a.eventDatetime).getTime() - new Date(b.eventDatetime).getTime())
}

export function saveEvent(event: OrbEvent): void {
  if (!isClient()) return
  const events = getEvents()
  const idx = events.findIndex((e) => e.id === event.id)
  if (idx >= 0) {
    events[idx] = event
  } else {
    events.push(event)
  }
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  notifyEventsChanged()
}

export function deleteEvent(id: string): void {
  if (!isClient()) return
  const events = getEvents().filter((e) => e.id !== id)
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
  notifyEventsChanged()
}

export function deactivateEvent(id: string): void {
  if (!isClient()) return
  const events = getEvents()
  const idx = events.findIndex((e) => e.id === id)
  if (idx >= 0) {
    events[idx].active = false
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
    notifyEventsChanged()
  }
}

export function updateEventDatetime(id: string, newDatetime: string, newTimeDisplay: string): void {
  if (!isClient()) return
  const events = getEvents()
  const idx = events.findIndex((e) => e.id === id)
  if (idx >= 0) {
    events[idx].eventDatetime = newDatetime
    events[idx].timeDisplay = newTimeDisplay
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))
    notifyEventsChanged()
  }
}

// ─── Purchases CRUD ─────────────────────────────────────────────────────────

export function getPurchases(): PurchaseRequest[] {
  if (!isClient()) return []
  try {
    const stored = localStorage.getItem(PURCHASES_KEY)
    return stored ? (JSON.parse(stored) as PurchaseRequest[]) : []
  } catch {
    return []
  }
}

export function getPurchasesByEvent(eventId: string): PurchaseRequest[] {
  return getPurchases().filter((p) => p.eventId === eventId)
}

export function savePurchase(purchase: PurchaseRequest): void {
  if (!isClient()) return
  const purchases = getPurchases()
  const idx = purchases.findIndex((p) => p.id === purchase.id)
  if (idx >= 0) {
    purchases[idx] = purchase
  } else {
    purchases.push(purchase)
  }
  localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases))
}

export function updatePurchaseStatus(id: string, status: PurchaseRequest['status']): void {
  if (!isClient()) return
  const purchases = getPurchases()
  const idx = purchases.findIndex((p) => p.id === id)
  if (idx >= 0) {
    purchases[idx].status = status
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases))
  }
}

// ─── WhatsApp Report Generator ───────────────────────────────────────────────

export function buildWhatsAppReport(event: OrbEvent): string {
  const purchases = getPurchasesByEvent(event.id)
  const paid = purchases.filter((p) => p.status === 'pago')
  const cancelled = purchases.filter((p) => p.status === 'cancelado')
  const unconfirmed = purchases.filter((p) => p.status === 'sin_confirmar')
  const dateStr = formatEventDate(event.eventDatetime)

  let msg = `📊 *REPORTE FINAL — ORB CLUB*\n\n`
  msg += `🎵 *Evento:* ${event.title}\n`
  msg += `📅 *Fecha:* ${dateStr}\n`
  msg += `🕐 *Hora:* ${event.timeDisplay}\n`
  msg += `📍 *Lugar:* ${event.venue}\n\n`
  msg += `━━━━━━━━━━━━━━━━━━\n`
  msg += `📈 *RESUMEN*\n`
  msg += `Total solicitudes: ${purchases.length}\n`
  msg += `✅ Pagos confirmados: ${paid.length}\n`
  msg += `❌ Cancelados: ${cancelled.length}\n`
  msg += `⏳ Sin confirmar: ${unconfirmed.length}\n\n`

  if (purchases.length > 0) {
    msg += `━━━━━━━━━━━━━━━━━━\n`
    msg += `📋 *LISTADO COMPLETO*\n\n`
    purchases.forEach((p, i) => {
      const emoji = p.status === 'pago' ? '✅' : p.status === 'cancelado' ? '❌' : '⏳'
      const label = p.status === 'pago' ? 'PAGO' : p.status === 'cancelado' ? 'CANCELADO' : 'SIN CONFIRMAR'
      msg += `${i + 1}. *${p.buyerName}*\n`
      msg += `   CC: ${p.buyerCedula}\n`
      if (p.buyerPhone) msg += `   Tel: ${p.buyerPhone}\n`
      msg += `   ${emoji} ${label}\n\n`
    })
  } else {
    msg += `━━━━━━━━━━━━━━━━━━\n`
    msg += `_No hubo solicitudes de compra para este evento._\n\n`
  }

  msg += `━━━━━━━━━━━━━━━━━━\n`
  msg += `_ORB Club Social — Zipaquirá, Cundinamarca_`
  return msg
}

export function openWhatsApp(message: string): void {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
