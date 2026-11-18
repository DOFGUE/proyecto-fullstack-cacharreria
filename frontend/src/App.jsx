import { Toaster } from "react-hot-toast"
import AppRouter from "./routes/AppRouter"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"

export default function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
          <Toaster position="bottom-right" />
        </CartProvider>
      </AuthProvider>
    </>
  )
}
