import type { RequestEvent } from "@sveltejs/kit"
import { adminApi, error, messageError, validateForm } from "@requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "@database"
import { utils, forms } from "@validation"
import { emails, users } from "@providers"
import { eq } from "drizzle-orm"

/**
 * Admin view for a list of users
 */
async function GET(event: RequestEvent): Promise<SelectUser> {
	// Check if user is authorized to view users
	// TODO

	const columns: { [key: string]: boolean } = {
		id: true,
		username: true,
		createdAt: true,
		updatedAt: true,
		verifiedAt: true,
		isAdmin: true,
		isSuperUser: true
	}

	const availableRelations: AvailableRelations<SelectUser> = {
		emails: {
			tableName: "emails",
			columns: {
				id: true,
				address: true,
				isUserPrimary: true,
				verifiedAt: true,
				createdAt: true,
				updatedAt: true
			},
			where: (e: PgTableWithColumns<any>, { eq }) => eq(e["isUserPrimary"], true)
		},
		toAdminRoles: {
			columns: {},
			with: {
				adminRole: {
					columns: {
						id: true,
						name: true,
						createdAt: true,
						updatedAt: true
					},
					with: {
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
						}
					}
				}
			}
		}
	}

	const result = await db.query.users.findFirst({
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
	// Check if user is authorized to create a user
	// TODO

	////
	// FORM VALIDATION
	////

	const definitions = forms.adminEditUser

	// Check if user is superuser
	if (!event.locals.user.isSuperUser) {
		// If not, remove isSuperUser from the definitions
		delete definitions["isSuperUser"]
		delete definitions["isAdmin"]
	}

	// Create the form
	const form = utils.formValidator({ definitions })

	// Validate the data, this will automatically throw an error if the data is invalid
	await validateForm({ form, data: event.locals.data })

	////
	// UPDATE USER
	////

	const setUserData = {}

	const setUserMap = {
		isVerified: (user: SelectUser) => {
			if (!!user.verifiedAt !== !!event.locals.data.isVerified) {
				if (event.locals.data.isVerified) {
					setUserData["verifiedAt"] = new Date()
				} else {
					setUserData["verifiedAt"] = null
				}
			}
		},
		isActive: (user: SelectUser) => {
			if (!!user.verifiedAt !== !!event.locals.data.isActive) {
				if (event.locals.data.isActive) {
					setUserData["verifiedAt"] = new Date()
				} else {
					setUserData["verifiedAt"] = null
				}
			}
		},
		isAdmin: (user: SelectUser) => {
			if (user.isAdmin !== event.locals.data.isAdmin) {
				setUserData["isAdmin"] = event.locals.data.isAdmin
			}
		},
		isSuperUser: (user: SelectUser) => {
			if (user.isSuperUser !== event.locals.data.isSuperUser) {
				setUserData["isSuperUser"] = event.locals.data.isSuperUser
			}
		}
	}

	Object.keys(event.locals.data).forEach((key) => {
		if (!!setUserMap[key]) {
			setUserMap[key](event.locals.user)
		}
	})

	if (Object.keys(setUserData).length === 0) {
		throw messageError("No changes to save", 400)
	}

	await db
		.transaction(async (tx) => {
			const user = await tx.query.users.findFirst({
				where: (u, { eq }) => eq(u.id, event.params.resourceId)
			})

			if (!user) {
				throw messageError("Not found", 404)
			}

			// Update the user
			await tx
				.update(schema.users)
				.set(setUserData)
				.where(eq(schema.users.id, event.params.resourceId))

			// Set new passphrase if provided
			if (event.locals.data.newPassphrase) {
				await users.passphrase.set({
					tx,
					userId: event.params.resourceId,
					passphrase: event.locals.data.newPassphrase
				})
			}
		})
		.then(async () => {})

	// Return the user
	return {
		success: true
	}
}

/**
 * @param event
 */
async function DELETE(event: RequestEvent): Promise<{ success: true }> {
	// Check if user is authorized to delete a user
	// TODO

	console.log("DELETE USER", event.params.resourceId)

	////
	// DELETE USER
	////

	await db.transaction(async (tx) => {
		// Delete the user
		await tx.delete(schema.users).where(eq(schema.users.id, event.params.resourceId))
	})

	// Return the user
	return {
		success: true
	}
}

export default {
	GET,
	PUT,
	DELETE
}
