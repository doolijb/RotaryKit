import { expect, test } from "vitest"
import { AdminEditUserWithPermissions } from "."

const form = AdminEditUserWithPermissions.init()

test("AdminEditUserWithPermissions form test: passes", async () => {
	const data: FormDataOf<AdminEditUserWithPermissions> = {
		username: "testuser",
		isVerified: true,
		isActive: false,
		isAdmin: true,
		isSuperUser: false
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})

test("AdminEditUserWithPermissions form test: fails when username is not a valid username", async () => {
	const data = {
		username: "invalid username", // username is not a valid username
		isVerified: true,
		isActive: false,
		isAdmin: true,
		isSuperUser: false
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("username")
})

test("AdminEditUserWithPermissions form test: fails when isVerified is not a boolean", async () => {
	const data = {
		username: "testuser",
		isVerified: "true", // isVerified is not a boolean
		isActive: false,
		isAdmin: true,
		isSuperUser: false
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("isVerified")
})

test("AdminEditUserWithPermissions form test: fails when isActive is not a boolean", async () => {
	const data = {
		username: "testuser",
		isVerified: true,
		isActive: "false", // isActive is not a boolean
		isAdmin: true,
		isSuperUser: false
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("isActive")
})

test("AdminEditUserWithPermissions form test: fails when isAdmin is not a boolean", async () => {
	const data = {
		username: "testuser",
		isVerified: true,
		isActive: false,
		isAdmin: "true", // isAdmin is not a boolean
		isSuperUser: false
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("isAdmin")
})

test("AdminEditUserWithPermissions form test: fails when isSuperUser is not a boolean", async () => {
	const data = {
		username: "testuser",
		isVerified: true,
		isActive: false,
		isAdmin: true,
		isSuperUser: "false" // isSuperUser is not a boolean
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("isSuperUser")
})
