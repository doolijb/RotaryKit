import { expect, test } from "vitest"
import matches from "./matches"

const data = {
	a: "test",
	b: "TEST",
}

test("matches validator test: passes", async () => {
	const validator = matches({ matchingField: "a" })
	expect( await validator.test({key:"a", data})).toBe(true)
})

test("matches validator test: fails", async () => {
	const validator = matches({ matchingField: "a" })
	expect( await validator.test({key:"b", data})).toBe(false)
})