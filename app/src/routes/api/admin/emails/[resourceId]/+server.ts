import type { RequestEvent } from "@sveltejs/kit"
import { messageError, validateData, hasAdminPermission } from "$requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "$database"
import { eq } from "drizzle-orm"
import { Ok, InternalServerError, Forbidden, BadRequest, NotFound } from "sveltekit-zero-api/http"
import { AdminEditUser as PutForm, AdminEditUserWithPermissions as PutFormWithPermissions } from "$validation/forms"
import type { KitEvent } from "sveltekit-zero-api"

const putForm = PutForm.init()
const putFormWithPermissions = new PutFormWithPermissions()

interface Put {
    body: PutFormWithPermissions["Data"] | PutForm["Data"]
}

export async function GET(event: RequestEvent) {
	try {

		if(!hasAdminPermission(
			event,
			schema.users,
		)) {
			return Forbidden()
		}

		const columns: { [key: string]: boolean } = {
			id: true,
			address: true,
			isUserPrimary: true,
			verifiedAt: true,
			createdAt: true,
			updatedAt: true,
		}

		const availableRelations: AvailableRelations = {
			user: {
				tableName: "emails",
				columns: {
					id: true,
					address: true,
					isUserPrimary: true,
					verifiedAt: true,
					createdAt: true,
					updatedAt: true,
				},
				with: {
					emails: {
						id: true,
						address: true,
						isUserPrimary: true,
						verifiedAt: true,
						createdAt: true,
						updatedAt: true,
					}
				}
			}
		}

		const result = await db.query.emails.findFirst({
			columns,
			where: (e, { eq }) => eq(e.id, event.params.resourceId),
			with: availableRelations
		})

		if (!result) {
			return NotFound()
		}

		return Ok({body:result})

	} catch (error) {
		console.log(error)
		return InternalServerError()
	}
}


export async function PUT(event: KitEvent<Put, RequestEvent>) {
	try {

		////
		// CHECK PERMISSIONS
		////

		if(!hasAdminPermission(
			event,
			schema.users,
		)) {
			return Forbidden()
		}

		////
		// Validate the data
		////

		const canEditSuperUsers = event.locals.user.isSuperUser
		const { data, errors } = await validateData({
			form: canEditSuperUsers ? putFormWithPermissions : putForm,
			event, 
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

		const setUserData: {
			username?: string
			isVerified?: boolean
			isActive?: boolean
			isAdmin?: boolean
			isSuperUser?: boolean
		} = {}

		const setUserMap = {
			username: () => {
				if (user.username !== data.username) {
					setUserData["username"] = data.username
				}
			},
			isVerified: () => {
				if (!!user.verifiedAt !== data.isVerified) {
					if (data.isVerified) {
						console.log("verifiedAt", data.isVerified)
						setUserData["verifiedAt"] = new Date()
					} else {
						setUserData["verifiedAt"] = null
					}
				}
			},
			isActive: () => {
				if (user.isActive !== data.isActive) {
					setUserData["isActive"] = data.isActive
				}
			},
			isAdmin: canEditSuperUsers ? () => {
				if (user.isAdmin !== data["isAdmin"]) {
					setUserData["isAdmin"] = data["isAdmin"]
				}
			} : undefined,
			isSuperUser: canEditSuperUsers ? () => {
				if (user.isSuperUser !== data["isSuperUser"]) {
					setUserData["isSuperUser"] = data["isSuperUser"]
				}
			} : undefined,
		}

		Object.keys(data).forEach((key) => {
			if (setUserMap[key]) {
				setUserMap[key]()
			}
		})

		if (Object.keys(setUserData).length === 0) {
			return BadRequest({body:{message:"No changes to save"}})
		}

		if(setUserData.username) {
			const user = await db.query.users.findFirst({
				where: (u, { eq }) => eq(u.username, setUserData.username)
			})

			if (user) {
				return BadRequest({body:{errors:{username:{Taken:"The username is unavailable"}}}})
			}
		}

		await db.transaction(async (tx) => {
			// Update the user
			await tx
				.update(schema.users)
				.set(setUserData)
				.where(eq(schema.users.id, event.params.resourceId))
		})

		////
		// RESPONSE
		////

		return Ok({ body: { success: true }})

	} catch (err) {
		console.log(err)
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
		
		if(!hasAdminPermission(
			event,
			schema.users,
		)) {
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

		return Ok({ body: { success: true }})
	
	} catch (error) {
		console.log(error)
		return InternalServerError()
	}
}
