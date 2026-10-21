import mongoose from "mongoose"

const statusSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true }
})

export default mongoose.model("Status", statusSchema)