import { useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import CartItem from "../components/cart/CartItem"
import CartSummary from "../components/cart/CartSummary"
import { EmptyState, ErrorState, LoadingState } from "../components/common/AsyncState"
import { useAuth } from "../context/AuthContext"
import { useCart } from "../context/CartContext"
import { getErrorMessage } from "../utils/catalog"
import "./Cart.css"

export default function Cart() {
  const { isAuthenticated } = useAuth()
  const { items, total, loading, error, updateItem, removeItem, clear } = useCart()
  const [busyId, setBusyId] = useState("")
  const [clearing, setClearing] = useState(false)
  const run = async (id, operation) => {
    setBusyId(id)
    try { await operation() } catch (requestError) { toast.error(getErrorMessage(requestError)) } finally { setBusyId("") }
  }
  const clearCart = async () => {
    setClearing(true)
    try { await clear(); toast.success("Carrito vaciado") } catch (requestError) { toast.error(getErrorMessage(requestError)) } finally { setClearing(false) }
  }
  if (!isAuthenticated) return <PageLayout><PageHeader title="Tu carrito" description="Revisa aquí tus productos antes de realizar un pedido." /><section className="section"><div className="container"><EmptyState message="Inicia sesión para consultar tu carrito." /><Link className="button button-primary" to="/login">Iniciar sesión</Link></div></section></PageLayout>
  if (loading) return <PageLayout><PageHeader title="Tu carrito" /><section className="section"><div className="container"><LoadingState label="Cargando carrito..." /></div></section></PageLayout>
  if (error) return <PageLayout><PageHeader title="Tu carrito" /><section className="section"><div className="container"><ErrorState message={error} /></div></section></PageLayout>
  return (
    <PageLayout>
      <PageHeader title="Tu carrito" description="Gestiona tus productos antes de confirmar el pedido." />
      <section className="section">
        <div className="container">
          {items.length ? (
            <div className="cart-layout">
              <div>
                <div className="cart-items">
                  {items.map((item) => (
                    <CartItem
                      key={item._id}
                      cartItem={item}
                      busy={busyId === item._id}
                      onUpdate={(quantity) => run(item._id, () => updateItem(item._id, quantity))}
                      onRemove={() => run(item._id, () => removeItem(item._id))}
                    />
                  ))}
                </div>
                <div className="cart-actions">
                  <button className="button button-danger" type="button" disabled={clearing} onClick={clearCart}>
                    {clearing ? "Vaciando..." : "Vaciar carrito"}
                  </button>
                </div>
              </div>
              <CartSummary total={total} showOrders />
            </div>
          ) : (
            <div className="cart-empty-orders">
              <EmptyState message="Tu carrito está vacío." />
              <Link className="button button-secondary" to="/mis-pedidos">Ver mis pedidos</Link>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
