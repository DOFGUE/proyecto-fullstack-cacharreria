import { z } from "zod"

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid item id")

export const addCartItemSchema = z.object({
  item: objectId,
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1")
}).strict()

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1")
}).strict()