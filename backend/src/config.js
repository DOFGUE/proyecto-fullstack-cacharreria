import "dotenv/config"

if (!process.env.TOKEN_SECRET) {
	throw new Error("TOKEN_SECRET is required in the environment")
}

if (!process.env.MONGO_URI) {
	throw new Error("MONGO_URI is required in the environment")
}

export const TOKEN_SECRET = process.env.TOKEN_SECRET
export const MONGO_URI = process.env.MONGO_URI
export const PORT = Number(process.env.PORT) || 4000
export const NODE_ENV = process.env.NODE_ENV || "development"
export const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || "http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)