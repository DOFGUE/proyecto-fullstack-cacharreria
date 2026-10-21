import { z } from "zod"

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid status id")

export const createBillSchema = z.object({
  description: z.string().trim().optional()
}).strict()

export const updateBillStatusSchema = z.object({
  status: objectId
}).strict()