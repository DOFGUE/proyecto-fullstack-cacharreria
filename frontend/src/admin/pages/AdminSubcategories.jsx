import { useEffect, useState } from "react"
import { Edit3, Plus, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import * as categoryService from "../../services/category.service"
import * as subCategoryService from "../../services/subCategory.service"
import * as adminService from "../../services/admin.service"
import AdminEntityForm from "../components/AdminEntityForm"
import AdminConfirm from "../components/AdminConfirm"
import { getErrorMessage } from "../../utils/catalog"

export default function AdminSubcategories() {
  const [subCategories, setSubCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    setLoading(true); setError("")
    try {
      const [items, categoryItems] = await Promise.all([
        subCategoryService.getSubCategories(),
        categoryService.getCategories()
      ])
      setSubCategories(items); setCategories(categoryItems)
    } catch (requestError) { setError(getErrorMessage(requestError)) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const fields = [
    { name: "name", label: "Nombre", required: true, requiredMessage: "El nombre de la subcategoría es obligatorio", full: true },
    { name: "category", label: "Categoría", type: "select", required: true, requiredMessage: "Selecciona una categoría", full: true, options: categories.map((category) => ({ value: category._id, label: category.name })) },
    { name: "description", label: "Descripción", type: "textarea", full: true }
  ]

  const save = async (payload) => {
    setSaving(true)
    try {
      const normalized = { ...payload, category: payload.category }
      if (editing) await adminService.updateSubCategory(editing._id, normalized)
      else await adminService.createSubCategory(normalized)
      toast.success(editing ? "Subcategoría actualizada" : "Subcategoría creada")
      setFormOpen(false); setEditing(null); await load()
    } catch (requestError) { toast.error(getErrorMessage(requestError)) } finally { setSaving(false) }
  }

  const remove = async () => {
    setDeleting(true)
    try {
      await adminService.deleteSubCategory(confirm._id)
      toast.success("Subcategoría eliminada"); setConfirm(null); await load()
    } catch (requestError) { toast.error(getErrorMessage(requestError)) } finally { setDeleting(false) }
  }

  const editingEntity = editing ? { ...editing, category: editing.category?._id || editing.category || "" } : null

  return (
    <>
      <div className="admin-page-heading"><div><span className="admin-eyebrow">Clasificación</span><h1>Subcategorías</h1><p>Relaciona subcategorías con categorías reales.</p></div><button className="admin-button admin-button-primary" type="button" onClick={() => { setEditing(null); setFormOpen(true) }}><Plus size={17} />Nueva subcategoría</button></div>
      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Nombre</th><th>Categoría</th><th>Descripción</th><th className="admin-actions-column">Acciones</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="4"><div className="admin-loading">Cargando subcategorías...</div></td></tr> : subCategories.length === 0 ? <tr><td colSpan="4"><div className="admin-empty-small">No hay subcategorías registradas.</div></td></tr> : subCategories.map((item) => <tr key={item._id}><td><strong>{item.name}</strong></td><td>{item.category?.name || "Sin categoría"}</td><td>{item.description || "Sin descripción"}</td><td><div className="admin-row-actions"><button type="button" onClick={() => { setEditing(item); setFormOpen(true) }} title="Editar"><Edit3 size={17} /></button><button className="danger" type="button" onClick={() => setConfirm(item)} title="Eliminar"><Trash2 size={17} /></button></div></td></tr>)}
      </tbody></table></div>
      <AdminEntityForm open={formOpen} title={editing ? "Editar subcategoría" : "Nueva subcategoría"} entity={editingEntity} fields={fields} saving={saving} onSave={save} onClose={() => { if (!saving) { setFormOpen(false); setEditing(null) } }} />
      <AdminConfirm open={Boolean(confirm)} title="Eliminar subcategoría" message={`¿Eliminar "${confirm?.name}"? No podrás eliminarla si existen productos asociados.`} loading={deleting} onConfirm={remove} onClose={() => setConfirm(null)} />
    </>
  )
}
