import { Instagram, MapPin, Phone } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link className="brand" to="/">
              <span className="brand-mark">✦</span>
              <span className="brand-copy">Casa Bonita<span>Cacharrería</span></span>
            </Link>
            <p>Pequeños hallazgos, grandes sonrisas. Encuentra artículos útiles y detalles especiales para tu hogar.</p>
          </div>
          <div><h3>Explora</h3><Link to="/catalogo">Catálogo</Link><Link to="/catalogo">Categorías</Link><Link to="/ofertas">Ofertas</Link><Link to="/novedades">Novedades</Link></div>
          <div><h3>Ayuda</h3><Link to="/contacto">Contacto</Link><Link to="/preguntas-frecuentes">Preguntas frecuentes</Link><Link to="/contacto#privacidad">Privacidad</Link><Link to="/contacto#terminos">Términos y condiciones</Link></div>
          <div><h3>Conversemos</h3><p><MapPin size={14} /> Ubicación próximamente disponible</p><p><Phone size={14} /> Contacto próximamente disponible</p><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={14} /> Instagram</a></div>
        </div>
        <div className="footer-bottom"><p>© 2026 Casa Bonita. Todos los derechos reservados.</p><p>Diseñado para una experiencia cercana.</p></div>
      </div>
    </footer>
  )
}
