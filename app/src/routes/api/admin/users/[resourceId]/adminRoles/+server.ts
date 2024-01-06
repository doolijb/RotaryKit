import type { RequestEvent } from "@sveltejs/kit"
import { validateData } from "$requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "$database"
import { and, eq, or } from "drizzle-orm"
import { AdminEditAdminRolesToUser as PutForm } from "$validation/forms"
import type { KitEvent } from "sveltekit-zero-api"

const putForm = new PutForm()

interface Put {
    body: PutForm["Data"]
    params: {
        resourceId: string
    }
}

/**
 * Admin view to update a users admin roles
 */
async function PUT(event: KitEvent<Put, RequestEvent>) {
	// Check if user is authorized to create a user
	// TODO

	/**
	 * Validate the data
	 */
	const data = await event.request.json()
	await validateData({
		form: putForm,
		data, 
	})

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

                const insertQuery: InsertUserAdminRole = addAdminRoleIds.map((adminRoleId) => ({
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
	return {
		success: true
	}
}

export default {
	PUT
}
