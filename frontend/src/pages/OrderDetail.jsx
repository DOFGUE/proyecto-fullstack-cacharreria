import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import { EmptyState, ErrorState, LoadingState } from "../components/common/AsyncState"
import { getBill } from "../services/bill.service"
import { FALLBACK_IMAGE, formatPrice, getErrorMessage } from "../utils/catalog"
import "./Orders.css"

export default function OrderDetail() {
  const { id } = useParams()
  const [state, setState] = useState({ loading: true, error: "", bill: null })
  useEffect(() => {
    let active = true
    getBill(id).then((bill) => { if (active) setState({ loading: false, error: "", bill }) }).catch((error) => { if (active) setState({ loading: false, error: getErrorMessage(error), bill: null }) })
    return () => { active = false }
  }, [id])
  const bill = state.bill
  const total = bill?.cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0
  return <PageLayout><PageHeader title="Detalle del pedido" description={bill ? `Pedido #${bill._id.slice(-8).toUpperCase()}` : "Consulta los productos y el estado de tu pedido."} /><section className="section"><div className="container">{state.loading ? <LoadingState label="Cargando pedido..." /> : state.error ? <ErrorState message={state.error} /> : !bill ? <EmptyState message="Pedido no encontrado." /> : <div className="order-detail"><div className="order-meta"><span className="status-pill">{bill.status?.name || "Sin estado"}</span><span>{new Date(bill.date).toLocaleString("es-CO")}</span>{bill.description && <p>{bill.description}</p>}</div><div className="order-products">{bill.cartItems.map((item) => <div className="order-product" key={item._id}><img src={item.item?.image || FALLBACK_IMAGE} onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }} alt={item.item?.name || "Producto"} /><div><strong>{item.item?.name || "Producto no disponible"}</strong><p>{item.quantity} × {formatPrice(item.price)}</p></div><strong>{formatPrice(item.quantity * item.price)}</strong></div>)}</div><div className="order-total"><span>Total</span><strong>{formatPrice(total)}</strong></div><Link className="back-link" to="/mis-pedidos">← Volver a mis pedidos</Link></div>}</div></section></PageLayout>
}
