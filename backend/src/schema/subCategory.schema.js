import { z } from "zod"

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category id")

export const subCategorySchema = z.object({
  category: objectId,
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().optional()
}).strict()