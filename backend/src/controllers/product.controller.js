import Item from "../models/item.model.js"
import mongoose from "mongoose"
import SubCategory from "../models/subCategory.model.js"
import "../models/category.model.js"
import "../models/subCategory.model.js"
import Bill from "../models/bill.model.js"
import CartItem from "../models/cartItem.model.js"
import Status from "../models/status.model.js"

const invalidId = (id) => !mongoose.Types.ObjectId.isValid(id)

const validateSubCategories = async (products) => {
  const ids = [...new Set(products.map((product) => product.subCategory))]
  const subCategories = await SubCategory.find({ _id: { $in: ids } }, { _id: 1 })
  return subCategories.length === ids.length
}

export const getProducts = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 100)
    const filter = {}

    if (req.query.subCategory) {
      if (invalidId(req.query.subCategory)) return res.status(400).json({ message: "Invalid subcategory id" })
      filter.subCategory = req.query.subCategory
    }

    if (req.query.name) {
      const escapedName = req.query.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      filter.name = { $regex: escapedName, $options: "i" }
    }

    if (req.query.category) {
      if (invalidId(req.query.category)) return res.status(400).json({ message: "Invalid category id" })
      const subCategories = await SubCategory.find({ category: req.query.category }, { _id: 1 })
      filter.subCategory = { $in: subCategories.map(({ _id }) => _id) }
    }

    if (req.query.available === "true") filter.stock = { $gt: 0 }
    if (req.query.available === "false") filter.stock = 0

    const [products, total] = await Promise.all([
      Item.find(filter)
        .populate({ path: "subCategory", populate: "category" })
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Item.countDocuments(filter)
    ])
    res.set({
      "X-Total-Count": String(total),
      "X-Page": String(page),
      "X-Limit": String(limit),
      "X-Total-Pages": String(Math.ceil(total / limit))
    })
    return res.json(products)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getProduct = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid product id" })
    const product = await Item.findById(req.params.id).populate({ path: "subCategory", populate: "category" })
    if (!product) return res.status(404).json({ message: "Product not found" })
    return res.json(product)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getOffers = async (req, res) => {
  try {
    const products = await Item.find({ discountPercent: { $gt: 0 }, stock: { $gt: 0 } })
      .populate({ path: "subCategory", populate: "category" })
      .sort({ discountPercent: -1, createdAt: -1 })
      .limit(100)
    return res.json(products)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getBestSellers = async (req, res) => {
  try {
    const deliveredStatus = await Status.findOne({ name: "entregado" })
    if (!deliveredStatus) return res.json([])

    const bills = await Bill.find({ status: deliveredStatus._id })
      .select("cartItems")
      .lean()

    const cartItemIds = bills.flatMap((bill) => bill.cartItems)
    if (!cartItemIds.length) return res.json([])

    const quantities = await CartItem.aggregate([
      { $match: { _id: { $in: cartItemIds } } },
      { $group: { _id: "$item", sold: { $sum: "$quantity" } } },
      { $sort: { sold: -1 } },
      { $limit: 100 }
    ])

    if (!quantities.length) return res.json([])

    const products = await Item.find({ _id: { $in: quantities.map((entry) => entry._id) } })
      .populate({ path: "subCategory", populate: "category" })

    const soldByProduct = new Map(quantities.map((entry) => [String(entry._id), entry.sold]))
    const ranked = products
      .map((product) => ({
        ...product.toObject(),
        soldQuantity: soldByProduct.get(String(product._id)) || 0
      }))
      .sort((a, b) => b.soldQuantity - a.soldQuantity)

    return res.json(ranked)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const createProduct = async (req, res) => {
  try {
    if (!await validateSubCategories([req.body])) {
      return res.status(404).json({ message: "Subcategory not found" })
    }
    return res.status(201).json(await Item.create(req.body))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const createProducts = async (req, res) => {
  try {
    if (!await validateSubCategories(req.body.products)) {
      return res.status(404).json({ message: "One or more subcategories were not found" })
    }
    const products = await Item.insertMany(req.body.products)
    return res.status(201).json({ count: products.length, products })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid product id" })
    const product = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ message: "Product not found" })
    return res.json(product)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid product id" })
    const product = await Item.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: "Product not found" })
    return res.json({ message: "Product deleted successfully", product })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}