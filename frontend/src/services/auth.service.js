import api from "./api"

export const register = async (data) => {
  const response = await api.post("/register", data)
  return response.data
}

export const login = async (data) => {
  const response = await api.post("/login", data)
  return response.data
}

export const logout = async () => {
  await api.post("/logout")
}

export const getProfile = async () => {
  const response = await api.get("/profile")
  return response.data
}

export const updateProfile = async (data) => {
  const response = await api.patch("/profile", data)
  return response.data
}
