import mongoose from "mongoose"
import Category from "../models/category.model.js"
import SubCategory from "../models/subCategory.model.js"

const invalidId = (id) => !mongoose.Types.ObjectId.isValid(id)

export const getCategories = async (req, res) => {
  try {
    return res.json(await Category.find().sort({ name: 1 }))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getCategory = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid category id" })
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: "Category not found" })
    return res.json(category)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const createCategory = async (req, res) => {
  try {
    return res.status(201).json(await Category.create(req.body))
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Category already exists" })
    return res.status(500).json({ message: error.message })
  }
}

export const updateCategory = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid category id" })
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!category) return res.status(404).json({ message: "Category not found" })
    return res.json(category)
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: "Category already exists" })
    return res.status(500).json({ message: error.message })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid category id" })
    if (await SubCategory.exists({ category: req.params.id })) {
      return res.status(409).json({ message: "Category has subcategories and cannot be deleted" })
    }
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ message: "Category not found" })
    return res.json({ message: "Category deleted successfully", category })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}