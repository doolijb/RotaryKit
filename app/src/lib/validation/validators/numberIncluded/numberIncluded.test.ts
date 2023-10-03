import { expect, test } from "vitest"
import numberIncluded from "."

test("numberIncluded validator test passes", async () => {
	const validator = numberIncluded({ count: 3})
	expect(await validator.test("")).toBe(true) // Should pass when empty
	expect(await validator.test("a1b2c3")).toBe(true)
})

test("numberIncluded validator test fails", async () => {
	const validator = numberIncluded({ count: 4})
	expect(await validator.test("a1b2c3")).toBe(false)
})