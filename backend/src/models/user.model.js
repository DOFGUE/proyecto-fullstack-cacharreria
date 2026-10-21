import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  lastName: { type: String, trim: true },
  birthday: { type: Date },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
  number: { type: String, trim: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }
}, { timestamps: true })

export default mongoose.model("User", userSchema)