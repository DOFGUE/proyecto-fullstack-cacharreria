import { Router } from "express"
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/category.controller.js"
import { authRequired } from "../middlewares/validateToken.js"
import { adminRequired } from "../middlewares/admin.middleware.js"
import { validateSchema } from "../middlewares/validator.middleware.js"
import { categorySchema } from "../schema/category.schema.js"

const router = Router()

router.get("/categories", getCategories)
router.get("/categories/:id", getCategory)
router.post("/categories", authRequired, adminRequired, validateSchema(categorySchema), createCategory)
router.put("/categories/:id", authRequired, adminRequired, validateSchema(categorySchema.partial()), updateCategory)
router.delete("/categories/:id", authRequired, adminRequired, deleteCategory)

export default router