import { useState } from "react"
import { LoaderCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import CartSummary from "../components/cart/CartSummary"
import CartItem from "../components/cart/CartItem"
import { LoadingState, ErrorState, EmptyState } from "../components/common/AsyncState"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { createBill } from "../services/bill.service"
import { getErrorMessage } from "../utils/catalog"
import "./Cart.css"

export default function Checkout() {
  const { items, total, loading, error, refreshCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit } = useForm()

  if (!isAuthenticated) return <PageLayout><div className="container section"><EmptyState message="Inicia sesión para continuar con tu compra." /></div></PageLayout>
  if (loading) return <PageLayout><div className="container section"><LoadingState label="Cargando resumen de compra..." /></div></PageLayout>
  if (error) return <PageLayout><div className="container section"><ErrorState message={error} /></div></PageLayout>
  if (!items.length) return <PageLayout><div className="container section"><EmptyState message="Tu carrito está vacío." /></div></PageLayout>

  const onSubmit = async ({ description }) => {
    setSubmitting(true)
    try {
      const bill = await createBill(description)
      await refreshCart()
      toast.success("Pedido creado correctamente")
      navigate(`/mis-pedidos/${bill._id}`, { replace: true })
    } catch (requestError) {
      toast.error(getErrorMessage(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return <PageLayout><PageHeader title="Confirmar pedido" description="Revisa tu compra y agrega una descripción de entrega si lo necesitas." /><section className="section"><div className="container checkout-layout"><div><div className="checkout-items">{items.map((item) => <CartItem key={item._id} cartItem={item} busy={true} onUpdate={() => {}} onRemove={() => {}} />)}</div><form className="checkout-form" onSubmit={handleSubmit(onSubmit)}><label htmlFor="description">Descripción de entrega (opcional)</label>  <textarea id="description" rows="4" placeholder="Indicación adicional para tu pedido" {...register("description")} /><p>Puedes agregar una referencia o indicación que acompañe tu pedido.</p><button className="button button-primary" disabled={submitting} type="submit">{submitting ? <><LoaderCircle className="spin" size={16} /> Creando pedido...</> : "Confirmar pedido"}</button></form></div><CartSummary total={total} checkout={false} /></div></section></PageLayout>
}
