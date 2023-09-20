import { expect, test } from "@playwright/test"
import emailAddressComplete from "."

test("emailAddress validator passes", async () => {
	const validator = emailAddressComplete()
	expect(validator.test("")).toBe(true) // Should pass when empty
	expect(validator.test("john.doe@example.com")).toBe(true)
})

test("emailAddress validator fails", async () => {
	const validator = emailAddressComplete()
	expect(validator.test("john.doe@example")).toBe(false)
})