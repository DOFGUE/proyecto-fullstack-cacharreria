import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import * as cartService from "../services/cart.service"
import { useAuth } from "./AuthContext"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated, initializing } = useAuth()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null)
      return null
    }
    setLoading(true)
    setError("")
    try {
      const response = await cartService.getCart()
      setCart(response)
      return response
    } catch (requestError) {
      setError(requestError.response?.data?.message || "No fue posible cargar el carrito.")
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!initializing) refreshCart().catch(() => {})
  }, [initializing, refreshCart])

  const updateFromResponse = (response) => {
    setCart(response)
    return response
  }

  const value = useMemo(() => ({
    cart,
    items: cart?.items || [],
    loading,
    error,
    itemCount: (cart?.items || []).reduce((total, item) => total + item.quantity, 0),
    total: cart?.cart?.price || 0,
    refreshCart,
    addItem: async (item, quantity = 1) => updateFromResponse(await cartService.addCartItem(item, quantity)),
    updateItem: async (id, quantity) => updateFromResponse(await cartService.updateCartItem(id, quantity)),
    removeItem: async (id) => updateFromResponse(await cartService.deleteCartItem(id)),
    clear: async () => updateFromResponse(await cartService.clearCart())
  }), [cart, error, loading, refreshCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
