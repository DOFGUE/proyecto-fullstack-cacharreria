import { useEffect, useState } from "react"
import { LoaderCircle, X } from "lucide-react"

export default function AdminEntityForm({ open, title, entity, fields, saving, onSave, onClose }) {
  const [form, setForm] = useState({})
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) return
    setError("")
    setForm(Object.fromEntries(fields.map((field) => [field.name, entity?.[field.name] || ""])))
  }, [open, entity])

  if (!open) return null

  const handleSubmit = (event) => {
    event.preventDefault()
    for (const field of fields) {
      if (field.required && !String(form[field.name] || "").trim()) {
        setError(field.requiredMessage || `${field.label} es obligatorio`)
        return
      }
    }
    setError("")
    onSave(Object.fromEntries(fields.map((field) => [field.name, typeof form[field.name] === "string" ? form[field.name].trim() : form[field.name]])))
  }

  return (
    <div className="admin-modal-backdrop" role="presentation">
      <div className="admin-modal admin-modal-small" role="dialog" aria-modal="true" aria-labelledby="entity-form-title">
        <div className="admin-modal-header">
          <div><span className="admin-eyebrow">Administración</span><h2 id="entity-form-title">{title}</h2></div>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Cerrar"><X /></button>
        </div>
        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          {error && <div className="admin-form-error">{error}</div>}
          <div className="admin-form-grid">
            {fields.map((field) => (
              <label className={field.full ? "admin-form-full" : ""} key={field.name}>
                {field.label}
                {field.type === "select" ? (
                  <select value={form[field.name] || ""} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))}>
                    <option value="">Selecciona una opción</option>
                    {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea value={form[field.name] || ""} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))} rows={4} />
                ) : (
                  <input value={form[field.name] || ""} onChange={(event) => setForm((current) => ({ ...current, [field.name]: event.target.value }))} />
                )}
              </label>
            ))}
          </div>
          <div className="admin-modal-actions">
            <button className="admin-button admin-button-secondary" type="button" onClick={onClose} disabled={saving}>Cancelar</button>
            <button className="admin-button admin-button-primary" type="submit" disabled={saving}>{saving ? <><LoaderCircle className="spin" size={17} />Guardando...</> : "Guardar"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
