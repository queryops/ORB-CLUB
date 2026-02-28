"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { id: "artistas", label: "Artistas" },
  { id: "eventos", label: "Eventos" },
  { id: "espacio", label: "Espacio" },
  { id: "servicios", label: "Servicios" },
  { id: "manifiesto", label: "Manifiesto" },
]

function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (element) {
    const headerHeight = 80
    const top = element.getBoundingClientRect().top + window.scrollY - headerHeight
    window.scrollTo({ top, behavior: "smooth" })
  }
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="group">
            <span className="text-2xl font-bold tracking-tighter text-foreground transition-colors group-hover:text-primary">
              orb
            </span>
            <span className="text-primary text-2xl">.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300 bg-transparent border-none cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("contacto")}
              className="px-5 py-2 text-sm uppercase tracking-widest border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 bg-transparent cursor-pointer"
            >
              Reservar
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground p-2" aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-500",
            isOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0",
          )}
        >
          <nav className="flex flex-col gap-4 py-4 border-t border-border">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => { scrollToSection(link.id); setIsOpen(false) }}
                className="text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer text-left"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { scrollToSection("contacto"); setIsOpen(false) }}
              className="px-5 py-2 text-sm uppercase tracking-widest border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 w-fit bg-transparent cursor-pointer"
            >
              Reservar
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
