import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { assertTestDatabase } from "../src/test-db.guard.js"

test("test database guard accepts an exact _test database name", () => {
  assert.equal(
    assertTestDatabase("mongodb://127.0.0.1:27017/proyecto_cacharreria_test?replicaSet=rs0"),
    "proyecto_cacharreria_test"
  )
})

test("test database guard rejects the production database", () => {
  assert.throws(
    () => assertTestDatabase("mongodb://127.0.0.1:27017/proyecto_cacharreria?replicaSet=rs0"),
    /Refusing test operation/
  )
})

test("test database guard rejects a URI without a database name", () => {
  assert.throws(
    () => assertTestDatabase("mongodb://127.0.0.1:27017/?replicaSet=rs0"),
    /explicit database name/
  )
})

test("setup uses insert-only upserts and skips existing test users", async () => {
  const source = await readFile(new URL("../scripts/setup-test-db.js", import.meta.url), "utf8")

  assert.doesNotMatch(source, /\$set\s*:/)
  assert.match(source, /findOne\(\{ testMarker: marker, email: fixture\.email \}\)/)
  assert.match(source, /if \(existing\) continue/)
  assert.ok((source.match(/\$setOnInsert/g) || []).length >= 8)
})
