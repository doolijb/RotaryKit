import { expect, test } from "vitest"
import { AdminEditAdminRole } from "."

const form = AdminEditAdminRole.init()

test("AdminEditAdminRole form test: passes", async () => {
	const data: FormDataOf<AdminEditAdminRole> = {
		name: "AdminRole",
		adminPermissions: ["permission1", "permission2"]
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})

test("AdminEditAdminRole form test: fails when name is too short", async () => {
	const data = {
		name: "Ad", // name is too short
		adminPermissions: ["permission1", "permission2"]
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("name")
})

test("AdminEditAdminRole form test: fails when name is too long", async () => {
	const data = {
		name: "A".repeat(21), // name is too long
		adminPermissions: ["permission1", "permission2"]
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("name")
})

test("AdminEditAdminRole form test: fails when adminPermissions is not an array", async () => {
	const data = {
		name: "AdminRole",
		adminPermissions: "permission1" // adminPermissions is not an array
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("adminPermissions")
})
