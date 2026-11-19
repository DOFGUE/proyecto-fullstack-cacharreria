import { Link } from "react-router-dom"
import { formatPrice } from "../../utils/catalog"

export default function CartSummary({ total, checkout = true, showOrders = false }) {
  return (
    <aside className="cart-summary">
      <span className="eyebrow">Resumen</span>
      <h2>Total de tu compra</h2>
      <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(total)}</strong></div>
      <div className="summary-row total-row"><span>Total</span><strong>{formatPrice(total)}</strong></div>
      {checkout && <Link className="button button-primary full-button" to="/checkout">Continuar al checkout</Link>}
      {showOrders && <Link className="orders-summary-link" to="/mis-pedidos">Ver mis pedidos</Link>}
    </aside>
  )
}
