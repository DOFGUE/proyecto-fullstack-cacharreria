import mongoose from "mongoose"
import Bill from "../models/bill.model.js"
import Cart from "../models/cart.model.js"
import CartItem from "../models/cartItem.model.js"
import Item from "../models/item.model.js"
import Status from "../models/status.model.js"

const nextStatus = {
  "en tienda": "enviado",
  enviado: "entregado"
}

const billPopulate = (query) => query
  .populate("status")
  .populate({ path: "cartItems", populate: "item" })

const invalidId = (id) => !mongoose.Types.ObjectId.isValid(id)

export const createBill = async (req, res) => {
  const session = await mongoose.startSession()
  try {
    let billId
    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: req.user.id }).session(session)
      if (!cart) {
        const error = new Error("Cart not found")
        error.status = 404
        throw error
      }

      const cartItems = await CartItem.find({ cart: cart._id }).populate("item").session(session)
      if (!cartItems.length) {
        const error = new Error("Cart is empty")
        error.status = 400
        throw error
      }
      if (cartItems.some((cartItem) => !cartItem.item)) {
        const error = new Error("Cart contains an unavailable product")
        error.status = 409
        throw error
      }
      if (cartItems.some((cartItem) => cartItem.quantity > cartItem.item.stock)) {
        const error = new Error("Insufficient product stock")
        error.status = 409
        throw error
      }

      const status = await Status.findOne({ name: "en tienda" }).session(session)
      if (!status) {
        const error = new Error("Initial order status not found")
        error.status = 500
        throw error
      }

      const stockUpdates = cartItems.map((cartItem) => ({
        updateOne: {
          filter: { _id: cartItem.item._id, stock: { $gte: cartItem.quantity } },
          update: { $inc: { stock: -cartItem.quantity } }
        }
      }))
      const stockResult = await Item.bulkWrite(stockUpdates, { session })
      if (stockResult.modifiedCount !== cartItems.length) {
        const error = new Error("Product stock changed, try again")
        error.status = 409
        throw error
      }

      const [bill] = await Bill.create([{
        cartItems: cartItems.map((cartItem) => cartItem._id),
        user: req.user.id,
        status: status._id,
        description: req.body.description
      }], { session })
      billId = bill._id

      await Cart.deleteOne({ _id: cart._id }).session(session)
      await Cart.create([{ user: req.user.id }], { session })
    })

    return res.status(201).json(await billPopulate(Bill.findById(billId)))
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message })
  } finally {
    await session.endSession()
  }
}

export const getBills = async (req, res) => {
  try {
    return res.json(await billPopulate(Bill.find({ user: req.user.id }).sort({ date: -1 })))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getBill = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid bill id" })
    const bill = await billPopulate(Bill.findOne({ _id: req.params.id, user: req.user.id }))
    if (!bill) return res.status(404).json({ message: "Bill not found" })
    return res.json(bill)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const updateBillStatus = async (req, res) => {
  try {
    if (invalidId(req.params.id)) return res.status(400).json({ message: "Invalid bill id" })
    const status = await Status.findById(req.body.status)
    if (!status) return res.status(404).json({ message: "Status not found" })
    const bill = await Bill.findById(req.params.id).populate("status")
    if (!bill) return res.status(404).json({ message: "Bill not found" })
    if (bill.status?.name === status.name) {
      return res.status(409).json({ message: "Bill already has this status" })
    }
    if (nextStatus[bill.status?.name] !== status.name) {
      return res.status(409).json({ message: "Invalid status transition" })
    }

    bill.status = status._id
    await bill.save()
    return res.json(await billPopulate(Bill.findById(bill._id)))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}