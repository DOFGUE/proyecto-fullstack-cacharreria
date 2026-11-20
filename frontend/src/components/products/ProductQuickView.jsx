import { useEffect, useRef, useState } from "react"
import { Minus, Plus, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { FALLBACK_IMAGE, formatPrice } from "../../utils/catalog"
import { useAuth } from "../../context/AuthContext"
import { useCart } from "../../context/CartContext"

export default function ProductQuickView({ product, onClose }) {
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [closing, setClosing] = useState(false)
  const closeButtonRef = useRef(null)
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    setQuantity(1)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    const handleEscape = (event) => {
      if (event.key === "Escape") closeModal()
    }
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", handleEscape)
    }
  }, [product])

  useEffect(() => {
    if (product.stock < 1) setQuantity(1)
    else setQuantity((current) => Math.min(Math.max(1, current), product.stock))
  }, [product._id, product.stock])

  const closeModal = () => {
    if (closing) return
    setClosing(true)
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.setTimeout(onClose, reduceMotion ? 0 : 180)
  }

  const addToCart = async () => {
    if (!isAuthenticated) {
      closeModal()
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
      toast.success(`${quantity} ${quantity === 1 ? "unidad agregada" : "unidades agregadas"} al carrito`)
    } catch (error) {
      toast.error(error.response?.data?.message || "No fue posible agregar el producto")
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className={`quick-view-backdrop ${closing ? "is-closing" : ""}`} onMouseDown={closeModal} role="presentation">
      <section
        className="quick-view"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button ref={closeButtonRef} className="quick-view-close" type="button" onClick={closeModal} aria-label="Cerrar vista rápida">
          <X size={20} />
        </button>
        <div className="quick-view-image">
          <img
            src={product.image || FALLBACK_IMAGE}
            onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }}
            alt={product.name}
          />
        </div>
        <div className="quick-view-content">
          <span className="eyebrow">{product.category} · {product.subCategoryName}</span>
          <h2 id="quick-view-title">{product.name}</h2>
          <div className="quick-view-price">
            <strong>{formatPrice(product.price)}</strong>
            {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
          </div>
          {typeof product.discountPercent === "number" && product.discountPercent > 0 && (
            <span className="quick-view-discount">{product.discountPercent}% de descuento</span>
          )}
          <p className="quick-view-description">{product.description || "Este producto aún no tiene una descripción registrada."}</p>
          <p className={`quick-view-stock ${product.stock < 1 ? "out" : ""}`}>
            {product.stock > 0 ? `Disponible · ${product.stock} unidades` : "Agotado"}
          </p>
          <div className="quick-view-actions">
            <div className="product-quantity" aria-label={`Cantidad de ${product.name}`}>
              <button type="button" disabled={adding || product.stock < 1 || quantity <= 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))} aria-label="Disminuir cantidad">
                <Minus size={14} />
              </button>
              <strong>{quantity}</strong>
              <button type="button" disabled={adding || product.stock < 1 || quantity >= product.stock} onClick={() => setQuantity((current) => Math.min(product.stock, current + 1))} aria-label="Aumentar cantidad">
                <Plus size={14} />
              </button>
            </div>
            <button className="button button-primary" type="button" disabled={adding || product.stock < 1} onClick={addToCart}>
              <Plus size={16} />
              {adding ? "Agregando..." : product.stock < 1 ? "Agotado" : "Agregar al carrito"}
            </button>
          </div>
          <Link className="quick-view-detail" to={`/producto/${product.id}`} onClick={closeModal}>
            Ver página completa
          </Link>
        </div>
      </section>
    </div>
  )
}
