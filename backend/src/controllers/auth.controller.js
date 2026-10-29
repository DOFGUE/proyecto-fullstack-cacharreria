import bcrypt from "bcrypt"
import User from "../models/user.model.js"
import Role from "../models/role.model.js"
import Address from "../models/address.model.js"
import Cart from "../models/cart.model.js"
import CartItem from "../models/cartItem.model.js"
import { createAccessToken } from "../libs/jwt.js"

const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000
}

const expiredCookieOptions = { ...cookieOptions, maxAge: 0, expires: new Date(0) }

const publicUser = (user) => ({
  id: user._id,
  username: user.username,
  lastName: user.lastName,
  birthday: user.birthday,
  email: user.email,
  number: user.number,
  address: user.address,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
})

const setSession = async (res, user) => {
  const token = await createAccessToken({ id: user._id.toString() })
  res.setHeader("Authorization", `Bearer ${token}`)
  res.cookie("token", token, cookieOptions)
}

export const register = async (req, res) => {
  const { address, password, ...userData } = req.body
  try {
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) return res.status(409).json({ message: "Email already registered" })

    let role = await Role.findOne({ name: "user" })
    if (!role) role = await Role.create({ name: "user" })

    const user = await User.create({
      ...userData,
      password: await bcrypt.hash(password, 10),
      role: role._id
    })

    if (address) {
      const savedAddress = await Address.create({ ...address, user: user._id })
      user.address = savedAddress._id
      await user.save()
    }

    await setSession(res, user)
    return res.status(201).json(publicUser(await User.findById(user._id).populate("role").populate("address")))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email }).populate("role").populate("address")
    if (!user) return res.status(400).json({ message: "User not found" })
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid password" })
    }
    await setSession(res, user)
    return res.json(publicUser(user))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const logout = (req, res) => {
  res.cookie("token", "", expiredCookieOptions)
  return res.sendStatus(200)
}

export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("role").populate("address")
    if (!user) return res.status(404).json({ message: "User not found" })
    return res.json(publicUser(user))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const updateProfile = async (req, res) => {
  const { address, password, ...userData } = req.body
  try {
    if (userData.email) {
      const emailOwner = await User.findOne({ email: userData.email, _id: { $ne: req.user.id } })
      if (emailOwner) return res.status(409).json({ message: "Email already registered" })
    }
    if (password) userData.password = await bcrypt.hash(password, 10)

    const user = await User.findByIdAndUpdate(req.user.id, userData, { new: true, runValidators: true })
    if (!user) return res.status(404).json({ message: "User not found" })
    if (address) {
      await Address.findOneAndUpdate({ user: user._id }, { ...address, user: user._id }, { upsert: true, new: true })
      user.address = (await Address.findOne({ user: user._id }))._id
      await user.save()
    }
    return res.json(publicUser(await User.findById(user._id).populate("role").populate("address")))
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" })
    const carts = await Cart.find({ user: user._id }, { _id: 1 })
    await CartItem.deleteMany({ cart: { $in: carts.map((cart) => cart._id) } })
    await Cart.deleteMany({ user: user._id })
    await Address.findOneAndDelete({ user: user._id })
    res.cookie("token", "", expiredCookieOptions)
    return res.json({ message: "User deleted successfully" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
