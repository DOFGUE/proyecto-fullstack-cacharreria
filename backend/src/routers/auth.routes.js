import { Router } from "express"
import { register, login, logout, profile, updateProfile, deleteProfile } from "../controllers/auth.controller.js"
import { authRequired } from "../middlewares/validateToken.js"
import { validateSchema } from "../middlewares/validator.middleware.js"
import { registerSchema, loginSchema, updateUserSchema } from "../schema/auth.schema.js"

const router = Router()

router.post("/register", validateSchema(registerSchema), register)
router.post("/login", validateSchema(loginSchema), login)
router.post("/logout", logout)
router.get("/profile", authRequired, profile)
router.patch("/profile", authRequired, validateSchema(updateUserSchema), updateProfile)
router.delete("/profile", authRequired, deleteProfile)

export default router