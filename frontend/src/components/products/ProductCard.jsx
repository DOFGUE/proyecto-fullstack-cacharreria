import { Heart, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { FALLBACK_IMAGE, formatPrice } from "../../utils/catalog"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useState } from "react"

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    if (product.stock < 1) {
      toast.error("Este producto está agotado")
      return
    }
    setAdding(true)
    try { await addItem(product.id, 1); toast.success("Producto agregado al carrito") } catch (error) { toast.error(error.response?.data?.message || "No fue posible agregar el producto") } finally { setAdding(false) }
  }
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {product.tag && <span className={`tag ${product.tag === "Nuevo" ? "new" : ""}`}>{product.tag}</span>}
        <Link to={`/producto/${product.id}`} aria-label={`Ver ${product.name}`}><img src={product.image || FALLBACK_IMAGE} onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }} alt={product.name} loading="lazy" /></Link>
      </div>
      <div className="product-body">
        <span className="product-category">{product.category}{product.subCategoryName ? ` · ${product.subCategoryName}` : ""}</span>
        <h3><Link to={`/producto/${product.id}`}>{product.name}</Link></h3>
        <div className="product-price"><strong>{formatPrice(product.price)}</strong>{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div>
        <div className="product-action">
          <button className="button button-primary" type="button" disabled={adding || product.stock < 1} onClick={addToCart}><Plus size={14} /> {adding ? "Agregando..." : product.stock < 1 ? "Agotado" : "Agregar"}</button>
          <Link to={`/producto/${product.id}`} aria-label={`Ver detalles de ${product.name}`}><Heart /></Link>
        </div>
      </div>
    </article>
  )
}
