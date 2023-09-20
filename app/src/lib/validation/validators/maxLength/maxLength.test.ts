import { expect, test } from "vitest"
import maxLength from "."

test("maxLength validator passes", async () => {
	const validator = maxLength({ maxLen: 4 })
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("test")).toBe(true)
})

test("maxLength validator fails", async () => {
	const validator = maxLength({ maxLen: 3 })
	expect(validator.test("test")).toBe(false)
})
