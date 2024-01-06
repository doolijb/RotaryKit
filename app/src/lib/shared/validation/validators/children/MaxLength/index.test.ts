import { expect, test } from "vitest"
import maxLength from "."

const data = {
	a: "",
	b: "test",
}

test("maxLength validator test: passes", async () => {
	const validator = maxLength({ maxLen: 4 })
	expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
	expect(await validator.test({key:"b", data})).toBe(true)
})

test("maxLength validator test: fails", async () => {
	const validator = maxLength({ maxLen: 3 })
	expect(await validator.test({key:"b", data})).toBe(false)
})
