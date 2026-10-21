import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { connectDB } from "./db.js"
import { PORT } from "./config.js"
import authRoutes from "./routers/auth.routes.js"
import productRoutes from "./routers/product.routes.js"
import categoryRoutes from "./routers/category.routes.js"
import subCategoryRoutes from "./routers/subCategory.routes.js"
import cartRoutes from "./routers/cart.routes.js"
import billRoutes from "./routers/bill.routes.js"
import statusRoutes from "./routers/status.routes.js"

const app = express()

app.use(morgan("dev"))
app.use(express.json({ limit: "20mb" }))
app.use(cookieParser())

await connectDB()

app.use("/api", authRoutes)
app.use("/api", productRoutes)
app.use("/api", categoryRoutes)
app.use("/api", subCategoryRoutes)
app.use("/api", cartRoutes)
app.use("/api", billRoutes)
app.use("/api", statusRoutes)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})