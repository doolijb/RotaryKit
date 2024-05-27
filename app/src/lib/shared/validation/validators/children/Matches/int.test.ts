import { expect, test } from "vitest"
import { Matches } from "."

const data = {
	a: "test",
	b: "TEST",
}

test("matches validator test: passes", async () => {
	const validator = Matches.init({matchingField:"a"})

	const result = await validator.test({key:"a", data})

	expect(result).toBe(true)
})

test("matches validator test: fails", async () => {
	const validator = Matches.init({matchingField:"a"})

	const result = await validator.test({key:"b", data})
	
	expect(result).toBe(false)
})