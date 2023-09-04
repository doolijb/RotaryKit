import { expect, test } from "vitest"
import { LowerCaseIncluded } from "."

const data = {
	a: "",
	b: "tEST",
	c: "TEST"
}

test("lowercase included validator test: passes", async () => {
	const validator = LowerCaseIncluded.init()

	let result = await validator.test({ key: "a", data })
	expect(Object.keys(result)).toHaveLength(0)

	result = await validator.test({ key: "b", data })
	expect(result).toBe(true)
})

test("lowercase included complete validator test: fails", async () => {
	const validator = LowerCaseIncluded.init()

	const result = await validator.test({ key: "c", data })

	expect(result).toBe(false)
})
