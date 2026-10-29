export const validateSchema = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body)
    next()
  } catch (error) {
    return res.status(400).json({ error: error.issues?.map((item) => item.message) ?? ["Invalid request body"] })
  }
}