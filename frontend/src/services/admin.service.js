import api from "./api"

export const createProduct = async (data) => {
  const response = await api.post("/products", data)
  return response.data
}

export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data)
  return response.data
}

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}

export const createCategory = async (data) => {
  const response = await api.post("/categories", data)
  return response.data
}

export const updateCategory = async (id, data) => {
  const response = await api.put(`/categories/${id}`, data)
  return response.data
}

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`)
  return response.data
}

export const createSubCategory = async (data) => {
  const response = await api.post("/subcategories", data)
  return response.data
}

export const updateSubCategory = async (id, data) => {
  const response = await api.put(`/subcategories/${id}`, data)
  return response.data
}

export const deleteSubCategory = async (id) => {
  const response = await api.delete(`/subcategories/${id}`)
  return response.data
}
