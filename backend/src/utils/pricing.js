export const getDiscountedPrice = (price, discountPercent = 0) => {
  const originalPrice = Number(price) || 0
  const discount = Math.min(Math.max(Number(discountPercent) || 0, 0), 100)
  return Math.round(originalPrice * (1 - discount / 100))
}
