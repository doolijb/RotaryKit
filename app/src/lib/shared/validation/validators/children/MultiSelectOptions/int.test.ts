import { expect, test } from "vitest"
import { MultiSelectOptions } from "."

const data = {
	a: [],
	b: [1,2],
	c: [1,4],
}

test("multi select options validator test: passes", async () => {
	const validator = MultiSelectOptions.init({ options: [1,2,3] })
	expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
	expect(await validator.test({key:"b", data})).toBe(true)
})

test("multi select options validator test: fails", async () => {
	const validator = MultiSelectOptions.init({ options: [1,2,3] })
	expect(await validator.test({key:"c", data})).toBe(false)
})