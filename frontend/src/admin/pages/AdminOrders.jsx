import { useEffect, useMemo, useState } from "react"
import { ArrowRight, PackageCheck, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"
import * as adminService from "../../services/admin.service"
import { getStatuses } from "../../services/bill.service"
import { formatPrice, getErrorMessage } from "../../utils/catalog"

const nextStatusName = {
  "en tienda": "enviado",
  enviado: "entregado"
}

export default function AdminOrders() {
  const [bills, setBills] = useState([])
  const [statuses, setStatuses] = useState([])
  const [filter, setFilter] = useState("todos")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingId, setUpdatingId] = useState("")

  const load = async () => {
    setLoading(true)
    setError("")
    try {
      const [orders, availableStatuses] = await Promise.all([
        adminService.getBills(),
        getStatuses()
      ])
      setBills(orders)
      setStatuses(availableStatuses)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filteredBills = useMemo(() => (
    filter === "todos" ? bills : bills.filter((bill) => bill.status?.name === filter)
  ), [bills, filter])

  const advance = async (bill) => {
    const nextName = nextStatusName[bill.status?.name]
    const nextStatus = statuses.find((status) => status.name === nextName)
    if (!nextStatus) return

    setUpdatingId(bill._id)
    try {
      await adminService.updateBillStatus(bill._id, nextStatus._id)
      toast.success(`Pedido enviado a "${nextStatus.name}"`)
      await load()
    } catch (requestError) {
      toast.error(getErrorMessage(requestError))
    } finally {
      setUpdatingId("")
    }
  }

  return (
    <>
      <div className="admin-page-heading">
        <div><span className="admin-eyebrow">Ventas</span><h1>Pedidos</h1><p>Consulta pedidos y avanza su estado de forma controlada.</p></div>
        <button className="admin-button admin-button-secondary" type="button" onClick={load} disabled={loading}>
          <RefreshCw size={17} />Actualizar
        </button>
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <div className="admin-filter-tabs admin-order-filters">
        {["todos", "en tienda", "enviado", "entregado"].map((status) => (
          <button key={status} className={filter === status ? "active" : ""} type="button" onClick={() => setFilter(status)}>
            {status === "todos" ? "Todos" : status}
          </button>
        ))}
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table admin-orders-table">
          <thead>
            <tr><th>Pedido</th><th>Cliente</th><th>Productos</th><th>Total</th><th>Estado</th><th className="admin-actions-column">Acción</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6"><div className="admin-loading">Cargando pedidos...</div></td></tr>
            ) : filteredBills.length === 0 ? (
              <tr><td colSpan="6"><div className="admin-empty-small">No hay pedidos en esta clasificación.</div></td></tr>
            ) : filteredBills.map((bill) => {
              const nextName = nextStatusName[bill.status?.name]
              const total = bill.cartItems.reduce((sum, cartItem) => sum + cartItem.price * cartItem.quantity, 0)
              const customerName = [bill.user?.username, bill.user?.lastName].filter(Boolean).join(" ") || bill.user?.email || "Cliente"
              return (
                <tr key={bill._id}>
                  <td><strong>#{bill._id.slice(-8).toUpperCase()}</strong><small className="admin-order-date">{new Date(bill.date).toLocaleString("es-CO")}</small></td>
                  <td><strong>{customerName}</strong>{bill.user?.email && <small className="admin-order-date">{bill.user.email}</small>}</td>
                  <td>{bill.cartItems.length} producto(s)</td>
                  <td><strong>{formatPrice(total)}</strong></td>
                  <td><span className={`admin-order-status ${bill.status?.name === "entregado" ? "delivered" : bill.status?.name === "enviado" ? "sent" : "shop"}`}>{bill.status?.name || "Sin estado"}</span></td>
                  <td>
                    {nextName ? (
                      <button className="admin-button admin-button-primary admin-order-action" type="button" onClick={() => advance(bill)} disabled={updatingId === bill._id}>
                        {updatingId === bill._id ? "Actualizando..." : <>Avanzar <ArrowRight size={15} /></>}
                      </button>
                    ) : (
                      <span className="admin-order-complete"><PackageCheck size={16} />Completado</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
