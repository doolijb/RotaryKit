import type { RequestEvent } from "@sveltejs/kit"
import { validateData, hasAdminPermission } from "$server/requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "$server/database"
import { eq } from "drizzle-orm"
import { Ok, InternalServerError, Forbidden, BadRequest, NotFound } from "sveltekit-zero-api/http"
import {
	AdminEditUser as PutForm,
	AdminEditUserWithPermissions as PutFormWithPermissions
} from "$shared/validation/forms"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"

const putForm = PutForm.init()
const putFormWithPermissions = new PutFormWithPermissions()

interface Put {
	body: PutFormWithPermissions["Data"] | PutForm["Data"]
}

export async function GET(event: RequestEvent) {
	try {
		if (!hasAdminPermission(event, schema.users)) {
			return Forbidden()
		}

		const columns: { [key: string]: boolean } = {
			id: true,
			username: true,
			createdAt: true,
			updatedAt: true,
			verifiedAt: true,
			isActive: true,
			isAdmin: true,
			isSuperUser: true
		}

		const availableRelations: AvailableRelations = {
			profileImages: {
				tableName: "images",
				columns: {
					id: true,
					totalBytes: true,
					smallWebpPath: true,
					smallWebpBytes: true,
					smallJpgPath: true,
					smallJpgBytes: true,
					createdAt: true,
					status: true
				},
				limit: 1
			},
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
			return NotFound()
		}

		return Ok({ body: result })
	} catch (error) {
		logger.exception(error, event)
		return InternalServerError()
	}
}

export async function PUT(event: KitEvent<Put, RequestEvent>) {
	try {
		////
		// CHECK PERMISSIONS
		////

		if (!hasAdminPermission(event, schema.users)) {
			return Forbidden()
		}

		////
		// Validate the data
		////

		const canEditSuperUsers = event.locals.user.isSuperUser
		const { data, errors } = await validateData({
			form: canEditSuperUsers ? putFormWithPermissions : putForm,
			event
		})

		if (errors.keys) {
			return BadRequest({ body: { errors } })
		}

		////
		// UPDATE USER
		////

		const user = await db.query.users.findFirst({
			where: (u, { eq }) => eq(u.id, event.params.resourceId)
		})

		if (!user) {
			return NotFound()
		}

		const values: {
			username?: string
			isVerified?: boolean
			isActive?: boolean
			isAdmin?: boolean
			isSuperUser?: boolean
			updatedAt?: Date
		} = {}

		const setUserMap = {
			username: () => {
				if (user.username !== data.username) {
					values["username"] = data.username
				}
			},
			isVerified: () => {
				if (!!user.verifiedAt !== data.isVerified) {
					if (data.isVerified) {
						values["verifiedAt"] = new Date()
					} else {
						values["verifiedAt"] = null
					}
				}
			},
			isActive: () => {
				if (user.isActive !== data.isActive) {
					values["isActive"] = data.isActive
				}
			},
			isAdmin: canEditSuperUsers
				? () => {
						if (user.isAdmin !== data["isAdmin"]) {
							values["isAdmin"] = data["isAdmin"]
						}
					}
				: undefined,
			isSuperUser: canEditSuperUsers
				? () => {
						if (user.isSuperUser !== data["isSuperUser"]) {
							values["isSuperUser"] = data["isSuperUser"]
						}
					}
				: undefined
		}

		Object.keys(data).forEach((key) => {
			if (setUserMap[key]) {
				setUserMap[key]()
			}
		})

		if (Object.keys(values).length === 0) {
			return BadRequest({ body: { message: "No changes to save" } })
		}

		if (values.username) {
			const user = await db.query.users.findFirst({
				where: (u, { eq }) => eq(u.username, values.username)
			})

			if (user) {
				return BadRequest({
					body: { errors: { username: { Taken: "The username is unavailable" } } }
				})
			}
		}

		values.updatedAt = new Date()

		await db.transaction(async (tx) => {
			// Update the user
			await tx.update(schema.users).set(values).where(eq(schema.users.id, event.params.resourceId))
		})

		////
		// RESPONSE
		////

		return Ok()
	} catch (err) {
		logger.exception(err, event)
		return InternalServerError()
	}
}

/**
 * @param event
 */
export async function DELETE(event: RequestEvent) {
	try {
		////
		// CHECK PERMISSIONS
		////

		if (!hasAdminPermission(event, schema.users)) {
			return Forbidden()
		}

		////
		// DELETE USER
		////

		await db.transaction(async (tx) => {
			// Delete the user
			await tx.delete(schema.users).where(eq(schema.users.id, event.params.resourceId))
		})

		////
		// RESPONSE
		////

		return Ok({ body: { success: true } })
	} catch (error) {
		logger.exception(error, event)
		return InternalServerError()
	}
}
