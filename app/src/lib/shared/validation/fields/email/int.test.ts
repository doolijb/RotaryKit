import { expect, test } from "vitest"
import { email } from "."

const field = email()

test("email field validation: passes", async () => {
	const data = {
		email: "jack.sparrow@example.com"
	}
	const errors = await field.validate({ key: "email", data })
	expect(errors).toEqual({})
})

test("Email field validation: fails", async () => {
	const data = {
		email: "jack.sparrow"
	}
	const errors = await field.validate({ key: "email", data })
	expect(errors).toHaveProperty("emailAddressValid")
})
