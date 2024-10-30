import type { RequestEvent } from "@sveltejs/kit"
import { validateData, hasAdminPermission } from "$server/requests"
import type { PgTableWithColumns } from "drizzle-orm/pg-core"
import { db, schema } from "$server/database"
import { eq } from "drizzle-orm"
import { Ok, InternalServerError, Forbidden, BadRequest, NotFound } from "sveltekit-zero-api/http"
import { AdminEditEmail as PutForm } from "$shared/validation/forms"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"
import { emails } from "$server/providers"

const putForm = PutForm.init()

interface Put {
	body: PutForm["Data"]
}

export async function GET(event: RequestEvent) {
	try {
		if (!hasAdminPermission(event, schema.emails)) {
			return Forbidden()
		}

		const columns: { [key: string]: boolean } = {
			id: true,
			address: true,
			isUserPrimary: true,
			verifiedAt: true,
			createdAt: true,
			updatedAt: true
		}

		const availableRelations: AvailableRelations = {
			user: {
				tableName: "emails",
				columns: {
					id: true,
					username: true,
					address: true,
					isUserPrimary: true,
					verifiedAt: true,
					createdAt: true,
					updatedAt: true
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

		return Ok({ body: result })
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

		if (!hasAdminPermission(event, schema.emails)) {
			return Forbidden()
		}

		////
		// VALIDATE
		////
		let hasChanges = false

		const { data, errors } = await validateData({
			form: putForm,
			event
		})

		if (errors.keys) {
			return BadRequest({ body: { errors } })
		}

		////
		// UPDATE EMAIL
		////

		const email = await db.query.emails.findFirst({
			where: (u, { eq }) => eq(u.id, event.params.resourceId)
		})

		if (!email) {
			return NotFound()
		}

		const values: Partial<SelectEmail> = {}

		////
		// CHECK FOR CHANGES
		////

		if (data.address !== email.address) {
			values.address = data.address
			hasChanges = true
		}

		if (data.userId !== email.userId) {
			values.userId = data.userId
			hasChanges = true
		}

		if (!!data.isVerified !== !!email.verifiedAt) {
			values.verifiedAt = data.isVerified ? new Date() : null
			hasChanges = true
		}

		if (data.isUserPrimary && !email.isUserPrimary) {
			hasChanges = true
		} else if (!data.isUserPrimary && email.isUserPrimary) {
			// We cannot unset the primary email
			return BadRequest({
				body: { message: "Cannot unset primary email, set a new primary instead" }
			})
		}

		////
		// SAVE CHANGES
		////

		if (!hasChanges) {
			return BadRequest({ body: { message: "No changes to save" } })
		}

		values.updatedAt = new Date()

		await db.transaction(async (tx) => {
			if (Object.keys(values).length > 0) {
				await tx
					.update(schema.emails)
					.set(values)
					.where(eq(schema.emails.id, event.params.resourceId))
			}
			if (data.isUserPrimary && !email.isUserPrimary) {
				await emails.setUserPrimary({ tx, emailId: email.id, userId: data.userId })
			}
		})

		////
		// RESPONSE
		////

		return Ok({ body: { success: true } })
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

		if (!hasAdminPermission(event, schema.emails)) {
			return Forbidden()
		}

		////
		// VALIDATE
		////

		const email = await db.query.emails.findFirst({
			where: (e, { eq }) => eq(e.id, event.params.resourceId)
		})

		if (email.userId && email.isUserPrimary) {
			return BadRequest({ body: { message: "Cannot delete a user's primary email" } })
		}

		////
		// DELETE EMAIL
		////

		await db.transaction(async (tx) => {
			// Delete the user
			await tx.delete(schema.emails).where(eq(schema.emails.id, event.params.resourceId))
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
