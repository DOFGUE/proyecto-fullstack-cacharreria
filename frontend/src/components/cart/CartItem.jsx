import { Minus, Plus, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { FALLBACK_IMAGE, formatPrice } from "../../utils/catalog"

export default function CartItem({ cartItem, busy, onUpdate, onRemove }) {
  const product = cartItem.item
  if (!product) return null
  return <article className="cart-item">
    <Link to={`/producto/${product._id}`} className="cart-item-image"><img src={product.image || FALLBACK_IMAGE} onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }} alt={product.name} /></Link>
    <div className="cart-item-info"><Link to={`/producto/${product._id}`}><h3>{product.name}</h3></Link><p>{formatPrice(cartItem.price)} · {product.stock} disponibles</p><div className="cart-quantity"><button type="button" disabled={busy || cartItem.quantity <= 1} onClick={() => onUpdate(cartItem.quantity - 1)} aria-label="Disminuir cantidad"><Minus size={15} /></button><strong>{cartItem.quantity}</strong><button type="button" disabled={busy || cartItem.quantity >= product.stock} onClick={() => onUpdate(cartItem.quantity + 1)} aria-label="Aumentar cantidad"><Plus size={15} /></button></div></div>
    <div className="cart-item-total"><strong>{formatPrice(cartItem.price * cartItem.quantity)}</strong><button type="button" disabled={busy} onClick={onRemove} aria-label={`Eliminar ${product.name}`}><Trash2 size={17} /></button></div>
  </article>
}
