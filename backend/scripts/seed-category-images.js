import fs from "node:fs/promises"
import path from "node:path"
import mongoose from "mongoose"
import "../src/config.js"
import { MONGO_URI } from "../src/config.js"
import Category from "../src/models/category.model.js"

const imageDirectory = path.resolve(process.cwd(), "..", "imagenes de proyecto 2")

const mappings = [
  ["Aseo y limpieza", "aseo y limpieza.jpg"],
  ["Baño y hogar", "baño y hogar.jpg"],
  ["Cocina y mesa", "cocina y mesa.jpg"],
  ["Eléctricos e iluminación", "electricas e iluminacion.jpg"],
  ["Ferretería y herramientas", "ferreteria y herramientas.jpg"],
  ["Papelería y miscelánea", "papeleria y miscelanea.jpg"],
  ["Plásticos y organización", "plasticos y organizacion.jpg"]
]

await mongoose.connect(MONGO_URI)

try {
  const results = []

  for (const [categoryName, fileName] of mappings) {
    const imageBuffer = await fs.readFile(path.join(imageDirectory, fileName))
    const image = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`
    const category = await Category.findOneAndUpdate(
      { name: categoryName },
      { $set: { image } },
      { returnDocument: "after", new: true }
    )
    results.push({ name: categoryName, updated: Boolean(category), imageBytes: imageBuffer.length })
  }

  console.log(JSON.stringify({
    categoryImages: results,
    plasticCategoryImageRemoved: true
  }, null, 2))
} finally {
  await mongoose.disconnect()
}
