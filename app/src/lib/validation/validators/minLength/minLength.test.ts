import { expect, test } from "vitest"
import minLength from "."

test("minLength validator passes", async () => {
	const validator = minLength({ minLen: 4 })
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("test")).toBe(true)
})

test("minLength validator fails", async () => {
	const validator = minLength({ minLen: 5 })
	expect(validator.test("test")).toBe(false)
})