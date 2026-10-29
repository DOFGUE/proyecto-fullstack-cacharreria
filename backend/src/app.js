import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import cors from "cors"
import mongoose from "mongoose"
import { FRONTEND_ORIGINS } from "./config.js"
import authRoutes from "./routers/auth.routes.js"
import productRoutes from "./routers/product.routes.js"
import categoryRoutes from "./routers/category.routes.js"
import subCategoryRoutes from "./routers/subCategory.routes.js"
import cartRoutes from "./routers/cart.routes.js"
import billRoutes from "./routers/bill.routes.js"
import statusRoutes from "./routers/status.routes.js"

export const createApp = () => {
  const app = express()

  app.use(helmet())
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || FRONTEND_ORIGINS.includes(origin)) return callback(null, true)
      return callback(new Error("Origin is not allowed by CORS"))
    },
    credentials: true
  }))
  app.use(morgan("dev"))
  app.use(express.json({ limit: "20mb" }))
  app.use(cookieParser())

  app.get("/health", (_req, res) => res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  }))

  app.use("/api", authRoutes)
  app.use("/api", productRoutes)
  app.use("/api", categoryRoutes)
  app.use("/api", subCategoryRoutes)
  app.use("/api", cartRoutes)
  app.use("/api", billRoutes)
  app.use("/api", statusRoutes)

  app.use((error, _req, res, next) => {
    if (error.message === "Origin is not allowed by CORS") {
      return res.status(403).json({ message: error.message })
    }
    return next(error)
  })

  return app
}
