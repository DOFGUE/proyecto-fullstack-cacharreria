process.env.NODE_ENV = "test"

const [{ default: mongoose }, { MONGO_URI }, { assertTestDatabase }] =
  await Promise.all([
    import("mongoose"),
    import("../src/config.js"),
    import("../src/test-db.guard.js")
  ])

const databaseName = assertTestDatabase(MONGO_URI)
const marker = "phase6-test-fixture"

await mongoose.connect(MONGO_URI)
const db = mongoose.connection.db

for (const name of ["cartitems", "carts", "users", "addresses", "items", "subcategories", "categories", "roles", "status"]) {
  await db.collection(name).deleteMany({ testMarker: marker })
}

console.log(`Phase 6 fixtures removed only from database "${databaseName}".`)
await mongoose.disconnect()
