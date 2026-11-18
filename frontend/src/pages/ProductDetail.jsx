import { useEffect, useState } from "react"
import { ArrowLeft, Minus, Plus } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import PageLayout from "../components/layout/PageLayout"
import { getProduct } from "../services/product.service"
import { FALLBACK_IMAGE, formatPrice, getErrorMessage, normalizeProduct } from "../utils/catalog"
import { ErrorState, LoadingState } from "../components/common/AsyncState"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import toast from "react-hot-toast"

export default function ProductDetail() {
  const { id } = useParams()
  const [state, setState] = useState({ loading: true, error: "", product: null })
  const [quantity, setQuantity] = useState(1)
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)
  useEffect(() => {
    let active = true
    getProduct(id)
      .then((response) => { if (active) setState({ loading: false, error: "", product: normalizeProduct(response) }) })
      .catch((error) => { if (active) setState({ loading: false, error: getErrorMessage(error), product: null }) })
    return () => { active = false }
  }, [id])
  if (state.loading) return <PageLayout><div className="container section"><LoadingState label="Cargando producto..." /></div></PageLayout>
  if (state.error) return <PageLayout><div className="container section"><ErrorState message={state.error} /></div></PageLayout>
  const product = state.product
  if (!product) return <PageLayout><div className="container section"><div className="placeholder"><strong>Producto no encontrado</strong><Link className="button button-primary" to="/catalogo">Volver al catálogo</Link></div></div></PageLayout>
  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }
    setAdding(true)
    try { await addItem(product._id, quantity); toast.success("Producto agregado al carrito") } catch (error) { toast.error(error.response?.data?.message || "No fue posible agregar el producto") } finally { setAdding(false) }
  }
  return <PageLayout><section className="section product-detail"><div className="container"><Link className="back-link" to="/catalogo"><ArrowLeft size={16} /> Volver al catálogo</Link><div className="detail-grid"><div className="detail-image"><img src={product.image || FALLBACK_IMAGE} onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }} alt={product.name} /></div><div className="detail-copy"><span className="eyebrow">{product.category} · {product.subCategoryName}</span><h1>{product.name}</h1><p className="detail-price">{formatPrice(product.price)}</p><p>{product.description || "Este producto aún no tiene una descripción registrada."}</p><p className="availability">● {product.stock > 0 ? `Disponible · ${product.stock} unidades` : "Agotado"}</p><div className="quantity"><button type="button" disabled={product.stock === 0} onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Disminuir cantidad"><Minus size={16} /></button><strong>{quantity}</strong><button type="button" disabled={product.stock === 0} onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} aria-label="Aumentar cantidad"><Plus size={16} /></button></div><button className="button button-primary" type="button" disabled={adding || product.stock === 0} onClick={addToCart}>{adding ? "Agregando..." : product.stock === 0 ? "Agotado" : "Agregar al carrito"} <span className="provisional-label">sin checkout de pago</span></button></div></div></div></section></PageLayout>
}
