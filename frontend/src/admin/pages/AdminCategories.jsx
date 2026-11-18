import { useEffect, useState } from "react"
import { Edit3, Plus, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import * as categoryService from "../../services/category.service"
import * as adminService from "../../services/admin.service"
import AdminEntityForm from "../components/AdminEntityForm"
import AdminConfirm from "../components/AdminConfirm"
import { getErrorMessage } from "../../utils/catalog"

const fields = [
  { name: "name", label: "Nombre", required: true, requiredMessage: "El nombre de la categoría es obligatorio", full: true },
  { name: "description", label: "Descripción", type: "textarea", full: true }
]

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true)
    setError("")
    try { setCategories(await categoryService.getCategories()) } catch (requestError) { setError(getErrorMessage(requestError)) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const save = async (payload) => {
    setSaving(true)
    try {
      if (editing) await adminService.updateCategory(editing._id, payload)
      else await adminService.createCategory(payload)
      toast.success(editing ? "Categoría actualizada" : "Categoría creada")
      setFormOpen(false); setEditing(null); await load()
    } catch (requestError) { toast.error(getErrorMessage(requestError)) } finally { setSaving(false) }
  }

  const remove = async () => {
    setDeleting(true)
    try {
      await adminService.deleteCategory(confirm._id)
      toast.success("Categoría eliminada"); setConfirm(null); await load()
    } catch (requestError) { toast.error(getErrorMessage(requestError)) } finally { setDeleting(false) }
  }

  return (
    <>
      <div className="admin-page-heading"><div><span className="admin-eyebrow">Clasificación</span><h1>Categorías</h1><p>Organiza las categorías principales del catálogo.</p></div><button className="admin-button admin-button-primary" type="button" onClick={() => { setEditing(null); setFormOpen(true) }}><Plus size={17} />Nueva categoría</button></div>
      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Nombre</th><th>Descripción</th><th className="admin-actions-column">Acciones</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="3"><div className="admin-loading">Cargando categorías...</div></td></tr> : categories.length === 0 ? <tr><td colSpan="3"><div className="admin-empty-small">No hay categorías registradas.</div></td></tr> : categories.map((category) => <tr key={category._id}><td><strong>{category.name}</strong></td><td>{category.description || "Sin descripción"}</td><td><div className="admin-row-actions"><button type="button" onClick={() => { setEditing(category); setFormOpen(true) }} title="Editar"><Edit3 size={17} /></button><button className="danger" type="button" onClick={() => setConfirm(category)} title="Eliminar"><Trash2 size={17} /></button></div></td></tr>)}
      </tbody></table></div>
      <AdminEntityForm open={formOpen} title={editing ? "Editar categoría" : "Nueva categoría"} entity={editing} fields={fields} saving={saving} onSave={save} onClose={() => { if (!saving) { setFormOpen(false); setEditing(null) } }} />
      <AdminConfirm open={Boolean(confirm)} title="Eliminar categoría" message={`¿Eliminar "${confirm?.name}"? No podrás eliminarla si tiene subcategorías relacionadas.`} loading={deleting} onConfirm={remove} onClose={() => setConfirm(null)} />
    </>
  )
}
