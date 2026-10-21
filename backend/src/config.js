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