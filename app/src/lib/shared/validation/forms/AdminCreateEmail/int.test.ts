import { expect, test } from "vitest"
import { AdminCreateEmail } from "."

const form = AdminCreateEmail.init()

test("AdminCreateEmail form test: passes", async () => {
	const data: FormDataOf<AdminCreateEmail> = {
		address: "test@example.com",
		isVerified: true,
		isUserPrimary: false
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})

test("AdminCreateEmail form test: fails when address is not an email", async () => {
	const data = {
		address: "not an email", // address is not an email
		isVerified: true,
		isUserPrimary: false
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("address")
})

test("AdminCreateEmail form test: fails when isVerified is not a boolean", async () => {
	const data = {
		address: "test@example.com",
		isVerified: "true", // isVerified is not a boolean
		isUserPrimary: false
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("isVerified")
})

test("AdminCreateEmail form test: fails when isUserPrimary is not a boolean", async () => {
	const data = {
		address: "test@example.com",
		isVerified: true,
		isUserPrimary: "false" // isUserPrimary is not a boolean
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("isUserPrimary")
})
