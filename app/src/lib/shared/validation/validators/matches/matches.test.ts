import { expect, test } from "vitest"
import matches from "."

test("matches validator test: passes", async () => {
	const validator = matches({ getValue: () => "test" });
	expect( await validator.test("test")).toBe(true)
})

test("matches validator test: fails", async () => {
	const validator = matches({ getValue: () => "test" })
	expect( await validator.test("test2")).toBe(false)
})