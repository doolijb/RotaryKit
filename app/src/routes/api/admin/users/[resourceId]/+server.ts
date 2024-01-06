import type { RequestEvent } from "@sveltejs/kit"
import { messageError, validateData } from "$requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "$database"
import { eq } from "drizzle-orm"
import { Ok } from "sveltekit-zero-api/http"
import { AdminEditUser as PutForm, AdminEditUserWithPermissions as PutFormWithPermissions } from "$validation/forms"
import type { KitEvent } from "sveltekit-zero-api"

const putForm = new PutForm()
const putFormWithPermissions = new PutFormWithPermissions()

interface Put {
    body: PutForm["Data"] | PutFormWithPermissions["Data"]
    params: {
        resourceId: string
    }
}

/**
 * Admin view for a list of users
 */
export async function GET(event: RequestEvent) {
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

	const body: SelectUser = await db.query.users.findFirst({
		columns,
		where: (u, { eq }) => eq(u.id, event.params.resourceId),
		with: availableRelations
	})

	return Ok({body})
}

/**
 * @param event
 */
export async function PUT(event: KitEvent<Put, RequestEvent>) {
	// Check if user is authorized to create a user
	// TODO

	/**
	 * Validate the data
	 */
    let useForm: PutForm | PutFormWithPermissions = putForm
	// Check if user is superuser
	if (event.locals.user.isSuperUser) {
		useForm = putFormWithPermissions
	}
	const data = await event.request.json()
	await validateData({
		form: useForm,
		data, 
	})

	////
	// UPDATE USER
	////

	const setUserData = {}

	const setUserMap = {
		isVerified: (user: SelectUser) => {
			if (!!user.verifiedAt !== !!data.isVerified) {
				if (data.isVerified) {
					setUserData["verifiedAt"] = new Date()
				} else {
					setUserData["verifiedAt"] = null
				}
			}
		},
		isActive: (user: SelectUser) => {
			if (!!user.verifiedAt !== !!data.isActive) {
				if (data.isActive) {
					setUserData["verifiedAt"] = new Date()
				} else {
					setUserData["verifiedAt"] = null
				}
			}
		},
		isAdmin: (user: SelectUser) => {
			if (user.isAdmin !== data.isAdmin) {
				setUserData["isAdmin"] = data.isAdmin
			}
		},
		isSuperUser: (user: SelectUser) => {
			if (user.isSuperUser !== data.isSuperUser) {
				setUserData["isSuperUser"] = data.isSuperUser
			}
		}
	}

	Object.keys(data).forEach((key) => {
		if (setUserMap[key]) {
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
		})

    // TODO: Return result

	// Return the user
	return Ok({ body: { success: true }})
}

/**
 * @param event
 */
export async function DELETE(event: RequestEvent) {
	// Check if user is authorized to delete a user
	// TODO

	////
	// DELETE USER
	////

	await db.transaction(async (tx) => {
		// Delete the user
		await tx.delete(schema.users).where(eq(schema.users.id, event.params.resourceId))
	})

	// Return the user
	return Ok({ body: { success: true }})
}
