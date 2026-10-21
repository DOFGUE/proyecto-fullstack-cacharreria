import mongoose from "mongoose"
import Cart from "../models/cart.model.js"
import CartItem from "../models/cartItem.model.js"
import Item from "../models/item.model.js"

const getOrCreateCart = (userId) => Cart.findOneAndUpdate(
  { user: userId },
  { $setOnInsert: { user: userId } },
  { new: true, upsert: true, setDefaultsOnInsert: true }
)

const updateCartTotal = async (cartId) => {
  const items = await CartItem.find({ cart: cartId })
  const price = items.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0)
  return Cart.findByIdAndUpdate(cartId, { price }, { new: true, runValidators: true })
}

const cartResponse = async (cart) => {
  const items = await CartItem.find({ cart: cart._id }).populate("item")
  return { cart, items }
}

const invalidId = (id) => !mongoose.Types.ObjectId.isValid(id)

export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id)
    return res.json(await cartResponse(cart))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const addCartItem = async (req, res) => {
  try {
    const product = await Item.findById(req.body.item)
    if (!product) return res.status(404).json({ message: "Product not found" })

    const cart = await getOrCreateCart(req.user.id)
    const existingItem = await CartItem.findOne({ cart: cart._id, item: product._id })
    const quantity = (existingItem?.quantity ?? 0) + req.body.quantity
    if (quantity > product.stock) {
      return res.status(409).json({ message: "Insufficient product stock" })
    }

    if (existingItem) {
      existingItem.quantity = quantity
      existingItem.price = product.price
      await existingItem.save()
    } else {
      await CartItem.create({ cart: cart._id, item: product._id, price: product.price, quantity })
    }

    const updatedCart = await updateCartTotal(cart._id)
    return res.status(201).json(await cartResponse(updatedCart))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const updateCartItem = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid cart item id" })
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    const cartItem = await CartItem.findOne({ _id: req.params.id, cart: cart._id }).populate("item")
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" })
    if (!cartItem.item) return res.status(404).json({ message: "Product not found" })
    if (req.body.quantity > cartItem.item.stock) {
      return res.status(409).json({ message: "Insufficient product stock" })
    }

    cartItem.quantity = req.body.quantity
    cartItem.price = cartItem.item.price
    await cartItem.save()
    const updatedCart = await updateCartTotal(cart._id)
    return res.json(await cartResponse(updatedCart))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteCartItem = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid cart item id" })
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    const deletedItem = await CartItem.findOneAndDelete({ _id: req.params.id, cart: cart._id })
    if (!deletedItem) return res.status(404).json({ message: "Cart item not found" })
    const updatedCart = await updateCartTotal(cart._id)
    return res.json(await cartResponse(updatedCart))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
    if (!cart) return res.status(404).json({ message: "Cart not found" })
    await CartItem.deleteMany({ cart: cart._id })
    const updatedCart = await updateCartTotal(cart._id)
    return res.json(await cartResponse(updatedCart))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}