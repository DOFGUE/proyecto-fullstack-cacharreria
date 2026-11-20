import { z } from "zod"

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid subcategory id")
const dataUrl = z.string()
  .max(2000000, "Image must be smaller than 1.5 MB")
  .regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/, "Image must be a valid JPEG, PNG, or WebP Data URL")

export const productSchema = z.object({
  subCategory: objectId,
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  image: dataUrl.optional(),
  stock: z.coerce.number().int().min(0)
}).strict()

export const bulkProductSchema = z.object({
  products: z.array(productSchema).min(1, "At least one product is required").max(100, "Maximum 100 products per request")
}).strict()