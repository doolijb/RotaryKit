import { expect, test } from "vitest"
import telephoneComplete from "."

test("telephoneComplete validator test passes", async () => {
	const validator = telephoneComplete({ getCountryCode: () => "US" })
	expect(await validator.test("")).toBe(true) // Should pass when empty
	expect(await validator.test("5098187327")).toBe(true)
})

test("telephoneComplete validator test fails", async () => {
	const validator = telephoneComplete({ getCountryCode: () => "US" })
	expect(await validator.test("2223334444")).toBe(false)
})