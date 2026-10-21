import Status from "../models/status.model.js"

export const getStatuses = async (req, res) => {
  try {
    return res.json(await Status.find().sort({ _id: 1 }))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}