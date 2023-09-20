import { expect, test } from "vitest"
import telephonePossible from "."

test("telephonePossible validator passes", async () => {
	const validator = telephonePossible({ getCountryCode: () => "US" })
	expect(await validator.test("")).toBe(true) // Should pass when empty
	expect(await validator.test("5555555555")).toBe(true)
})

test("telephonePossible validator fails", async () => {
	const validator = telephonePossible({ getCountryCode: () => "US" })
	expect(await validator.test("0")).toBe(false)
})