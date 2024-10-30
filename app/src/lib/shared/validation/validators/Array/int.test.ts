import { expect, test } from "vitest"
import { Array } from "."

const data = {
	a: [],
	b: [1],
	c: "what is love?"
}

test("array validator test: passes", async () => {
	const validator = Array.init()

	let result = await validator.validate({ key: "a", data })
	expect(Object.keys(result)).toHaveLength(0)

	result = await validator.validate({ key: "b", data })
	expect(Object.keys(result)).toHaveLength(0)
})

test("array validator test: fails", async () => {
	const validator = Array.init()

	const result = await validator.validate({ key: "c", data })

	expect(Object.keys(result)).toHaveLength(1)
})
