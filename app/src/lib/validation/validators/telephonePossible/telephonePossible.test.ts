import { expect, test } from "@playwright/test"
import telephonePossible from "."

test("telephonePossible validator passes", async () => {
	const validator = telephonePossible({ getCountryCode: () => "US" })
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("5555555555")).toBe(true)
})

test("telephonePossible validator fails", async () => {
	const validator = telephonePossible({ getCountryCode: () => "US" })
	expect(validator.test("0")).toBe(false)
})