import { useEffect, useState } from "react"
import { Edit3 } from "lucide-react"
import toast from "react-hot-toast"
import * as productService from "../../services/product.service"
import * as subCategoryService from "../../services/subCategory.service"
import * as adminService from "../../services/admin.service"
import AdminProductForm from "../components/AdminProductForm"
import { formatPrice, getErrorMessage } from "../../utils/catalog"

export default function AdminInventory() {
  const [products, setProducts] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [threshold, setThreshold] = useState(5)
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true); setError("")
    try {
      const [result, subs] = await Promise.all([
        productService.getProducts({ limit: 100 }),
        subCategoryService.getSubCategories()
      ])
      setProducts(result.products); setSubCategories(subs)
    } catch (requestError) { setError(getErrorMessage(requestError)) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const save = async (payload) => {
    setSaving(true)
    try {
      await adminService.updateProduct(editing._id, payload)
      toast.success("Existencias actualizadas")
      setEditing(null); await load()
    } catch (requestError) { toast.error(getErrorMessage(requestError)) } finally { setSaving(false) }
  }

  const filtered = products.filter((product) => {
    const stock = Number(product.stock)
    if (filter === "out") return stock === 0
    if (filter === "low") return stock > 0 && stock <= threshold
    if (filter === "available") return stock > threshold
    return true
  })

  return (
    <>
      <div className="admin-page-heading"><div><span className="admin-eyebrow">Existencias</span><h1>Inventario</h1><p>Consulta stock y actualiza productos mediante la edición existente.</p></div></div>
      <div className="admin-inventory-tools">
        <div className="admin-filter-tabs">
          <button className={filter === "all" ? "active" : ""} type="button" onClick={() => setFilter("all")}>Todos</button>
          <button className={filter === "out" ? "active" : ""} type="button" onClick={() => setFilter("out")}>Agotados</button>
          <button className={filter === "low" ? "active" : ""} type="button" onClick={() => setFilter("low")}>Pocas existencias</button>
          <button className={filter === "available" ? "active" : ""} type="button" onClick={() => setFilter("available")}>Disponibles</button>
        </div>
        <label className="admin-threshold">Umbral visual<input type="number" min="1" value={threshold} onChange={(event) => setThreshold(Math.max(1, Number(event.target.value) || 1))} /></label>
      </div>
      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Producto</th><th>Precio</th><th>Existencias</th><th>Estado visual</th><th className="admin-actions-column">Acción</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="5"><div className="admin-loading">Cargando inventario...</div></td></tr> : filtered.length === 0 ? <tr><td colSpan="5"><div className="admin-empty-small">No hay productos en esta clasificación.</div></td></tr> : filtered.map((product) => {
          const stock = Number(product.stock)
          const status = stock === 0 ? "Agotado" : stock <= threshold ? "Pocas existencias" : "Disponible"
          return <tr key={product._id}><td><strong>{product.name}</strong></td><td>{formatPrice(product.price)}</td><td>{stock}</td><td><span className={`admin-stock-badge ${stock === 0 ? "out" : stock <= threshold ? "low" : "ok"}`}>{status}</span></td><td><div className="admin-row-actions"><button type="button" onClick={() => setEditing(product)} title="Editar stock"><Edit3 size={17} /></button></div></td></tr>
        })}
      </tbody></table></div>
      <p className="admin-data-note">El umbral es una ayuda visual configurable y no modifica las existencias reales.</p>
      <AdminProductForm open={Boolean(editing)} product={editing} subCategories={subCategories} saving={saving} onSave={save} onClose={() => { if (!saving) setEditing(null) }} />
    </>
  )
}
