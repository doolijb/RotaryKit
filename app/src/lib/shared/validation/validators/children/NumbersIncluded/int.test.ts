import { expect, test } from "vitest"
import { NumbersIncluded } from "."

const data = {
	a: "",
	b: "a1b2c3",
}

test("numbers included validator test: passes", async () => {
	const validator = NumbersIncluded.init({ count: 3 })
	expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
	expect(await validator.test({key:"b", data})).toBe(true)
})

test("numbers included validator test: fails", async () => {
	const validator = NumbersIncluded.init({ count: 4 })
	expect(await validator.test({key:"b", data})).toBe(false)
})