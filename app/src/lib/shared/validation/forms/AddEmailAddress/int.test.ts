import { expect, test } from "vitest"
import { AddEmailAddress } from "."

const form = AddEmailAddress.init()

test("AddEmailAddress form test: passes", async () => {
	const data: AddEmailAddress["Data"] = {
		email: "testuser@example.com"
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})

test("AddEmailAddress form test: fails when email is not a valid email", async () => {
	const data = {
		email: "invalid email" // email is not a valid emai
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("email")
})
