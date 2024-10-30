import { expect, test } from "vitest"
import { UpperCaseIncluded } from "."

const data = {
	a: "",
	b: "TEST",
	c: "test"
}

test("UpperCaseIncluded validator test: passes", async () => {
	const validator = UpperCaseIncluded.init({ countryCodeKey: "country" })
	expect(await validator.test({ key: "a", data })).toBe(true) // Should pass when empty
	expect(await validator.test({ key: "b", data })).toBe(true)
})

test("UpperCaseIncluded validator test: fails", async () => {
	const validator = UpperCaseIncluded.init({ countryCodeKey: "country" })
	expect(await validator.test({ key: "c", data })).toBe(false)
})
