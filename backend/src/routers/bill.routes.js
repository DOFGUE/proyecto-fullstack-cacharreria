import { Router } from "express"
import { createBill, getBills, getBill, updateBillStatus } from "../controllers/bill.controller.js"
import { authRequired } from "../middlewares/validateToken.js"
import { adminRequired } from "../middlewares/admin.middleware.js"
import { validateSchema } from "../middlewares/validator.middleware.js"
import { createBillSchema, updateBillStatusSchema } from "../schema/bill.schema.js"

const router = Router()

router.post("/bills", authRequired, validateSchema(createBillSchema), createBill)
router.get("/bills", authRequired, getBills)
router.get("/bills/:id", authRequired, getBill)
router.patch("/bills/:id/status", authRequired, adminRequired, validateSchema(updateBillStatusSchema), updateBillStatus)

export default router