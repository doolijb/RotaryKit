import { expect, test } from "vitest"
import { MinLength } from "."

const data = {
	a: "",
	b: "test"
}

test("min length validator test: passes", async () => {
	const validator = MinLength.init({ minLen: 4 })
	expect(await validator.test({ key: "a", data })).toBe(true) // Should pass when empty, this is handled by the required validator
	expect(await validator.test({ key: "b", data })).toBe(true)
})

test("min length validator test: fails", async () => {
	const validator = MinLength.init({ minLen: 5 })
	expect(await validator.test({ key: "b", data })).toBe(false)
})
