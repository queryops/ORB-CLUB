import Link from "next/link"
import { Instagram, Twitter, Youtube, Mail, MapPin, Phone } from "lucide-react"

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/orb.music00?igsh=MXkwM2R6emVkbzMxOQ==", label: "Instagram" },
  { icon: Twitter, href: "https://open.spotify.com/artist/6Bl6scWVQQ8F14lHmZ8Bqo?si=yPie65mFQF-Yf8OAQGFv7A", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/@orbmusic-pk9ii?si=DsXFButiyBEmsvz0", label: "YouTube" },
]

const navLinks = [
  { href: "#artistas", label: "Artistas" },
  { href: "#eventos", label: "Eventos" },
  { href: "#espacio", label: "Espacio" },
  { href: "#manifiesto", label: "Manifiesto" },
]

export function Footer() {
  return (
    <footer id="contacto" className="bg-background/95 backdrop-blur-sm border-t border-border relative z-10">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="text-3xl font-bold tracking-tighter text-foreground">O.R.B</span>
              <span className="text-primary text-3xl">.</span>
            </Link>
            <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
              Plataforma de apoyo y lanzamiento para artistas emergentes. Donde el arte, la comunidad y la sofisticación
              convergen naturalmente.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 flex items-center justify-center border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-foreground mb-6">Navegación</h4>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm uppercase tracking-widest text-foreground mb-6">Contacto</h4>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:hola@orbclub.com"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4 text-primary" />
                ORBCLUB@gmail.com
              </a>
              <a
                href="tel:+34912345678"
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4 text-primary" />
                +57 311 4466471
              </a>
              <span className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                Carrera 16 # 14 - 53
                <br />
                San Carlos, Zipaquirá, Cundinamarca
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2026 O.R.B. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Política de Privacidad
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Términos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
