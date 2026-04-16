"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  LogOut, Plus, Trash2, Edit3, Calendar, Users, CheckCircle, XCircle,
  Clock, MessageCircle, Upload, X, Save, AlertCircle,
  RefreshCw, Settings, Lock, Eye, EyeOff,
} from "lucide-react"
import {
  type OrbEvent, type PurchaseRequest,
  getEvents, saveEvent, deleteEvent, deactivateEvent,
  getPurchases, getPurchasesByEvent, updatePurchaseStatus,
  generateId, formatEventDate, buildWhatsAppReport, openWhatsApp,
  syncEventsFromGitHub, EVENT_CATEGORIES,
} from "@/lib/events-store"
import { isAuthenticated, logout, changePassword, ADMIN_USERNAME } from "@/lib/auth"
import {
  getGithubToken, setGithubToken, clearGithubToken, hasGithubToken,
  pushEventsToGitHub, verifyGithubToken,
} from "@/lib/github-sync"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useCountdown(eventDatetime: string) {
  const [timeLeft, setTimeLeft] = useState(() => calcLeft(eventDatetime))
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calcLeft(eventDatetime)), 1000)
    return () => clearInterval(t)
  }, [eventDatetime])
  return timeLeft
}

function calcLeft(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true }
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    expired: false,
  }
}

