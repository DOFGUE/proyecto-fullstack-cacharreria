import { useEffect, useState } from "react"
import { LoaderCircle, X } from "lucide-react"

export default function AdminProductForm({ open, product, subCategories, saving, onSave, onClose }) {
  const [form, setForm] = useState({
    subCategory: "",
    name: "",
    description: "",
    price: "",
    stock: "",
    image: ""
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return
    setError("")
    setForm({
      subCategory: product?.subCategory?._id || product?.subCategory || "",
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ?? "",
      stock: product?.stock ?? "",
      image: product?.image || ""
    })
  }, [open, product])

  if (!open) return null

  const setField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const readImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("La imagen debe ser JPEG, PNG o WebP")
      event.target.value = ""
      return
    }
    if (file.size > 1.5 * 1024 * 1024) {
      setError("La imagen debe pesar menos de 1.5 MB")
      event.target.value = ""
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm((current) => ({ ...current, image: String(reader.result || "") }))
    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError("")
    if (!form.subCategory) return setError("Selecciona una subcategoría")
    if (!form.name.trim()) return setError("El nombre es obligatorio")
    if (form.price === "" || Number(form.price) < 0) return setError("Ingresa un precio válido")
    if (form.stock === "" || !Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) return setError("Ingresa un stock entero válido")

    const payload = {
      subCategory: form.subCategory,
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock)
    }
    if (form.image) payload.image = form.image
    onSave(payload)
  }

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <div className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="product-form-title">
        <div className="admin-modal-header">
          <div><span className="admin-eyebrow">Catálogo</span><h2 id="product-form-title">{product ? "Editar producto" : "Nuevo producto"}</h2></div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Cerrar"><X /></button>
        </div>
        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="admin-form-error">{error}</div>}
          <div className="admin-form-grid">
            <label>Nombre<input name="name" value={form.name} onChange={setField} maxLength={120} /></label>
            <label>Subcategoría<select name="subCategory" value={form.subCategory} onChange={setField}><option value="">Selecciona una subcategoría</option>{subCategories.map((item) => <option key={item._id} value={item._id}>{item.name}{item.category?.name ? ` - ${item.category.name}` : ""}</option>)}</select></label>
            <label className="admin-form-full">Descripción<textarea name="description" value={form.description} onChange={setField} rows={3} /></label>
            <label>Precio (COP)<input name="price" type="number" min="0" step="1" value={form.price} onChange={setField} /></label>
            <label>Existencias<input name="stock" type="number" min="0" step="1" value={form.stock} onChange={setField} /></label>
            <label className="admin-form-full">Imagen JPEG, PNG o WebP<input type="file" accept="image/jpeg,image/png,image/webp" onChange={readImage} /></label>
          </div>
          {form.image && <img className="admin-form-image-preview" src={form.image} alt="Vista previa del producto" />}
          <div className="admin-modal-actions">
            <button className="admin-button admin-button-secondary" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
            <button className="admin-button admin-button-primary" type="submit" disabled={saving}>{saving ? <><LoaderCircle className="spin" size={17} />Guardando...</> : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
