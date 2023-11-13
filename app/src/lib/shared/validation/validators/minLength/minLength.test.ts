import { expect, test } from "vitest"
import minLength from "."

test("minLength validator test: passes", async () => {
	const validator = minLength({ minLen: 4 })
	expect(await validator.test("")).toBe(true) // Should pass when empty
	expect(await validator.test("test")).toBe(true)
})

test("minLength validator test: fails", async () => {
	const validator = minLength({ minLen: 5 })
	expect(await validator.test("test")).toBe(false)
})