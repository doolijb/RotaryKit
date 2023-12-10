import type { RequestEvent } from "@sveltejs/kit"
import { adminApi, error, messageError, validateForm } from "@requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "@database"
import { utils, forms } from "@validation"
import { emails, users } from "@providers"
import { and, eq, or } from "drizzle-orm"

/**
 * @param event
 */
async function PUT(event: RequestEvent): Promise<SelectUser> {
	// Check if user is authorized to create a user
	// TODO

	////
	// FORM VALIDATION
	////

	const definitions = forms.adminEditAdminRolesToUser

	// Create the form
	const form = utils.formValidator({ definitions })

	// Validate the data, this will automatically throw an error if the data is invalid
	await validateForm({ form, data: event.locals.data })

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
	event.locals.data.adminRoles.forEach((adminRole) => {
		if (!user.toAdminRoles.find((userAdminRole) => userAdminRole.adminRoleId === adminRole.id)) {
			addAdminRoleIds.push(adminRole)
		}
	})

	// Find the roles to remove
	user.toAdminRoles.forEach((userAdminRole) => {
		if (
			!event.locals.data.adminRoles.find((adminRole) => adminRole.id === userAdminRole.adminRoleId)
		) {
			removeAdminRoleIds.push(userAdminRole.adminRoleId)
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
