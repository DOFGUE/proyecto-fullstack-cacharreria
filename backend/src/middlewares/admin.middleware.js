import User from "../models/user.model.js"

export const adminRequired = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("role")
    if (!user || user.role?.name !== "admin") {
      return res.status(403).json({ message: "Administrator permissions required" })
    }
    next()
  } catch (error) {
    res.status(500).json({ message: "Could not verify permissions" })
  }
}