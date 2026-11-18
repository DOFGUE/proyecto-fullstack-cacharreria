import api from "./api"

export const getSubCategories = async () => {
  const response = await api.get("/subcategories")
  return response.data
}
