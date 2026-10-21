import { Router } from "express"
import { getProducts, getProduct, createProduct, createProducts, updateProduct, deleteProduct } from "../controllers/product.controller.js"
import { authRequired } from "../middlewares/validateToken.js"
import { adminRequired } from "../middlewares/admin.middleware.js"
import { validateSchema } from "../middlewares/validator.middleware.js"
import { bulkProductSchema, productSchema } from "../schema/product.schema.js"

const router = Router()

router.get("/products", getProducts)
router.get("/products/:id", getProduct)
router.post("/products", authRequired, adminRequired, validateSchema(productSchema), createProduct)
router.post("/products/bulk", authRequired, adminRequired, validateSchema(bulkProductSchema), createProducts)
router.put("/products/:id", authRequired, adminRequired, validateSchema(productSchema.partial()), updateProduct)
router.delete("/products/:id", authRequired, adminRequired, deleteProduct)

export default router