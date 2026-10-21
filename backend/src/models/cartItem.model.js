import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema({
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1, default: 1 }
}, { timestamps: true })

cartItemSchema.index({ cart: 1, item: 1 }, { unique: true })

export default mongoose.model("CartItem", cartItemSchema)