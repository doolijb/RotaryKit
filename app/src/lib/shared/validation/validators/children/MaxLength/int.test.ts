import { expect, test } from "vitest"
import { MaxLength } from "."

const data = {
	a: "",
	b: "test"
}

test("max length validator test: passes", async () => {
	const validator = MaxLength.init({ maxLen: 4 })
	expect(await validator.test({ key: "a", data })).toBe(true) // Should pass when empty
	expect(await validator.test({ key: "b", data })).toBe(true)
})

test("max length validator test: fails", async () => {
	const validator = MaxLength.init({ maxLen: 3 })
	expect(await validator.test({ key: "b", data })).toBe(false)
})
