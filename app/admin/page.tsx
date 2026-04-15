"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowLeft } from "lucide-react"
import { login, isAuthenticated } from "@/lib/auth"

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isAuthenticated()) {
      router.replace("/admin/dashboard")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.username.trim() || !form.password) {
      setError("Completa todos los campos")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      const ok = await login(form.username.trim(), form.password)
      if (ok) {
        router.push("/admin/dashboard")
      } else {
        setError("Credenciales incorrectas. Verifica tu usuario y contraseña.")
        setIsLoading(false)
      }
    } catch {
      setError("Error al iniciar sesión. Intenta de nuevo.")
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#4d9de0]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-[#4d9de0]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <a href="/" className="inline-block group">
            <span className="text-4xl font-bold tracking-tighter text-white group-hover:text-white/80 transition-colors">
              O.R.B
            </span>
            <span className="text-[#4d9de0] text-4xl">.</span>
          </a>
          <p className="text-[#666] text-xs mt-3 uppercase tracking-[0.25em]">Panel de Administración</p>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-[#4d9de0]/20 p-8 shadow-2xl shadow-black/50">
          <h1 className="font-bold text-xl text-white uppercase tracking-widest mb-8 text-center"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Iniciar Sesión
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
            {/* Username */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-[#888] mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, username: e.target.value }))
                    setError("")
                  }}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#4d9de0]/20 focus:border-[#4d9de0] text-white placeholder:text-[#444] outline-none transition-colors text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-[#888] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, password: e.target.value }))
                    setError("")
                  }}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 bg-[#0a0a0a] border border-[#4d9de0]/20 focus:border-[#4d9de0] text-white placeholder:text-[#444] outline-none transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 text-red-400 bg-red-400/10 border border-red-400/20 p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#4d9de0] hover:bg-[#3d8dd0] text-white font-bold uppercase tracking-[0.2em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </span>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <div className="mt-6 text-center">
          <a href="/" className="inline-flex items-center gap-2 text-[#555] text-xs hover:text-[#4d9de0] transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Volver al sitio principal
          </a>
        </div>

        {/* Default credentials hint */}
        <p className="text-center text-[#333] text-[10px] mt-4 tracking-wider">
          Por defecto: admin / ORBadmin2026
        </p>
      </div>
    </div>
  )
}
