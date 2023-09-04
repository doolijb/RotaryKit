import { expect, test } from "vitest"
import { Number } from "."

const data = {
	a: "123",
	b: 123,
	c: "what is love?"
}

test("number primitive validator test: passes", async () => {
	const validator = Number.init()

	let result = await validator.validate({ key: "a", data })
	expect(Object.keys(result)).toHaveLength(0)

	result = await validator.validate({ key: "b", data })
	expect(Object.keys(result)).toHaveLength(0)
})

test("number primitive validator test: fails", async () => {
	const validator = Number.init()

	const result = await validator.validate({ key: "c", data })

	expect(Object.keys(result)).toHaveLength(1)
})
