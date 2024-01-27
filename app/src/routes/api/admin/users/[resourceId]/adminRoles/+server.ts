import type { RequestEvent } from "@sveltejs/kit"
import { hasAdminPermission, validateData } from "$requests"
import { db, schema } from "$database"
import { and, eq, or } from "drizzle-orm"
import { AdminEditAdminRolesToUser as PutForm } from "$validation/forms"
import type { KitEvent } from "sveltekit-zero-api"
import { Ok, InternalServerError, BadRequest, Forbidden, NotFound } from "sveltekit-zero-api/http"

const putForm = PutForm.init()

interface Put {
    body: PutForm["Data"]
}

/**
 * Admin view to update a users admin roles
 */
export async function PUT(event: KitEvent<Put, RequestEvent>) {
	try {
		if(!hasAdminPermission(
			event,
			schema.users,
		)) {
			return Forbidden()
		}

		/**
		 * Validate the data
		 */
		const { data, errors } = await validateData({
			form: putForm,
			event, 
		})
		if (errors.keys) return BadRequest({ body: {errors}})

		////
		// UPDATE USER
		////

		const addAdminRoleIds = []
		const removeAdminRoleIds = []

		// Get the users roles
		const user = await db.query.users.findFirst({
			columns: {
				id: true
			},
			with: {
				toAdminRoles: {
					columns: {
						adminRoleId: true
					}
				}
			},
			where: (t, {eq}) => eq(t.id, event.params.resourceId)
		})

		////
		// 404
		////

		if (!user) {
			return NotFound()
		}

		// Find the the roles to add
		data.adminRoles.forEach((adminRoleId: string) => {
			if (!user.toAdminRoles.find((userAdminRole) => userAdminRole.adminRoleId === adminRoleId)) {
				addAdminRoleIds.push(adminRoleId)
			}
		})

		// Find the roles to remove
		user.toAdminRoles.forEach(({adminRoleId: userAdminRoleId}) => {
			if (!data.adminRoles.includes(userAdminRoleId)) {
				removeAdminRoleIds.push(userAdminRoleId)
			}
		})

		await db
			.transaction(async (tx) => {
				// Add the roles
				if (addAdminRoleIds.length > 0) {

					const insertQuery: InsertUsersToAdminRoles[] = addAdminRoleIds.map((adminRoleId) => ({
						userId: event.params.resourceId,
						adminRoleId
					}))
					console.log(insertQuery)

					await tx.insert(schema.usersToAdminRoles).values(insertQuery)
				}

				// Remove the roles
				if (removeAdminRoleIds.length > 0) {
					const deleteQuery = and(
						eq(schema.usersToAdminRoles.userId, event.params.resourceId),
						or(
						...removeAdminRoleIds.map((adminRoleId) => eq(schema.usersToAdminRoles.adminRoleId, adminRoleId))
					))
					await tx.delete(schema.usersToAdminRoles).where(deleteQuery)
			}})

		// Return the user
		return Ok()
	} catch (err) {
		console.error(err)
		return InternalServerError()
	}
}
