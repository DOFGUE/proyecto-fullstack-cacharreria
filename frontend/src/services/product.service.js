import api from "./api"

export const getProducts = async (params = {}) => {
  const response = await api.get("/products", { params })
  return {
    products: response.data,
    pagination: {
      total: Number(response.headers["x-total-count"] || response.data.length),
      page: Number(response.headers["x-page"] || params.page || 1),
      limit: Number(response.headers["x-limit"] || params.limit || response.data.length),
      totalPages: Number(response.headers["x-total-pages"] || 1)
    }
  }
}

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}
