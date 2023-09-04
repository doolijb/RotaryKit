import { expect, test } from "vitest"
import { TelephoneValid } from "."

const data = {
	country: "US",
	a: "", // Empty string, should pass
	b: "5099999999", // Valid US phone number, should pass
	c: "509999999", // Only 9 digits, should fail
	d: "1234567890", // Invalid area code, should fail
	e: "9999999999" // Non-existent area code, should fail
}

test("TelephoneValid validator test: passes", async () => {
	const validator = TelephoneValid.init({ countryCodeKey: "country" })
	expect(await validator.test({ key: "a", data })).toBe(true) // Should pass when empty
	expect(await validator.test({ key: "b", data })).toBe(true)
})

test("TelephoneValid validator test: fails", async () => {
	const validator = TelephoneValid.init({ countryCodeKey: "country" })
	expect(await validator.test({ key: "c", data })).toBe(false)
	expect(await validator.test({ key: "d", data })).toBe(false)
	expect(await validator.test({ key: "e", data })).toBe(false)
})
