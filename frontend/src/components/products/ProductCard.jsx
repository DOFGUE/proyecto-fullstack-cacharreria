import { Minus, Plus } from "lucide-react"
import { FALLBACK_IMAGE, formatPrice } from "../../utils/catalog"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import ProductQuickView from "./ProductQuickView"

export default function ProductCard({ product }) {
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  useEffect(() => {
    if (product.stock < 1) {
      setQuantity(1)
    } else {
      setQuantity((current) => Math.min(Math.max(1, current), product.stock))
    }
  }, [product._id, product.stock])

  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    if (product.stock < 1) {
      toast.error("Este producto está agotado")
      return
    }
    if (quantity < 1 || quantity > product.stock) {
      toast.error("Selecciona una cantidad disponible")
      return
    }
    setAdding(true)
    try {
      await addItem(product.id, quantity)
      setAdding(false)
      toast.success(`${quantity} ${quantity === 1 ? "unidad agregada" : "unidades agregadas"} al carrito`)
    } catch (error) {
      toast.error(error.response?.data?.message || "No fue posible agregar el producto")
      setAdding(false)
    }
  }
  return (
    <article className={`product-card ${adding ? "is-adding" : ""}`}>
      <div className="product-image-wrap">
        {product.tag && <span className={`tag ${product.tag === "Nuevo" ? "new" : ""}`}>{product.tag}</span>}
        <button className="product-select-button" type="button" onClick={() => setQuickViewOpen(true)} aria-label={`Vista rápida de ${product.name}`}>
          <img src={product.image || FALLBACK_IMAGE} onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }} alt={product.name} loading="lazy" />
        </button>
      </div>
      <div className="product-body">
        <span className="product-category">{product.category}{product.subCategoryName ? ` · ${product.subCategoryName}` : ""}</span>
        <h3><button className="product-name-button" type="button" onClick={() => setQuickViewOpen(true)}>{product.name}</button></h3>
        <div className="product-price"><strong>{formatPrice(product.price)}</strong>{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div>
        {typeof product.soldQuantity === "number" && product.soldQuantity > 0 && (
          <p className="product-sold">{product.soldQuantity} unidades vendidas</p>
        )}
        <p className={`product-stock ${product.stock < 1 ? "out" : ""}`}>{product.stock > 0 ? `Disponible · ${product.stock} unidades` : "Agotado"}</p>
        <div className="product-quantity" aria-label={`Cantidad de ${product.name}`}>
          <button type="button" disabled={adding || product.stock < 1 || quantity <= 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Disminuir cantidad">
            <Minus size={14} />
          </button>
          <strong>{quantity}</strong>
          <button type="button" disabled={adding || product.stock < 1 || quantity >= product.stock} onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))} aria-label="Aumentar cantidad">
            <Plus size={14} />
          </button>
        </div>
        <div className="product-action">
          <button className="button button-primary" type="button" disabled={adding || product.stock < 1} onClick={addToCart}><Plus size={14} /> {adding ? "Agregando..." : product.stock < 1 ? "Agotado" : "Agregar"}</button>
          <button className="product-detail-link" type="button" onClick={() => setQuickViewOpen(true)} aria-label={`Ver vista rápida de ${product.name}`}>Vista rápida</button>
        </div>
      </div>
      {quickViewOpen && <ProductQuickView product={product} onClose={() => setQuickViewOpen(false)} />}
    </article>
  )
}
