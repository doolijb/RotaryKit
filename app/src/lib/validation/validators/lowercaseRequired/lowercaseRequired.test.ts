import { expect, test } from "vitest"
import lowercaseRequired from "."

test("lowercaseRequired validator passes", async () => {
	const validator = lowercaseRequired()
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("test")).toBe(true)
})

test("lowercaseRequired validator fails", async () => {
	const validator = lowercaseRequired()
	expect(validator.test("TEST")).toBe(false)
})