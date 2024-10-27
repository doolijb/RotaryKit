import { hasAdminPermission, validateData } from "$server/requests"
import { db, schema } from "$server/database"
import { and, eq, inArray } from "drizzle-orm"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { InternalServerError, Ok, BadRequest, NotFound } from "sveltekit-zero-api/http"
import { AdminCreateAdminRole as PostForm } from "$shared/validation/forms"
import { logger } from "$server/logging"

const postForm = PostForm.init()

interface Get {
    body: undefined,
    params: {
        resourceId: string,
    }
}

interface Put {
    body: PostForm['Data']
}

interface Delete {
    body: undefined,
    params: {
        resourceId: string,
    }
}

/**
 * Admin view for a list of admin roles
 */
export async function GET(event: KitEvent<Get, RequestEvent>) {
	try {
		
		// Check permissions
        hasAdminPermission(event, schema.adminRoles)

		const columns: { [key: string]: boolean } = {
			id: true,
			name: true,
			createdAt: true,
			updatedAt: true
		}

		const availableRelations: AvailableRelations = {
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
			return NotFound()
		}

		return Ok({ body: result })
	} catch (err) {
		logger.exception(err, event)
		return InternalServerError()
	}
}

/**
 * @param event
 */
export async function PUT(event: KitEvent<Put, RequestEvent>) {
	try {
		// Check if user is authorized to edit
		// TODO

		////
		// Validate the data
		////

		const { data, errors } = await validateData({ form: postForm, event})
		if (errors.keys) return BadRequest({ body: { errors } })

		////
		// UPDATE ADMIN ROLE
		////

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

		const roleEdited = originalAdminRole.name !== data.name
		const newAdminPermissions: { adminRoleId: string; adminPermissionId: string }[] = []
		const deletedAdminPermissionIds: string[] = []

		// Populate the new admin permissions
		Object.values(data.adminPermissions).forEach((adminPermission: string) => {
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
			if (!data.adminPermissions.includes(toAdminPermission.adminPermissionId)) {
				deletedAdminPermissionIds.push(toAdminPermission.adminPermissionId)
			}
		})

		await db.transaction(async (tx) => {
			// Update the admin role
			if (roleEdited) {
				await tx
					.update(schema.adminRoles)
					.set({ name: data.name, updatedAt: new Date() } as Partial<InsertAdminRole>)
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
		return Ok()
	} catch (err) {
		logger.exception(err, event)
		return InternalServerError()
	}
}

/**
 * @param event
 */
export async function DELETE(event: KitEvent<Delete, RequestEvent>) {
	try {
		// Check if user is authorized to delete
		// TODO

		////
		// DELETE ADMIN PERMISSION
		////

		await db.delete(schema.adminRoles).where(eq(schema.adminRoles.id, event.params.resourceId))

		// Return
		return Ok()
	} catch (err) {
		logger.exception(err, event)
		return InternalServerError()
	}
}