import { expect, test } from "vitest"
import lowercaseRequired from "."

test("lowercaseRequired validator test: passes", async () => {
	const validator = lowercaseRequired()
	expect(await validator.test("")).toBe(true) // Should pass when empty
	expect(await validator.test("test")).toBe(true)
})

test("lowercaseRequired validator test: fails", async () => {
	const validator = lowercaseRequired()
	expect(await validator.test("TEST")).toBe(false)
})