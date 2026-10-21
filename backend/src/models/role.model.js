import mongoose from "mongoose"

const roleSchema = new mongoose.Schema({
  name: { type: String, enum: ["user", "admin"], unique: true, required: true }
})

export default mongoose.model("Role", roleSchema)