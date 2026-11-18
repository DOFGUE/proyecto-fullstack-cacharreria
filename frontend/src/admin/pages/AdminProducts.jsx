import { useEffect, useState } from "react"
import { Edit3, Plus, Search, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import * as productService from "../../services/product.service"
import * as subCategoryService from "../../services/subCategory.service"
import * as adminService from "../../services/admin.service"
import AdminProductForm from "../components/AdminProductForm"
import AdminConfirm from "../components/AdminConfirm"
import { FALLBACK_IMAGE, formatPrice, getErrorMessage } from "../../utils/catalog"

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async (name = search) => {
    setLoading(true)
    setError("")
    try {
      const [result, subcategories] = await Promise.all([
        productService.getProducts({ limit: 100, ...(name.trim() ? { name: name.trim() } : {}) }),
        subCategoryService.getSubCategories()
      ])
      setProducts(result.products)
      setSubCategories(subcategories)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load("") }, [])

  const openCreate = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (product) => { setEditing(product); setFormOpen(true) }

  const save = async (payload) => {
    setSaving(true)
    try {
      if (editing) await adminService.updateProduct(editing._id, payload)
      else await adminService.createProduct(payload)
      toast.success(editing ? "Producto actualizado" : "Producto creado")
      setFormOpen(false)
      setEditing(null)
      await load()
    } catch (requestError) {
      const message = getErrorMessage(requestError)
      toast.error(message)
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!confirm) return
    setDeleting(true)
    try {
      await adminService.deleteProduct(confirm._id)
      toast.success("Producto eliminado")
      setConfirm(null)
      await load()
    } catch (requestError) {
      toast.error(getErrorMessage(requestError))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="admin-page-heading"><div><span className="admin-eyebrow">Catálogo</span><h1>Productos</h1><p>Consulta y administra los productos reales.</p></div><button className="admin-button admin-button-primary" type="button" onClick={openCreate}><Plus size={17} />Nuevo producto</button></div>
      <div className="admin-toolbar">
        <form className="admin-search" onSubmit={(event) => { event.preventDefault(); load(search) }}><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre" /><button type="submit">Buscar</button></form>
      </div>
      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Producto</th><th>Subcategoría</th><th>Precio</th><th>Stock</th><th className="admin-actions-column">Acciones</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="5"><div className="admin-loading">Cargando productos...</div></td></tr> : products.length === 0 ? <tr><td colSpan="5"><div className="admin-empty-small">No se encontraron productos.</div></td></tr> : products.map((product) => (
              <tr key={product._id}>
                <td><div className="admin-product-cell"><img src={product.image || FALLBACK_IMAGE} alt="" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }} /><div><strong>{product.name}</strong><small>{product.description || "Sin descripción"}</small></div></div></td>
                <td>{product.subCategory?.name || "Sin subcategoría"}</td>
                <td>{formatPrice(product.price)}</td>
                <td><span className={`admin-stock-badge ${Number(product.stock) === 0 ? "out" : Number(product.stock) <= 5 ? "low" : "ok"}`}>{Number(product.stock) === 0 ? "Agotado" : `${product.stock} unidades`}</span></td>
                <td><div className="admin-row-actions"><button type="button" onClick={() => openEdit(product)} title="Editar"><Edit3 size={17} /></button><button className="danger" type="button" onClick={() => setConfirm(product)} title="Eliminar"><Trash2 size={17} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminProductForm open={formOpen} product={editing} subCategories={subCategories} saving={saving} onSave={save} onClose={() => { if (!saving) { setFormOpen(false); setEditing(null) } }} />
      <AdminConfirm open={Boolean(confirm)} title="Eliminar producto" message={`¿Eliminar "${confirm?.name}"? Esta acción no se puede deshacer.`} loading={deleting} onConfirm={remove} onClose={() => setConfirm(null)} />
    </>
  )
}
