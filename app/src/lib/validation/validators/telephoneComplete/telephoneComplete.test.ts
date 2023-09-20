import { expect, test } from "vitest"
import telephoneComplete from "."

test("telephoneComplete validator passes", async () => {
	const validator = telephoneComplete({ getCountryCode: () => "US" })
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("5098187327")).toBe(true)
})

test("telephoneComplete validator fails", async () => {
	const validator = telephoneComplete({ getCountryCode: () => "US" })
	expect(validator.test("2223334444")).toBe(false)
})