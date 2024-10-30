import { expect, test } from "vitest"
import { SelectOptions } from "."

const data = {
	a: undefined,
	b: 1,
	c: 4
}

test("select options validator test: passes", async () => {
	const validator = SelectOptions.init({ options: [1, 2, 3] })
	expect(await validator.test({ key: "a", data })).toBe(true) // Should pass when empty
	expect(await validator.test({ key: "b", data })).toBe(true)
})

test("select options validator test: fails", async () => {
	const validator = SelectOptions.init({ options: [1, 2, 3] })
	expect(await validator.test({ key: "c", data })).toBe(false)
})
