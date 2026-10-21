import mongoose from "mongoose"
import Category from "../models/category.model.js"
import SubCategory from "../models/subCategory.model.js"
import Item from "../models/item.model.js"

const invalidId = (id) => !mongoose.Types.ObjectId.isValid(id)

export const getSubCategories = async (req, res) => {
  try {
    return res.json(await SubCategory.find().populate("category").sort({ name: 1 }))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getSubCategory = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid subcategory id" })
    const subCategory = await SubCategory.findById(req.params.id).populate("category")
    if (!subCategory) return res.status(404).json({ message: "Subcategory not found" })
    return res.json(subCategory)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const createSubCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(404).json({ message: "Category not found" })
    return res.status(201).json(await SubCategory.create(req.body))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const updateSubCategory = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid subcategory id" })
    if (req.body.category) {
      const category = await Category.findById(req.body.category)
      if (!category) return res.status(404).json({ message: "Category not found" })
    }
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("category")
    if (!subCategory) return res.status(404).json({ message: "Subcategory not found" })
    return res.json(subCategory)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteSubCategory = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid subcategory id" })
    if (await Item.exists({ subCategory: req.params.id })) {
      return res.status(409).json({ message: "Subcategory has products and cannot be deleted" })
    }
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id)
    if (!subCategory) return res.status(404).json({ message: "Subcategory not found" })
    return res.json({ message: "Subcategory deleted successfully", subCategory })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}