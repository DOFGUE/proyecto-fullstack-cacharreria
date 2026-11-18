import { useState } from "react"
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom"
import { Boxes, ChevronRight, ExternalLink, LayoutDashboard, LogOut, Menu, PackageSearch, Shapes, Tags, X } from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"
import "./admin.css"

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Productos", icon: Boxes },
  { to: "/admin/categorias", label: "Categorías", icon: Tags },
  { to: "/admin/subcategorias", label: "Subcategorías", icon: Shapes },
  { to: "/admin/inventario", label: "Inventario", icon: PackageSearch }
]

export default function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Sesión cerrada")
      navigate("/")
    } catch {
      toast.error("No fue posible cerrar la sesión")
    }
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? "open" : ""}`}>
        <div className="admin-brand">
          <span className="admin-brand-mark">C</span>
          <div><strong>Cacharrería</strong><small>Administración</small></div>
          <button className="admin-sidebar-close" type="button" onClick={() => setOpen(false)} aria-label="Cerrar menú"><X /></button>
        </div>
        <nav className="admin-nav" aria-label="Administración">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}>
              <Icon size={19} /><span>{label}</span><ChevronRight className="admin-nav-arrow" size={15} />
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-public-link"><ExternalLink size={17} />Ver tienda pública</Link>
        </div>
      </aside>
      {open && <button className="admin-overlay" type="button" aria-label="Cerrar menú" onClick={() => setOpen(false)} />}
      <div className="admin-main">
        <header className="admin-header">
          <button className="admin-menu-button" type="button" onClick={() => setOpen(true)} aria-label="Abrir menú"><Menu /></button>
          <div className="admin-header-account">
            <div><small>Administrador</small><strong>{user?.username || "Cuenta"} {user?.lastName || ""}</strong></div>
            <button type="button" onClick={handleLogout} title="Cerrar sesión"><LogOut size={18} /><span>Cerrar sesión</span></button>
          </div>
        </header>
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  )
}
