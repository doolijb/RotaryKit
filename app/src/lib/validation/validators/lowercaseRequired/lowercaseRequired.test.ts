import { expect, test } from "vitest"
import lowercaseRequired from "."

test("lowercaseRequired validator passes", async () => {
	const validator = lowercaseRequired()
	expect(await validator.test("")).toBe(true) // Should pass when empty
	expect(await validator.test("test")).toBe(true)
})

test("lowercaseRequired validator fails", async () => {
	const validator = lowercaseRequired()
	expect(await validator.test("TEST")).toBe(false)
})