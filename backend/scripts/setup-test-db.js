process.env.NODE_ENV = "test"

const [{ default: mongoose }, { default: bcrypt }, { MONGO_URI }, { assertTestDatabase }] =
  await Promise.all([
    import("mongoose"),
    import("bcrypt"),
    import("../src/config.js"),
    import("../src/test-db.guard.js")
  ])

const databaseName = assertTestDatabase(MONGO_URI)
const marker = "phase6-test-fixture"

await mongoose.connect(MONGO_URI)

const db = mongoose.connection.db
const collections = {
  roles: db.collection("roles"),
  users: db.collection("users"),
  addresses: db.collection("addresses"),
  categories: db.collection("categories"),
  subcategories: db.collection("subcategories"),
  items: db.collection("items"),
  carts: db.collection("carts"),
  cartitems: db.collection("cartitems"),
  statuses: db.collection("status")
}

await collections.statuses.bulkWrite([
  "en tienda",
  "enviado",
  "entregado"
].map((name) => ({
  updateOne: {
    filter: { name },
    update: { $setOnInsert: { name, testMarker: marker } },
    upsert: true
  }
})))

await collections.roles.bulkWrite([
  { name: "user" },
  { name: "admin" }
].map(({ name }) => ({
  updateOne: {
    filter: { name },
    update: { $setOnInsert: { name, testMarker: marker } },
    upsert: true
  }
})))

const roles = await collections.roles.find({
  name: { $in: ["user", "admin"] },
  testMarker: marker
}).toArray()
const roleByName = new Map(roles.map((role) => [role.name, role._id]))

const categoryId = new mongoose.Types.ObjectId("660000000000000000000001")
const subCategoryId = new mongoose.Types.ObjectId("660000000000000000000002")
const normalUserId = new mongoose.Types.ObjectId("660000000000000000000003")
const adminUserId = new mongoose.Types.ObjectId("660000000000000000000004")
const normalCartId = new mongoose.Types.ObjectId("660000000000000000000005")
const productOneId = new mongoose.Types.ObjectId("660000000000000000000006")
const productTwoId = new mongoose.Types.ObjectId("660000000000000000000007")

await collections.categories.updateOne(
  { testMarker: marker, name: "Categoria prueba" },
  { $setOnInsert: { _id: categoryId, name: "Categoria prueba", description: "Datos aislados de pruebas.", testMarker: marker } },
  { upsert: true }
)
await collections.subcategories.updateOne(
  { testMarker: marker, name: "Subcategoria prueba" },
  { $setOnInsert: { _id: subCategoryId, name: "Subcategoria prueba", description: "Datos aislados de pruebas.", category: categoryId, testMarker: marker } },
  { upsert: true }
)

await collections.items.bulkWrite([
  { _id: productOneId, name: "Producto prueba uno", price: 1000, stock: 10 },
  { _id: productTwoId, name: "Producto prueba dos", price: 2000, stock: 3 }
].map((product) => ({
  updateOne: {
    filter: { testMarker: marker, name: product.name },
    update: { $setOnInsert: {
      _id: product._id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      subCategory: subCategoryId,
      description: "Producto generado exclusivamente para pruebas.",
      testMarker: marker
    } },
    upsert: true
  }
})))

const testUsers = [
  { email: "test-user@local.invalid", username: "Usuario prueba", role: "user", passwordEnv: "TEST_USER_PASSWORD", id: normalUserId },
  { email: "test-admin@local.invalid", username: "Administrador prueba", role: "admin", passwordEnv: "TEST_ADMIN_PASSWORD", id: adminUserId }
]

for (const fixture of testUsers) {
  const existing = await collections.users.findOne({ testMarker: marker, email: fixture.email })
  if (existing) continue

  const password = process.env[fixture.passwordEnv]
  if (!password) {
    throw new Error(`${fixture.passwordEnv} is required when creating the fixture user "${fixture.email}".`)
  }

  await collections.users.updateOne(
    { testMarker: marker, email: fixture.email },
    { $setOnInsert: {
      _id: fixture.id,
      username: fixture.username,
      email: fixture.email,
      password: await bcrypt.hash(password, 10),
      role: roleByName.get(fixture.role),
      testMarker: marker
    } },
    { upsert: true }
  )
}

await collections.carts.updateOne(
  { testMarker: marker },
  { $setOnInsert: { _id: normalCartId, user: normalUserId, price: 1000, testMarker: marker } },
  { upsert: true }
)
await collections.cartitems.updateOne(
  { testMarker: marker },
  { $setOnInsert: {
    _id: new mongoose.Types.ObjectId("660000000000000000000008"),
    cart: normalCartId,
    item: productOneId,
    price: 1000,
    quantity: 1,
    testMarker: marker
  } },
  { upsert: true }
)

console.log(`Test fixtures created in database "${databaseName}".`)

await mongoose.disconnect()
