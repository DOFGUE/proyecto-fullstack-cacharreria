export const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f4f3ef'/%3E%3Cpath d='M320 350h160v-90H320z' fill='%23f4a62a'/%3E%3Ccircle cx='350' cy='235' r='28' fill='%23173f35'/%3E%3Ccircle cx='450' cy='235' r='28' fill='%23173f35'/%3E%3Ctext x='400' y='440' fill='%23173f35' font-family='Arial' font-size='28' text-anchor='middle'%3ESin imagen%3C/text%3E%3C/svg%3E"

export const getId = (value) => value?._id || value?.id || value

export const normalizeProduct = (product) => {
  const subCategory = product.subCategory || {}
  const category = subCategory.category || {}
  return {
    ...product,
    id: product._id,
    category: category.name || "Sin categoría",
    categoryId: getId(category),
    subCategoryName: subCategory.name || "Sin subcategoría",
    subCategoryId: getId(subCategory),
    image: product.image || FALLBACK_IMAGE,
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0
  }
}

export const getErrorMessage = (error) => {
  if (!error.response) return "No fue posible conectar con la tienda. Intenta nuevamente en unos minutos."
  const status = error.response.status
  const serverMessage = String(error.response.data?.message || "").toLowerCase()

  if (serverMessage.includes("invalid password")) return "La contraseña ingresada no es correcta."
  if (serverMessage.includes("user not found")) return "No existe una cuenta registrada con ese correo."
  if (serverMessage.includes("insufficient product stock")) return "La cantidad solicitada supera las existencias disponibles."
  if (serverMessage.includes("cart is empty")) return "Tu carrito está vacío."
  if (serverMessage.includes("unavailable product")) return "Uno de los productos ya no está disponible."
  if (serverMessage.includes("category has subcategories")) return "La categoría no puede eliminarse porque tiene subcategorías relacionadas."
  if (serverMessage.includes("subcategory has products")) return "La subcategoría no puede eliminarse porque tiene productos asociados."
  if (serverMessage.includes("category already exists")) return "Ya existe una categoría con ese nombre."
  if (serverMessage.includes("email already registered")) return "Ese correo electrónico ya está registrado."
  if (serverMessage.includes("subcategory not found")) return "La subcategoría seleccionada no está disponible."
  if (serverMessage.includes("product not found")) return "El producto no está disponible."
  if (serverMessage.includes("cart item not found")) return "El producto ya no está en tu carrito."
  if (serverMessage.includes("bill not found")) return "No se encontró el pedido solicitado."
  if (serverMessage.includes("transaction numbers")) return "La compra no pudo completarse en este momento. Intenta nuevamente más tarde."

  if (Array.isArray(error.response.data?.error)) return "Revisa los datos ingresados y vuelve a intentarlo."
  if (status === 400) return "Revisa los datos ingresados y vuelve a intentarlo."
  if (status === 401) return "Tu sesión ya no está disponible. Inicia sesión nuevamente."
  if (status === 403) return "No tienes permisos para realizar esta acción."
  if (status === 404) return "La información solicitada no está disponible."
  if (status === 409) return error.response.data?.message || "Esta información está relacionada con otros datos y no puede modificarse."
  if (status >= 500) return "Ocurrió un problema temporal en la tienda. Intenta nuevamente en unos minutos."
  return error.response.data?.message || "No fue posible completar la solicitud."
}

export const formatPrice = (value) => new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
}).format(Number(value) || 0)
