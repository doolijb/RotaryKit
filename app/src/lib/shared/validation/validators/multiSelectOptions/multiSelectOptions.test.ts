import { expect, test } from "vitest"
import multiSelectOptions from "."

test("multiSelectOptions validator test: passes", async () => {
	const validator = multiSelectOptions({ options: [1,2,3] })
	expect(await validator.test([])).toBe(true) // Should pass when empty
	expect(await validator.test([1,3])).toBe(true)
})

test("multiSelectOptions validator test: fails", async () => {
	const validator = multiSelectOptions({ options: [1,2,3] })
	expect(await validator.test([1,4])).toBe(false)
})