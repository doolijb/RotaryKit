import { expect, test } from "vitest"
import maxLength from "."

test("maxLength validator test passes", async () => {
	const validator = maxLength({ maxLen: 4 })
	expect(await validator.test("")).toBe(true) // Should pass when empty
	expect(await validator.test("test")).toBe(true)
})

test("maxLength validator test fails", async () => {
	const validator = maxLength({ maxLen: 3 })
	expect(await validator.test("test")).toBe(false)
})
