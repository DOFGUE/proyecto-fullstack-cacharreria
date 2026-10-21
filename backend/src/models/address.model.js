import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  street: { type: String, required: true, trim: true },
  number: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true }
}, { timestamps: true })

export default mongoose.model("Address", addressSchema)