import { z } from "zod"

const addressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  city: z.string().min(1)
}).optional()

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  lastName: z.string().optional(),
  birthday: z.coerce.date().optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters long"),
  number: z.string().optional(),
  address: addressSchema
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters long")
})

export const updateUserSchema = z.object({
  username: z.string().min(1).optional(),
  lastName: z.string().optional(),
  birthday: z.coerce.date().optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(5, "Password must be at least 5 characters long").optional(),
  number: z.string().optional(),
  address: addressSchema
}).strict()