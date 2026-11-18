import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import PageLayout from "../components/layout/PageLayout"
import PageHeader from "../components/common/PageHeader"
import { EmptyState, ErrorState, LoadingState } from "../components/common/AsyncState"
import { getBills } from "../services/bill.service"
import { formatPrice, getErrorMessage } from "../utils/catalog"
import "./Orders.css"

export default function Orders() {
  const [state, setState] = useState({ loading: true, error: "", bills: [] })
  useEffect(() => {
    let active = true
    getBills().then((bills) => { if (active) setState({ loading: false, error: "", bills }) }).catch((error) => { if (active) setState({ loading: false, error: getErrorMessage(error), bills: [] }) })
    return () => { active = false }
  }, [])
  return <PageLayout><PageHeader title="Mis pedidos" description="Consulta el historial real de tus compras." /><section className="section"><div className="container">{state.loading ? <LoadingState label="Cargando pedidos..." /> : state.error ? <ErrorState message={state.error} /> : state.bills.length ? <div className="orders-list">{state.bills.map((bill) => <Link className="order-card" to={`/mis-pedidos/${bill._id}`} key={bill._id}><div><span className="eyebrow">Pedido</span><h2>#{bill._id.slice(-8).toUpperCase()}</h2><p>{new Date(bill.date).toLocaleDateString("es-CO")} · {bill.cartItems.length} producto(s)</p></div><div className="order-card-side"><strong>{formatPrice(bill.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0))}</strong><span className="status-pill">{bill.status?.name || "Sin estado"}</span></div></Link>)}</div> : <EmptyState message="Todavía no tienes pedidos." />}</div></section></PageLayout>
}
