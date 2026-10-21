import mongoose from "mongoose"

const billSchema = new mongoose.Schema({
  cartItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "CartItem" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: mongoose.Schema.Types.ObjectId, ref: "Status", required: true },
  date: { type: Date, default: Date.now },
  description: { type: String, trim: true }
}, { timestamps: true })

export default mongoose.model("Bill", billSchema)