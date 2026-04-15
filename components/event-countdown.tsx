"use client"

import { useState, useEffect, useCallback } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function calcTimeLeft(targetIso: string): TimeLeft {
  const diff = new Date(targetIso).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    expired: false,
  }
}

interface EventCountdownProps {
  /** ISO 8601 datetime string */
  eventDatetime: string
  /** Called once when the countdown reaches zero */
  onExpire?: () => void
  size?: "sm" | "md" | "lg"
  className?: string
}

export function EventCountdown({
  eventDatetime,
  onExpire,
  size = "md",
  className = "",
}: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calcTimeLeft(eventDatetime))
  const [firedExpiry, setFiredExpiry] = useState(false)

  const handleExpiry = useCallback(() => {
    if (!firedExpiry) {
      setFiredExpiry(true)
      onExpire?.()
    }
  }, [firedExpiry, onExpire])

  useEffect(() => {
    // Re-compute in case eventDatetime changes
    setTimeLeft(calcTimeLeft(eventDatetime))
    setFiredExpiry(false)
  }, [eventDatetime])

  useEffect(() => {
    if (timeLeft.expired) {
      handleExpiry()
      return
    }
    const timer = setInterval(() => {
      const next = calcTimeLeft(eventDatetime)
      setTimeLeft(next)
      if (next.expired) {
        handleExpiry()
        clearInterval(timer)
      }
    }, 1_000)
    return () => clearInterval(timer)
  }, [eventDatetime, timeLeft.expired, handleExpiry])

  // ── Expired state
  if (timeLeft.expired) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-xs text-red-400 font-bold uppercase tracking-[0.2em]">
          Evento finalizado
        </span>
      </div>
    )
  }

  // ── Size variants
  const numClass =
    size === "lg"
      ? "text-4xl md:text-5xl"
      : size === "sm"
        ? "text-xl"
        : "text-3xl"

  const labelClass = "text-[10px] uppercase tracking-[0.2em] text-[#555]"
  const sep = <span className="text-[#4d9de0] font-light self-start pt-1 text-xl">:</span>

  return (
    <div className={`flex items-start gap-2 ${className}`}>
      {timeLeft.days > 0 && (
        <>
          <Unit value={timeLeft.days} label="días" numClass={numClass} labelClass={labelClass} />
          {sep}
        </>
      )}
      <Unit value={timeLeft.hours} label="hrs" numClass={numClass} labelClass={labelClass} />
      {sep}
      <Unit value={timeLeft.minutes} label="min" numClass={numClass} labelClass={labelClass} />
      {sep}
      <Unit value={timeLeft.seconds} label="seg" numClass={numClass} labelClass={labelClass} />
    </div>
  )
}

function Unit({
  value,
  label,
  numClass,
  labelClass,
}: {
  value: number
  label: string
  numClass: string
  labelClass: string
}) {
  return (
    <div className="flex flex-col items-center min-w-[2ch]">
      <span className={`${numClass} font-bold text-[#4d9de0] tabular-nums leading-none`}>
        {String(value).padStart(2, "0")}
      </span>
      <span className={labelClass}>{label}</span>
    </div>
  )
}
