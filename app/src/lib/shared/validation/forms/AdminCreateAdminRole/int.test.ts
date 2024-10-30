import { expect, test } from "vitest"
import { AdminCreateAdminRole } from "."

const form = AdminCreateAdminRole.init()

test("AdminCreateAdminRole form test: passes", async () => {
	const data: FormDataOf<AdminCreateAdminRole> = {
		name: "Admin",
		adminPermissions: [1, 2, 3]
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})

test("AdminCreateAdminRole form test: fails when name is too short", async () => {
	const data = {
		name: "Ad", // Name is too short
		adminPermissions: [1, 2, 3]
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("name")
})

test("AdminCreateAdminRole form test: fails when adminPermissions is not an array", async () => {
	const data = {
		name: "Admin",
		adminPermissions: "1,2,3" // adminPermissions is not an array
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("adminPermissions")
})

test("AdminCreateAdminRole form test: passes when adminPermissions is an empty array", async () => {
	const data = {
		name: "Admin",
		adminPermissions: [] // adminPermissions is an empty array
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})
