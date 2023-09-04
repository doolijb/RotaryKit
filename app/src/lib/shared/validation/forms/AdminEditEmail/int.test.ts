import { expect, test } from "vitest"
import { AdminEditEmail } from "."

const form = AdminEditEmail.init()

test("AdminEditEmail form test: passes", async () => {
	const data: FormDataOf<AdminEditEmail> = {
		address: "test@example.com",
		isVerified: true,
		isUserPrimary: false
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})

test("AdminEditEmail form test: fails when address is not a valid email", async () => {
	const data = {
		address: "invalid email", // address is not a valid email
		isVerified: true,
		isUserPrimary: false
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("address")
})

test("AdminEditEmail form test: fails when isVerified is not a boolean", async () => {
	const data = {
		address: "test@example.com",
		isVerified: "true", // isVerified is not a boolean
		isUserPrimary: false
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("isVerified")
})

test("AdminEditEmail form test: fails when isUserPrimary is not a boolean", async () => {
	const data = {
		address: "test@example.com",
		isVerified: true,
		isUserPrimary: "false" // isUserPrimary is not a boolean
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("isUserPrimary")
})
