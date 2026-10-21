import mongoose from "mongoose"

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  price: { type: Number, min: 0, default: 0 }
}, { timestamps: true })

export default mongoose.model("Cart", cartSchema)