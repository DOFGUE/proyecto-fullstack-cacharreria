import { Router } from "express"
import {
  getSubCategories,
  getSubCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory
} from "../controllers/subCategory.controller.js"
import { authRequired } from "../middlewares/validateToken.js"
import { adminRequired } from "../middlewares/admin.middleware.js"
import { validateSchema } from "../middlewares/validator.middleware.js"
import { subCategorySchema } from "../schema/subCategory.schema.js"

const router = Router()

router.get("/subcategories", getSubCategories)
router.get("/subcategories/:id", getSubCategory)
router.post("/subcategories", authRequired, adminRequired, validateSchema(subCategorySchema), createSubCategory)
router.put("/subcategories/:id", authRequired, adminRequired, validateSchema(subCategorySchema.partial()), updateSubCategory)
router.delete("/subcategories/:id", authRequired, adminRequired, deleteSubCategory)

export default router