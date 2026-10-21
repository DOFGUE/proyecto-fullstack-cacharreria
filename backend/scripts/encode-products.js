import fs from "node:fs/promises"
import path from "node:path"

const mimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
}

const [metadataArgument = "data/products.json", outputArgument = "data/products-payload.json"] = process.argv.slice(2)
const metadataPath = path.resolve(process.cwd(), metadataArgument)
const outputPath = path.resolve(process.cwd(), outputArgument)

const metadata = JSON.parse(await fs.readFile(metadataPath, "utf8"))
if (!Array.isArray(metadata) || metadata.length === 0) {
  throw new Error("The metadata file must contain a non-empty JSON array")
}

const products = await Promise.all(metadata.map(async (product, index) => {
  const requiredFields = ["imageFile", "subCategory", "name", "price", "stock"]
  const missingField = requiredFields.find((field) => product[field] === undefined)
  if (missingField) {
    throw new Error(`Product ${index + 1} is missing the field: ${missingField}`)
  }

  const imagePath = path.resolve(process.cwd(), "data/images", product.imageFile)
  const extension = path.extname(product.imageFile).toLowerCase()
  const mimeType = mimeTypes[extension]
  if (!mimeType) {
    throw new Error(`Unsupported image format for ${product.imageFile}. Use JPG, PNG, or WebP`)
  }

  const imageBuffer = await fs.readFile(imagePath)
  const image = `data:${mimeType};base64,${imageBuffer.toString("base64")}`
  const { imageFile, ...productData } = product
  return { ...productData, image }
}))

await fs.mkdir(path.dirname(outputPath), { recursive: true })
await fs.writeFile(outputPath, `${JSON.stringify({ products }, null, 2)}\n`)
console.log(`Created ${products.length} products in ${path.relative(process.cwd(), outputPath)}`)
