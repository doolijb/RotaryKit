import type { RequestEvent } from "@sveltejs/kit"
import { adminApi, error, messageError, validateForm } from "@requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "@database"
import { utils, forms } from "@validation"
import { emails, users } from "@providers"
import { and, eq, inArray } from "drizzle-orm"

/**
 * Admin view for a list of users
 */
async function GET(event: RequestEvent): Promise<SelectUser> {
	// Check if user is authorized to view users
	// TODO

	const columns: { [key: string]: boolean } = {
		id: true,
		name: true,
		createdAt: true,
		updatedAt: true
	}

	const availableRelations: AvailableRelations<SelectAdminRole> = {
		toAdminPermissions: {
			columns: {},
			with: {
				adminPermission: {
					columns: {
						id: true,
						name: true,
						action: true,
						resource: true
					}
				}
			}
		},
		toUsers: {
			columns: {},
			with: {
				user: {
					columns: {
						id: true,
						username: true
					}
				}
			}
		}
	}

	const result = await db.query.adminRoles.findFirst({
		columns,
		where: (u, { eq }) => eq(u.id, event.params.resourceId),
		with: availableRelations
	})

	if (!result) {
		throw messageError("Not found", 404)
	}

	return result
}

/**
 * @param event
 */
async function PUT(event: RequestEvent): Promise<SelectUser> {
	// Check if user is authorized to edit
	// TODO

	////
	// FORM VALIDATION
	////

	// Create the form
	const form = utils.formValidator({ definitions: forms.adminEditAdminRole })

	// Validate the data, this will automatically throw an error if the data is invalid
	await validateForm({ form, data: event.locals.data })

	////
	// UPDATE ADMIN ROLE
	////

	const setUserData = {}

	const originalAdminRole = await db.query.adminRoles.findFirst({
		where: (u, { eq }) => eq(u.id, event.params.resourceId),
		with: {
			toAdminPermissions: {
				with: {
					adminPermission: true
				}
			}
		}
	})

	const roleEdited = originalAdminRole.name !== event.locals.data.name
	let newAdminPermissions: { adminRoleId: string; adminPermissionId: string }[] = []
	let deletedAdminPermissionIds: string[] = []

	// Populate the new admin permissions
	Object.values(event.locals.data.adminPermissions).forEach((adminPermission: string) => {
		if (
			!originalAdminRole.toAdminPermissions.find(
				(originalAdminPermission) => originalAdminPermission.adminPermissionId === adminPermission
			)
		) {
			newAdminPermissions.push({
				adminRoleId: event.params.resourceId,
				adminPermissionId: adminPermission
			})
		}
	})

	// Populate the deleted admin permissions
	Object.values(originalAdminRole.toAdminPermissions).forEach((toAdminPermission) => {
		if (!event.locals.data.adminPermissions.includes(toAdminPermission.adminPermissionId)) {
			deletedAdminPermissionIds.push(toAdminPermission.adminPermissionId)
		}
	})

	await db.transaction(async (tx) => {
		// Update the admin role
		if (roleEdited) {
			await tx
				.update(schema.adminRoles)
				.set({ name: event.locals.data.name })
				.where(eq(schema.adminRoles.id, event.params.resourceId))
		}

		// Add new admin permissions
		if (newAdminPermissions.length > 0) {
			await tx.insert(schema.adminRolesToPermissions).values(newAdminPermissions)
		}

		// Delete admin permissions
		if (deletedAdminPermissionIds.length > 0) {
			await tx
				.delete(schema.adminRolesToPermissions)
				.where(
					and(
						eq(schema.adminRolesToPermissions.adminRoleId, event.params.resourceId),
						inArray(schema.adminRolesToPermissions.adminPermissionId, deletedAdminPermissionIds)
					)
				)
		}
	})

	// Return
	return {
		success: true
	}
}

/**
 * @param event
 */
async function DELETE(event: RequestEvent): Promise<{ success: true }> {
	// Check if user is authorized to delete
	// TODO

	////
	// DELETE ADMIN PERMISSION
	////

	await db.transaction(async (tx) => {
		await tx.delete(schema.adminRoles).where(eq(schema.adminRoles.id, event.params.resourceId))
	})

	// Return
	return {
		success: true
	}
}

export default {
	GET,
	PUT,
	DELETE
}
