import test from "node:test"
import assert from "node:assert/strict"
import request from "supertest"
import { createApp } from "../src/app.js"

test("GET /health reports the API status", async () => {
  const response = await request(createApp()).get("/health")

  assert.equal(response.status, 200)
  assert.equal(response.body.status, "ok")
  assert.equal(response.body.database, "disconnected")
})

test("unknown API routes return a not found response", async () => {
  const response = await request(createApp()).get("/api/unknown")

  assert.equal(response.status, 404)
})
