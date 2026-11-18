import api from "./api"

export const getCart = async () => (await api.get("/cart")).data
export const addCartItem = async (item, quantity) => (await api.post("/cart/items", { item, quantity })).data
export const updateCartItem = async (id, quantity) => (await api.put(`/cart/items/${id}`, { quantity })).data
export const deleteCartItem = async (id) => (await api.delete(`/cart/items/${id}`)).data
export const clearCart = async () => (await api.delete("/cart")).data
