import { expect, test } from "vitest"
import emailAddressComplete from "."

test("emailAddress validator passes", async () => {
	const validator = emailAddressComplete()
	expect(await validator.test("")).toBe(true) // Should pass when empty
	expect(await validator.test("john.doe@example.com")).toBe(true)
})

test("emailAddress validator fails", async () => {
	const validator = emailAddressComplete()
	expect(await validator.test("john.doe@example")).toBe(false)
})