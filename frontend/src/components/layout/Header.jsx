import { useState } from "react"
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"

const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Categorías", to: "/catalogo" },
  { label: "Ofertas", to: "/ofertas" },
  { label: "Más vendidos", to: "/mas-vendidos" },
  { label: "Novedades", to: "/novedades" },
  { label: "Contacto", to: "/contacto" }
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, initializing, logout } = useAuth()
  const { itemCount } = useCart()

  const submitSearch = (event) => {
    event.preventDefault()
    navigate(search.trim() ? `/catalogo?search=${encodeURIComponent(search.trim())}` : "/catalogo")
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Sesión cerrada")
      navigate("/")
    } catch (error) {
      toast.error("No fue posible cerrar la sesión")
    }
  }

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <p>✨ <strong>¡Detalles que hacen hogar!</strong> Encuentra algo bonito para cada rincón.</p>
          <span>Atención cercana todos los días</span>
        </div>
      </div>
      <header className="main-header">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="Cacharrería Casa Bonita, inicio">
            <span className="brand-mark">✦</span>
            <span className="brand-copy">Casa Bonita<span>Cacharrería</span></span>
          </Link>
          <form className="search-box" onSubmit={submitSearch}>
            <Search aria-hidden="true" />
            <input aria-label="Buscar productos" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="¿Qué estás buscando hoy?" />
          </form>
          <div className="header-actions">
            {initializing ? <span className="header-action"><UserRound /><span><small>Comprobando...</small><strong>Sesión</strong></span></span> : isAuthenticated ? <div className="header-account"><Link className="header-action" to="/perfil"><UserRound /><span><small>Hola, {user.username}</small><strong>Mi perfil</strong></span></Link><button className="header-logout" type="button" onClick={handleLogout}>Salir</button>{isAdmin && <Link className="admin-link" to="/admin">Admin</Link>}</div> : <Link className="header-action" to="/login">
              <UserRound />
              <span><small>Hola, bienvenida</small><strong>Mi cuenta</strong></span>
            </Link>}
            <Link className="header-action cart-button" to="/carrito">
              <ShoppingBag />
              <i key={itemCount} className="cart-count">{itemCount}</i>
              <span><small>Tu carrito</small><strong>{itemCount > 0 ? `${itemCount} producto${itemCount === 1 ? "" : "s"}` : "Vacío"}</strong></span>
            </Link>
          </div>
          <button className="mobile-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label="Abrir menú">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <nav className={`nav-bar ${menuOpen ? "open" : ""}`} aria-label="Navegación principal">
        <div className="container nav-inner">
          {navItems.map((item) => (
            <NavLink className="nav-link" to={item.to} key={item.label} onClick={() => setMenuOpen(false)}>{item.label}</NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
