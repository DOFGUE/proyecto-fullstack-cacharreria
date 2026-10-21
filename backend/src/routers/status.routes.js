import { Router } from "express"
import { getStatuses } from "../controllers/status.controller.js"

const router = Router()

router.get("/statuses", getStatuses)

export default router