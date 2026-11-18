import { AlertCircle, LoaderCircle, PackageOpen } from "lucide-react"

export function LoadingState({ label = "Cargando información..." }) {
  return <div className="async-state"><LoaderCircle className="spin" /><p>{label}</p></div>
}

export function ErrorState({ message, onRetry }) {
  return <div className="async-state error-state"><AlertCircle /><strong>No se pudo cargar la información</strong><p>{message || "Intenta nuevamente en unos minutos."}</p>{onRetry && <button className="button button-outline" type="button" onClick={onRetry}>Intentar de nuevo</button>}</div>
}

export function EmptyState({ message = "No hay productos disponibles." }) {
  return <div className="async-state"><PackageOpen /><strong>{message}</strong></div>
}
