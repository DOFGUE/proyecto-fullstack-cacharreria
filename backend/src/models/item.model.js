import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, trim: true },
  stock: { type: Number, required: true, min: 0, default: 0 }
}, { timestamps: true })

export default mongoose.model("Item", itemSchema)