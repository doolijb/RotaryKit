import { expect, test } from "vitest"
import { AdminCreateUserWithPermissions } from "."

const form = AdminCreateUserWithPermissions.init()

test("AdminCreateUserWithPermissions form test: passes", async () => {
	const data: FormDataOf<AdminCreateUserWithPermissions> = {
		username: "testuser",
		email: "test@example.com",
		passphrase: "securePassphrase123!",
		isVerified: true,
		isAdmin: false,
		isSuperUser: false
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})

test("AdminCreateUserWithPermissions form test: fails when isAdmin is not a boolean", async () => {
	const data = {
		username: "testuser",
		email: "test@example.com",
		passphrase: "securePassphrase123!",
		isVerified: true,
		isAdmin: "false", // isAdmin is not a boolean
		isSuperUser: false
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("isAdmin")
})

test("AdminCreateUserWithPermissions form test: fails when isSuperUser is not a boolean", async () => {
	const data = {
		username: "testuser",
		email: "test@example.com",
		passphrase: "securePassphrase123!",
		isVerified: true,
		isAdmin: false,
		isSuperUser: "false" // isSuperUser is not a boolean
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("isSuperUser")
})

test("AdminCreateUserWithPermissions form test: passes when email is not provided", async () => {
	const data = {
		username: "testuser",
		passphrase: "securePassphrase123!",
		isVerified: true,
		isAdmin: false,
		isSuperUser: false
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})
