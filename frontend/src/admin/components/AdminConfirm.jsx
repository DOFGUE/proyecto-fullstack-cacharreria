import { AlertTriangle, X } from "lucide-react"

export default function AdminConfirm({ open, title, message, confirmLabel = "Eliminar", loading, onConfirm, onClose }) {
  if (!open) return null
  return (
    <div className="admin-modal-backdrop" role="presentation">
      <div className="admin-confirm" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <button className="admin-modal-close" type="button" onClick={onClose} disabled={loading} aria-label="Cerrar"><X /></button>
        <span className="admin-confirm-icon"><AlertTriangle /></span>
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="admin-modal-actions">
          <button className="admin-button admin-button-secondary" type="button" onClick={onClose} disabled={loading}>Cancelar</button>
          <button className="admin-button admin-button-danger" type="button" onClick={onConfirm} disabled={loading}>{loading ? "Eliminando..." : confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
