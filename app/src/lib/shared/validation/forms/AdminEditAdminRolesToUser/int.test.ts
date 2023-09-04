import { expect, test } from "vitest"
import { AdminEditAdminRolesToUser } from "."

const form = AdminEditAdminRolesToUser.init()

test("AdminEditAdminRolesToUser form test: passes", async () => {
	const data: FormDataOf<AdminEditAdminRolesToUser> = {
		adminRoles: ["role1", "role2"]
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})

test("AdminEditAdminRolesToUser form test: fails when adminRoles is not an array", async () => {
	const data = {
		adminRoles: "role1" // adminRoles is not an array
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("adminRoles")
})

test("AdminEditAdminRolesToUser form test: passes when adminRoles is an empty array", async () => {
	const data = {
		adminRoles: [] // adminRoles is an empty array
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})