const STATUS_LABELS: Record<PurchaseRequest["status"], string> = {
  sin_confirmar: "Sin Confirmar",
  pago: "Pago",
  cancelado: "Cancelado",
}
const STATUS_COLORS: Record<PurchaseRequest["status"], string> = {
  sin_confirmar: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  pago: "text-green-400 bg-green-400/10 border-green-400/30",
  cancelado: "text-red-400 bg-red-400/10 border-red-400/30",
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CountdownBadge({ eventDatetime }: { eventDatetime: string }) {
  const t = useCountdown(eventDatetime)
  if (t.expired) return (
    <span className="text-xs text-red-400 font-bold uppercase tracking-wider">FINALIZADO</span>
  )
  return (
    <span className="text-xs text-[#4d9de0] font-mono tabular-nums">
      {t.d > 0 && `${t.d}d `}{String(t.h).padStart(2,"0")}:{String(t.m).padStart(2,"0")}:{String(t.s).padStart(2,"0")}
    </span>
  )
}

// ─── Modal: Create / Edit Event ───────────────────────────────────────────────

interface EventFormProps {
  event?: OrbEvent | null
  onSave: (e: OrbEvent) => void
  onClose: () => void
}

function EventFormModal({ event, onSave, onClose }: EventFormProps) {
  const isEdit = !!event
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: event?.title ?? "",
    eventDate: event?.eventDatetime.slice(0, 10) ?? "",
    eventTime: event?.eventDatetime.slice(11, 16) ?? "",
    timeDisplay: event?.timeDisplay ?? "",
    category: event?.category ?? "HIP-HOP",
    description: event?.description ?? "",
    price: event?.price ?? "",
    venue: event?.venue ?? "ORB Club Social",
    flyerUrl: event?.flyerUrl ?? "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [flyerPreview, setFlyerPreview] = useState(event?.flyerUrl ?? "")
  const [uploading, setUploading] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = "Título requerido"
    if (!form.eventDate) e.eventDate = "Fecha requerida"
    if (!form.eventTime) e.eventTime = "Hora requerida"
    if (!form.price.trim()) e.price = "Precio requerido"
    return e
  }

  const handleFlyerChange = (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      setErrors((p) => ({ ...p, flyer: "El archivo no debe superar 8MB" }))
      return
    }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setFlyerPreview(result)
      setForm((f) => ({ ...f, flyerUrl: result }))
      setErrors((p) => ({ ...p, flyer: "" }))
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const isoDatetime = `${form.eventDate}T${form.eventTime}:00`
    const hrs = parseInt(form.eventTime.split(":")[0])
    const mins = form.eventTime.split(":")[1]
    const ampm = hrs >= 12 ? "PM" : "AM"
    const h12 = hrs % 12 || 12
    const displayTime = form.timeDisplay.trim() || `${h12}:${mins} ${ampm}`

    const saved: OrbEvent = {
      id: event?.id ?? generateId(),
      title: form.title.trim().toUpperCase(),
      eventDatetime: isoDatetime,
      timeDisplay: displayTime,
      category: form.category,
      description: form.description.trim(),
      flyerUrl: form.flyerUrl,
      price: form.price.trim(),
      venue: form.venue.trim() || "ORB Club Social",
      active: true,
      createdAt: event?.createdAt ?? new Date().toISOString(),
    }
    onSave(saved)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-[#111] border border-[#4d9de0]/20 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#4d9de0]/10">
          <h2 className="text-lg font-bold text-white uppercase tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {isEdit ? "Editar Evento" : "Crear Nuevo Evento"}
          </h2>
          <button onClick={onClose} className="text-[#666] hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="admin-label">Título del Evento *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ej. RAP DE LA MATA VOL. 3"
                className="admin-input"
              />
              {errors.title && <p className="admin-error">{errors.title}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="admin-label">Fecha del Evento *</label>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm((f) => ({ ...f, eventDate: e.target.value }))}
                className="admin-input"
              />
              {errors.eventDate && <p className="admin-error">{errors.eventDate}</p>}
            </div>

            {/* Time */}
            <div>
              <label className="admin-label">Hora *</label>
              <input
                type="time"
                value={form.eventTime}
                onChange={(e) => setForm((f) => ({ ...f, eventTime: e.target.value }))}
                className="admin-input"
              />
              {errors.eventTime && <p className="admin-error">{errors.eventTime}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="admin-label">Categoría</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="admin-input"
              >
                {EVENT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="admin-label">Precio *</label>
              <input
                type="text"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="$20.000"
                className="admin-input"
              />
              {errors.price && <p className="admin-error">{errors.price}</p>}
            </div>

            {/* Venue */}
            <div className="md:col-span-2">
              <label className="admin-label">Lugar / Venue</label>
              <input
                type="text"
                value={form.venue}
                onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                placeholder="ORB Club Social"
                className="admin-input"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="admin-label">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe el evento..."
                rows={3}
                className="admin-input resize-none"
              />
            </div>

            {/* Flyer Upload */}
            <div className="md:col-span-2">
              <label className="admin-label">
                Flyer del Evento
                <span className="text-[#555] ml-2 normal-case">(recomendado: 800×1000px · JPG/PNG/WEBP · máx 8MB)</span>
              </label>

              <div
                className="mt-1 border-2 border-dashed border-[#4d9de0]/20 hover:border-[#4d9de0]/50 transition-colors cursor-pointer p-6 text-center"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const f = e.dataTransfer.files[0]
                  if (f) handleFlyerChange(f)
                }}
              >
                {flyerPreview ? (
                  <div className="relative inline-block">
                    <img src={flyerPreview} alt="Preview" className="max-h-48 mx-auto object-contain" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFlyerPreview("")
                        setForm((f) => ({ ...f, flyerUrl: "" }))
                      }}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 hover:bg-red-500/80 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-[#555]">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Arrastra el flyer aquí o haz clic para seleccionar</p>
                  </div>
                )}
                {uploading && <p className="text-[#4d9de0] text-xs mt-2">Cargando imagen...</p>}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFlyerChange(f)
                }}
              />
              {errors.flyer && <p className="admin-error">{errors.flyer}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#4d9de0] hover:bg-[#3d8dd0] text-white font-bold uppercase tracking-widest text-sm transition-colors">
              <Save className="w-4 h-4" />
              {isEdit ? "Guardar Cambios" : "Crear Evento"}
            </button>
            <button type="button" onClick={onClose} className="px-6 py-3 border border-[#333] text-[#666] hover:text-white hover:border-[#555] uppercase tracking-widest text-sm transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Modal: Edit Date Only ────────────────────────────────────────────────────

function EditDateModal({ event, onSave, onClose }: { event: OrbEvent; onSave: (e: OrbEvent) => void; onClose: () => void }) {
  const [date, setDate] = useState(event.eventDatetime.slice(0, 10))
  const [time, setTime] = useState(event.eventDatetime.slice(11, 16))

  const handleSave = () => {
    const isoDatetime = `${date}T${time}:00`
    const hrs = parseInt(time.split(":")[0])
    const mins = time.split(":")[1]
    const ampm = hrs >= 12 ? "PM" : "AM"
    const h12 = hrs % 12 || 12
    onSave({ ...event, eventDatetime: isoDatetime, timeDisplay: `${h12}:${mins} ${ampm}` })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-[#111] border border-[#4d9de0]/20 p-6">
        <h3 className="text-base font-bold text-white uppercase tracking-widest mb-5"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Cambiar Fecha — {event.title}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="admin-label">Nueva Fecha</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Nueva Hora</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="admin-input" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} className="flex-1 py-3 bg-[#4d9de0] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#3d8dd0] transition-colors">
            Guardar
          </button>
          <button onClick={onClose} className="px-5 py-3 border border-[#333] text-[#666] text-sm uppercase tracking-widest hover:text-white transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete with Password Verification ───────────────────────────────────────

function DeleteWithPasswordModal({
  eventTitle,
  onConfirm,
  onClose,
}: {
  eventTitle: string
  onConfirm: () => void
  onClose: () => void
}) {
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!password.trim()) { setError("Ingresa tu contraseña"); return }
    setLoading(true)
    const { login } = await import("@/lib/auth")
    const ok = await login(ADMIN_USERNAME, password)
    setLoading(false)
    if (ok) {
      onConfirm()
    } else {
      setError("Contraseña incorrecta. Inténtalo de nuevo.")
      setPassword("")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-[#111] border border-red-500/30 p-6">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <h3 className="text-white text-base font-bold uppercase tracking-widest text-center mb-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Eliminar Evento
        </h3>
        <p className="text-[#888] text-xs text-center mb-5 leading-relaxed">
          Se eliminará permanentemente <strong className="text-white">"{eventTitle}"</strong>.
          Confirma con tu contraseña de administrador.
        </p>
        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError("") }}
              placeholder="Contraseña de administrador"
              autoFocus
              className="admin-input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-xs flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
            </p>
          )}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-bold uppercase tracking-widest transition-colors"
            >
              {loading ? "Verificando..." : "Eliminar"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#333] text-[#666] text-sm uppercase tracking-widest hover:text-white transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = "events" | "purchases" | "settings"

export default function DashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("events")

  // Events
  const [events, setEvents] = useState<OrbEvent[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editEvent, setEditEvent] = useState<OrbEvent | null>(null)
  const [editDateEvent, setEditDateEvent] = useState<OrbEvent | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<OrbEvent | null>(null)

  // Purchases
  const [selectedEventId, setSelectedEventId] = useState<string>("all")
  const [purchases, setPurchases] = useState<PurchaseRequest[]>([])

  // Settings — password
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" })
  const [showPwCurrent, setShowPwCurrent] = useState(false)
  const [showPwNext, setShowPwNext] = useState(false)
  const [pwMsg, setPwMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null)
  const [changingPw, setChangingPw] = useState(false)

  // Settings — GitHub sync
  const [ghToken, setGhTokenState] = useState("")
  const [ghStatus, setGhStatus] = useState<{ type: "ok" | "err" | "info"; text: string } | null>(null)
  const [ghVerifying, setGhVerifying] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)

  // ─── Auth guard
  useEffect(() => {
    setMounted(true)
    if (!isAuthenticated()) {
      router.replace("/admin")
    } else {
      // Load saved token into input
      setGhTokenState(getGithubToken())
      // Pull latest events from GitHub on load
      syncEventsFromGitHub().then(() => refreshEvents())
      refreshPurchases()
    }
  }, [router])

  const refreshEvents = useCallback(() => {
    setEvents(getEvents())
  }, [])

  const refreshPurchases = useCallback(() => {
    setPurchases(getPurchases())
  }, [])

  // ─── Push all events to GitHub after any local mutation
  const pushToGitHub = useCallback(async () => {
    if (!hasGithubToken()) return
    setSyncStatus("Sincronizando con GitHub…")
    const result = await pushEventsToGitHub(getEvents())
    setSyncStatus(result.ok ? "✓ Guardado en GitHub" : `⚠ ${result.error}`)
    setTimeout(() => setSyncStatus(null), 4000)
  }, [])

  // ─── Event handlers
  const handleSaveEvent = (event: OrbEvent) => {
    saveEvent(event)
    refreshEvents()
    setShowCreateModal(false)
    setEditEvent(null)
    pushToGitHub()
  }

  const handleDeleteEvent = (event: OrbEvent) => {
    deleteEvent(event.id)
    refreshEvents()
    setConfirmDelete(null)
    pushToGitHub()
  }

  const handleSendReport = (event: OrbEvent) => {
    const msg = buildWhatsAppReport(event)
    openWhatsApp(msg)
  }

  const handleExpiredEvent = useCallback((event: OrbEvent) => {
    // Auto-send report and deactivate
    deactivateEvent(event.id)
    const msg = buildWhatsAppReport(event)
    openWhatsApp(msg)
    refreshEvents()
  }, [refreshEvents])

  const handleStatusChange = (purchaseId: string, status: PurchaseRequest["status"]) => {
    updatePurchaseStatus(purchaseId, status)
    refreshPurchases()
  }

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPwMsg(null)
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "err", text: "Las contraseñas nuevas no coinciden." })
      return
    }
    if (pwForm.next.length < 8) {
      setPwMsg({ type: "err", text: "La contraseña debe tener al menos 8 caracteres." })
      return
    }
    setChangingPw(true)
    const ok = await changePassword(pwForm.current, pwForm.next)
    setChangingPw(false)
    if (ok) {
      setPwMsg({ type: "ok", text: "Contraseña actualizada correctamente." })
      setPwForm({ current: "", next: "", confirm: "" })
    } else {
      setPwMsg({ type: "err", text: "Contraseña actual incorrecta." })
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/admin")
  }

  // ─── Filtered purchases
  const filteredPurchases = selectedEventId === "all"
    ? purchases
    : purchases.filter((p) => p.eventId === selectedEventId)

  const purchaseStats = {
    total: filteredPurchases.length,
    paid: filteredPurchases.filter((p) => p.status === "pago").length,
    cancelled: filteredPurchases.filter((p) => p.status === "cancelado").length,
    unconfirmed: filteredPurchases.filter((p) => p.status === "sin_confirmar").length,
  }

  // ─── Active events (for display)
  const activeEvents = events.filter((e) => e.active)
  const now = new Date()

  if (!mounted) return null

  return (
    <>
      <style>{`
        .admin-label { display:block; font-size:10px; text-transform:uppercase; letter-spacing:0.2em; color:#777; margin-bottom:6px; }
        .admin-input { width:100%; padding:10px 12px; background:#0a0a0a; border:1px solid rgba(77,157,224,0.2); color:white; outline:none; font-size:13px; transition:border-color 0.2s; }
        .admin-input:focus { border-color:#4d9de0; }
        .admin-input option { background:#111; }
        .admin-error { color:#f87171; font-size:11px; margin-top:4px; }
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* ─── Top Nav */}
        <header className="border-b border-[#1a1a1a] bg-[#0d0d0d] sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a href="/" className="text-xl font-bold tracking-tighter">
                O.R.B<span className="text-[#4d9de0]">.</span>
              </a>
              <span className="text-[#333] hidden sm:block">|</span>
              <span className="text-[#555] text-xs uppercase tracking-widest hidden sm:block">Admin</span>
              {syncStatus && (
                <span className={`text-xs px-2 py-0.5 rounded hidden sm:inline ${
                  syncStatus.startsWith("✓") ? "text-green-400 bg-green-400/10" :
                  syncStatus.startsWith("⚠") ? "text-yellow-400 bg-yellow-400/10" :
                  "text-[#4d9de0] bg-[#4d9de0]/10"
                }`}>{syncStatus}</span>
              )}
              {!hasGithubToken() && (
                <span className="text-xs text-yellow-500/70 hidden md:inline">
                  ⚠ Sin GitHub sync — cambios solo en este navegador
                </span>
              )}
            </div>

            {/* Tab nav */}
            <nav className="flex items-center gap-1">
              {(["events", "purchases", "settings"] as Tab[]).map((tab) => {
                const labels = { events: "Eventos", purchases: "Solicitudes", settings: "Config" }
                const icons = { events: Calendar, purchases: Users, settings: Settings }
                const Icon = icons[tab]
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                      activeTab === tab
                        ? "text-[#4d9de0] border-b-2 border-[#4d9de0]"
                        : "text-[#555] hover:text-[#888]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{labels[tab]}</span>
                  </button>
                )
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-[#555] hover:text-red-400 transition-colors uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">

          {/* ════════════════ EVENTS TAB ════════════════ */}
          {activeTab === "events" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-white uppercase tracking-widest"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Gestión de Eventos
                  </h1>
                  <p className="text-[#555] text-xs mt-1 uppercase tracking-wider">
                    {activeEvents.length} evento{activeEvents.length !== 1 ? "s" : ""} activo{activeEvents.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={refreshEvents}
                    className="p-2 border border-[#222] text-[#555] hover:text-white hover:border-[#444] transition-colors"
                    title="Refrescar"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#4d9de0] hover:bg-[#3d8dd0] text-white text-sm font-bold uppercase tracking-widest transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Crear Evento
                  </button>
                </div>
              </div>

              {activeEvents.length === 0 ? (
                <div className="border border-dashed border-[#222] p-16 text-center">
                  <Calendar className="w-12 h-12 text-[#333] mx-auto mb-4" />
                  <p className="text-[#555] text-sm mb-4">No hay eventos activos</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-[#4d9de0]/10 border border-[#4d9de0]/30 text-[#4d9de0] text-sm uppercase tracking-widest hover:bg-[#4d9de0]/20 transition-colors"
                  >
                    Crear primer evento
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {activeEvents.map((event) => {
                    const purchases = getPurchasesByEvent(event.id)
                    const paid = purchases.filter((p) => p.status === "pago").length
                    const eventDate = new Date(event.eventDatetime)
                    const expired = eventDate <= now

                    return (
                      <div
                        key={event.id}
                        className={`border ${expired ? "border-red-500/20 bg-red-500/5" : "border-[#1a1a1a] bg-[#0d0d0d]"} p-4`}
                      >
                        <div className="flex gap-4">
                          {/* Flyer thumbnail */}
                          <div className="flex-shrink-0 w-20 h-24 overflow-hidden bg-[#111] border border-[#1a1a1a]">
                            {event.flyerUrl ? (
                              <img
                                src={event.flyerUrl}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-[#333]" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start gap-2 mb-1">
                              <span className="text-[10px] uppercase tracking-widest text-[#4d9de0] bg-[#4d9de0]/10 px-2 py-0.5">
                                {event.category}
                              </span>
                              {expired && (
                                <span className="text-[10px] uppercase tracking-widest text-red-400 bg-red-400/10 px-2 py-0.5">
                                  Finalizado
                                </span>
                              )}
                            </div>
                            <h3 className="text-base font-bold text-white uppercase truncate"
                                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                              {event.title}
                            </h3>
                            <div className="flex flex-wrap gap-3 mt-1.5 text-[#555] text-xs">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatEventDate(event.eventDatetime, { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {event.timeDisplay}
                              </span>
                              <span className="flex items-center gap-1 text-[#4d9de0]">
                                <Users className="w-3 h-3" />
                                {purchases.length} solicitudes · {paid} pagadas
                              </span>
                            </div>
                          </div>

                          {/* Countdown */}
                          <div className="flex-shrink-0 text-right">
                            <p className="text-[10px] text-[#444] uppercase tracking-wider mb-1">Tiempo restante</p>
                            <CountdownBadge eventDatetime={event.eventDatetime} />
                            <p className="text-[#555] text-xs mt-1">{event.price}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#1a1a1a]">
                          <button
                            onClick={() => setEditEvent(event)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#777] border border-[#222] hover:text-white hover:border-[#444] transition-colors uppercase tracking-wider"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Editar
                          </button>
                          <button
                            onClick={() => setEditDateEvent(event)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#777] border border-[#222] hover:text-[#4d9de0] hover:border-[#4d9de0]/30 transition-colors uppercase tracking-wider"
                          >
                            <Calendar className="w-3.5 h-3.5" /> Cambiar Fecha
                          </button>
                          <button
                            onClick={() => { setActiveTab("purchases"); setSelectedEventId(event.id) }}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#777] border border-[#222] hover:text-[#4d9de0] hover:border-[#4d9de0]/30 transition-colors uppercase tracking-wider"
                          >
                            <Users className="w-3.5 h-3.5" /> Ver Solicitudes ({purchases.length})
                          </button>
                          <button
                            onClick={() => handleSendReport(event)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/10 transition-colors uppercase tracking-wider"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Enviar Reporte
                          </button>
                          {expired && (
                            <button
                              onClick={() => handleExpiredEvent(event)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-colors uppercase tracking-wider"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Finalizar y Archivar
                            </button>
                          )}
                          <button
                            onClick={() => setConfirmDelete(event)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#555] border border-[#1a1a1a] hover:text-red-400 hover:border-red-400/20 transition-colors uppercase tracking-wider ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════════════════ PURCHASES TAB ════════════════ */}
          {activeTab === "purchases" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-white uppercase tracking-widest"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Solicitudes de Compra
                  </h1>
                  <p className="text-[#555] text-xs mt-1 uppercase tracking-wider">
                    {filteredPurchases.length} solicitud{filteredPurchases.length !== 1 ? "es" : ""}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={refreshPurchases} className="p-2 border border-[#222] text-[#555] hover:text-white transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  {selectedEventId !== "all" && (
                    <button
                      onClick={() => {
                        const ev = events.find((e) => e.id === selectedEventId)
                        if (ev) handleSendReport(ev)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm uppercase tracking-widest hover:bg-[#25D366]/20 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Reporte WA
                    </button>
                  )}
                </div>
              </div>

              {/* Event Filter */}
              <div className="mb-6">
                <label className="admin-label">Filtrar por Evento</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="admin-input max-w-xs"
                >
                  <option value="all">Todos los eventos</option>
                  {activeEvents.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total", value: purchaseStats.total, color: "text-white" },
                  { label: "Pagados", value: purchaseStats.paid, color: "text-green-400" },
                  { label: "Sin Confirmar", value: purchaseStats.unconfirmed, color: "text-yellow-400" },
                  { label: "Cancelados", value: purchaseStats.cancelled, color: "text-red-400" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#0d0d0d] border border-[#1a1a1a] p-4 text-center">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-[#555] text-[10px] uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Purchases Table */}
              {filteredPurchases.length === 0 ? (
                <div className="border border-dashed border-[#222] p-16 text-center">
                  <Users className="w-12 h-12 text-[#333] mx-auto mb-4" />
                  <p className="text-[#555] text-sm">No hay solicitudes de compra</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#1a1a1a]">
                        {["Nombre", "Cédula", "Teléfono", "Evento", "Fecha", "Estado", "Acciones"].map((h) => (
                          <th key={h} className="text-left py-3 px-3 text-[10px] uppercase tracking-widest text-[#555] font-normal">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchases.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()).map((p) => (
                        <tr key={p.id} className="border-b border-[#111] hover:bg-[#0d0d0d] transition-colors">
                          <td className="py-3 px-3 text-white font-medium">{p.buyerName}</td>
                          <td className="py-3 px-3 text-[#888] font-mono">{p.buyerCedula}</td>
                          <td className="py-3 px-3 text-[#888]">{p.buyerPhone || "—"}</td>
                          <td className="py-3 px-3 text-[#4d9de0] text-xs">{p.eventTitle}</td>
                          <td className="py-3 px-3 text-[#555] text-xs">
                            {new Date(p.requestedAt).toLocaleDateString("es-CO", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`text-xs px-2 py-1 border rounded-sm ${STATUS_COLORS[p.status]}`}>
                              {STATUS_LABELS[p.status]}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <select
                              value={p.status}
                              onChange={(e) => handleStatusChange(p.id, e.target.value as PurchaseRequest["status"])}
                              className="text-xs bg-[#111] border border-[#222] text-[#888] px-2 py-1 outline-none hover:border-[#444] transition-colors"
                            >
                              <option value="sin_confirmar">Sin Confirmar</option>
                              <option value="pago">Pago</option>
                              <option value="cancelado">Cancelado</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ════════════════ SETTINGS TAB ════════════════ */}
          {activeTab === "settings" && (
            <div className="max-w-md">
              <h1 className="text-2xl font-bold text-white uppercase tracking-widest mb-8"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Configuración
              </h1>

              {/* Account info */}
              <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-5 mb-6">
                <h2 className="text-xs uppercase tracking-widest text-[#555] mb-3">Cuenta</h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4d9de0]/10 border border-[#4d9de0]/20 flex items-center justify-center">
                    <span className="text-[#4d9de0] text-sm font-bold">{ADMIN_USERNAME[0].toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{ADMIN_USERNAME}</p>
                    <p className="text-[#555] text-xs">Administrador</p>
                  </div>
                </div>
              </div>

              {/* ── GitHub Sync */}
              <div className="bg-[#0d0d0d] border border-[#4d9de0]/20 p-5 mb-6">
                <h2 className="text-xs uppercase tracking-widest text-[#4d9de0] mb-1 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  Sincronización GitHub
                </h2>
                <p className="text-[#555] text-[10px] mb-4 leading-relaxed">
                  Los eventos se guardan localmente en este navegador. Para que aparezcan en todos
                  los dispositivos, configura un token de GitHub con permiso <strong className="text-[#777]">Contents: Read & Write</strong> en este repo.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="admin-label">Personal Access Token (Fine-grained)</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={ghToken}
                        onChange={(e) => { setGhTokenState(e.target.value); setGhStatus(null) }}
                        placeholder="github_pat_..."
                        className="admin-input flex-1"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (!ghToken.trim()) { setGhStatus({ type: "err", text: "Ingresa el token" }); return }
                          setGhVerifying(true); setGhStatus(null)
                          const r = await verifyGithubToken(ghToken.trim())
                          setGhVerifying(false)
                          if (r.ok) {
                            setGithubToken(ghToken.trim())
                            setGhStatus({ type: "ok", text: "✓ Token válido y guardado" })
                          } else {
                            setGhStatus({ type: "err", text: r.error })
                          }
                        }}
                        disabled={ghVerifying}
                        className="px-4 py-2 bg-[#4d9de0] hover:bg-[#3d8dd0] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                      >
                        {ghVerifying ? "…" : "Guardar"}
                      </button>
                    </div>
                  </div>

                  {ghStatus && (
                    <p className={`text-xs flex items-center gap-1 ${
                      ghStatus.type === "ok" ? "text-green-400" :
                      ghStatus.type === "err" ? "text-red-400" : "text-[#4d9de0]"
                    }`}>
                      {ghStatus.text}
                    </p>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        setSyncStatus("Sincronizando…")
                        const r = await pushEventsToGitHub(getEvents())
                        setSyncStatus(r.ok ? "✓ Guardado en GitHub" : `⚠ ${r.error}`)
                        setTimeout(() => setSyncStatus(null), 4000)
                      }}
                      disabled={!hasGithubToken()}
                      className="flex-1 py-2 bg-[#4d9de0]/10 border border-[#4d9de0]/30 text-[#4d9de0] text-xs uppercase tracking-wider hover:bg-[#4d9de0]/20 disabled:opacity-30 transition-colors"
                    >
                      Forzar sync ahora
                    </button>
                    {hasGithubToken() && (
                      <button
                        type="button"
                        onClick={() => { clearGithubToken(); setGhTokenState(""); setGhStatus({ type: "info", text: "Token eliminado" }) }}
                        className="px-4 py-2 border border-red-500/20 text-red-400/60 text-xs uppercase tracking-wider hover:text-red-400 hover:border-red-500/40 transition-colors"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-[#1a1a1a]">
                    <p className="text-[#444] text-[10px] leading-relaxed">
                      <strong className="text-[#555]">Cómo crear el token:</strong> GitHub → Settings → Developer settings →
                      Personal access tokens → Fine-grained → Repository: queryops/ORB-CLUB →
                      Repository permissions → Contents: Read & Write
                    </p>
                  </div>
                </div>
              </div>

              {/* Change password */}
              <div className="bg-[#0d0d0d] border border-[#1a1a1a] p-5">
                <h2 className="text-xs uppercase tracking-widest text-[#555] mb-5 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" /> Cambiar Contraseña
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="admin-label">Contraseña Actual</label>
                    <div className="relative">
                      <input
                        type={showPwCurrent ? "text" : "password"}
                        value={pwForm.current}
                        onChange={(e) => setPwForm((f) => ({ ...f, current: e.target.value }))}
                        className="admin-input pr-10"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPwCurrent(!showPwCurrent)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white">
                        {showPwCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        type={showPwNext ? "text" : "password"}
                        value={pwForm.next}
                        onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                        className="admin-input pr-10"
                        placeholder="Mínimo 8 caracteres"
                      />
                      <button type="button" onClick={() => setShowPwNext(!showPwNext)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white">
                        {showPwNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      value={pwForm.confirm}
                      onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                      className="admin-input"
                      placeholder="Repite la nueva contraseña"
                    />
                  </div>

                  {pwMsg && (
                    <div className={`flex items-center gap-2 text-xs p-3 border ${
                      pwMsg.type === "ok"
                        ? "text-green-400 bg-green-400/10 border-green-400/20"
                        : "text-red-400 bg-red-400/10 border-red-400/20"
                    }`}>
                      {pwMsg.type === "ok" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                      {pwMsg.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={changingPw}
                    className="w-full py-3 bg-[#4d9de0] hover:bg-[#3d8dd0] text-white text-sm font-bold uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    {changingPw ? "Guardando..." : "Cambiar Contraseña"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ─── Modals ─ */}
      {showCreateModal && (
        <EventFormModal onSave={handleSaveEvent} onClose={() => setShowCreateModal(false)} />
      )}
      {editEvent && (
        <EventFormModal event={editEvent} onSave={handleSaveEvent} onClose={() => setEditEvent(null)} />
      )}
      {editDateEvent && (
        <EditDateModal
          event={editDateEvent}
          onSave={(e) => { saveEvent(e); refreshEvents(); pushToGitHub() }}
          onClose={() => setEditDateEvent(null)}
        />
      )}
      {confirmDelete && (
        <DeleteWithPasswordModal
          eventTitle={confirmDelete.title}
          onConfirm={() => handleDeleteEvent(confirmDelete)}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </>
  )
}
