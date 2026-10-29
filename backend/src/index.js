import http from "node:http"
import mongoose from "mongoose"
import { connectDB } from "./db.js"
import { PORT } from "./config.js"
import { createApp } from "./app.js"

await connectDB()

const server = http.createServer(createApp())

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})

const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down`)
  await new Promise((resolve) => server.close(resolve))
  await mongoose.disconnect()
  process.exit(0)
}

process.once("SIGINT", shutdown)
process.once("SIGTERM", shutdown)
