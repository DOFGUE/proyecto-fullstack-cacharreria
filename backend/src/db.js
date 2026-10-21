import mongoose from "mongoose"
import Status from "./models/status.model.js"
import { MONGO_URI } from "./config.js"

const defaultStatuses = ["en tienda", "enviado", "entregado"]

const seedStatuses = async () => {
  await Status.bulkWrite(defaultStatuses.map((name) => ({
    updateOne: {
      filter: { name },
      update: { $setOnInsert: { name } },
      upsert: true
    }
  })))
}

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    await seedStatuses()
    console.log("DB is connected")
  } catch (error) {
    console.error(error.message)
    process.exit(1) 
  }
}