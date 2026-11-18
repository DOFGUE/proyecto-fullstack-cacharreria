import api from "./api"

export const createBill = async (description) => (await api.post("/bills", description ? { description } : {})).data
export const getBills = async () => (await api.get("/bills")).data
export const getBill = async (id) => (await api.get(`/bills/${id}`)).data
export const getStatuses = async () => (await api.get("/statuses")).data
