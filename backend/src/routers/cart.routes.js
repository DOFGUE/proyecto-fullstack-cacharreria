import { Router } from "express"
import {
  getCart,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart
} from "../controllers/cart.controller.js"
import { authRequired } from "../middlewares/validateToken.js"
import { validateSchema } from "../middlewares/validator.middleware.js"
import { addCartItemSchema, updateCartItemSchema } from "../schema/cart.schema.js"

const router = Router()

router.get("/cart", authRequired, getCart)
router.post("/cart/items", authRequired, validateSchema(addCartItemSchema), addCartItem)
router.put("/cart/items/:id", authRequired, validateSchema(updateCartItemSchema), updateCartItem)
router.delete("/cart/items/:id", authRequired, deleteCartItem)
router.delete("/cart", authRequired, clearCart)

export default router