import { Navigate, Outlet, useLocation } from "react-router-dom"
import { LoadingState } from "../components/common/AsyncState"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute() {
  const { initializing, isAuthenticated } = useAuth()
  const location = useLocation()
  if (initializing) return <LoadingState label="Comprobando tu sesión..." />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
