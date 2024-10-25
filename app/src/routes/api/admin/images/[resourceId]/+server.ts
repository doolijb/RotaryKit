import type { RequestEvent } from "@sveltejs/kit"
import { validateData, hasAdminPermission } from "$server/requests"
import { db, schema } from "$server/database"
import { eq } from "drizzle-orm"
import { Ok, InternalServerError, Forbidden, BadRequest, NotFound } from "sveltekit-zero-api/http"
import { AdminEditEmail as PutForm } from "$shared/validation/forms"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"
import { images } from "$server/providers"

const putForm = PutForm.init()

interface Put {
    body: PutForm["Data"]
}

export async function GET(event: RequestEvent) {
	try {
		if(!hasAdminPermission(
			event,
			schema.images,
		)) {
			return Forbidden()
		}

		const columns: { [key: string]: boolean } = {
			id: true,
			title: true,
			totalBytes: true,
			createdAt: true,
			updatedAt: true,
			originalPath: true,
			originalBytes: true,
			webpPath: true,
			webpBytes: true,
			jpgPath: true,
			jpgBytes: true,
			mediumWebpPath: true,
			mediumWebpBytes: true,
			mediumJpgPath: true,
			mediumJpgBytes: true,
			smallWebpPath: true,
			smallWebpBytes: true,
			smallJpgPath: true,
			smallJpgBytes: true,
			status: true,
		}

		const availableRelations: AvailableRelations = {
			uploadedByUser: {
				tableName: "users",
				columns: {
					id: true,
					username: true,
					createdAt: true,
					updatedAt: true,
				}
			},
			profileImageUser: {
				tableName: "users",
				columns: {
					id: true,
					username: true,
					createdAt: true,
					updatedAt: true,
				}
			}
		}

		const result = await db.query.images.findFirst({
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
			schema.images,
		)) {
			return Forbidden()
		}

		////
		// VALIDATE
		////
		let hasChanges = false

		const { data, errors } = await validateData({
			form: putForm,
			event, 
		})

		if (errors.keys) {
			return BadRequest({ body: { errors } })
		}

		////
		// UPDATE EMAIL
		////

		const image = await db.query.images.findFirst({
			where: (u, { eq }) => eq(u.id, event.params.resourceId)
		})
		
		if (!image) {
			return NotFound()
		}

		const values = {}

		////
		// CHECK FOR CHANGES
		////

		if (data.title !== image.title) {
			values["address"] = data.address
			hasChanges = true
		}

		if (data.status !== image.status) {
			values["userId"] = data.userId
			hasChanges = true
		}

		////
		// SAVE CHANGES
		////

		if (!hasChanges) {
			return BadRequest({ body: { message: "No changes to save" } })
		}

		await db.transaction(async (tx) => {
			if (Object.keys(values).length > 0) {
				await tx.update(schema.images).set(values).where(eq(schema.images.id, event.params.resourceId))
			}
		})

		////
		// RESPONSE
		////

		return Ok({ body: { success: true }})

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
		
		if(!hasAdminPermission(
			event,
			schema.images,
		)) {
			return Forbidden()
		}

		////
		// DELETE EMAIL
		////

		await db.transaction(async (tx) => {
			// Delete the image
			await tx.delete(schema.images).where(eq(schema.images.id, event.params.resourceId))
		})

		////
		// RESPONSE
		////

		return Ok({ body: { success: true }})
	
	} catch (error) {
		logger.exception(error, event)
		return InternalServerError()
	}
}
