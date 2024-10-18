import { db } from "$server/database"
import { UserProfileImage as PostForm } from "$shared/validation/forms"
import { validateData } from "$server/requests"
import type { RequestEvent } from "@sveltejs/kit"
import { BadRequest, Created, InternalServerError, Forbidden, Ok } from "sveltekit-zero-api/http"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"
import { schema } from "$server/database"
import { eq } from "drizzle-orm"
import * as storage from "$server/storage"
import { v4 as uuidv4 } from "uuid"

const postForm = PostForm.init()

interface Post {
	body: PostForm["Data"] | FormData
}

interface Delete {
    body?: undefined
}

/**
 * Change user's passphrase if their old passphrase is correct
 */
/**
 * Change user's passphrase if their old passphrase is correct
 */
export async function POST(event: KitEvent<Post, RequestEvent>) {
	try {
		/**
		 * Check if user is not logged in
		 */
		if (!event.locals.user) return Forbidden()

		/**
		 * Validate the data
		 */
		const { data, errors } = await validateData<PostForm["Data"]>({ form: postForm, event })
		if (Object.keys(errors).length) return BadRequest({ body: { errors } })

		/**
		 * Check for any existing profile image(s)
		 */

		const oldImages = (await db
			.select()
			.from(schema.images)
			.where(eq(schema.images.profileImageUserId, event.locals.user.id))) as SelectImage[]

		/**
		 * Delete the old images
		 */

        const { STORAGE_DEFAULT_BUCKET: bucket } = process.env

		if (oldImages.length) {
			oldImages.forEach(async (image) => {
				await storage.image.delete(image)
            })
			await db
				.delete(schema.images)
				.where(eq(schema.images.profileImageUserId, event.locals.user.id))
		}

		/**
		 * Upload new image
		 */

		// Generate a uuid
		let uuid: string

		while (uuid == undefined) {
			uuid = uuidv4()
			const existing = (await db
				.select({ id: schema.images.id })
				.from(schema.images)
				.where(eq(schema.images.id, uuid))) as SelectImage[]
			if (existing.length) uuid = undefined
		}

		// Get current time
		const file = data.image[0] as File
		const now = new Date()

		const { originalBuffer, webpBuffer, jpgBuffer, mediumWebpBuffer, mediumJpgBuffer, smallWebpBuffer, smallJpgBuffer } =
			await storage.image.process({image: file, largeSize: false, mediumSize: false, fit: "cover"})
		const extension = file.name.split(".").pop().toLocaleLowerCase()
		await storage.image.save()

		/**
		 * Add the new image to the database
		 */

		await db.transaction(async (tx) => {
			await tx.insert(schema.images).values(imageValues)
		})

		/**
		 * Return the response
		 */
		return Created({ body: { success: true } })
	} catch (e) {
		logger.exception(e, event)
		return InternalServerError()
	}
}

export async function DELETE (event: KitEvent<Delete, RequestEvent>) {
    try {
        /**
         * Check if user is not logged in
         */
        if (!event.locals.user) return Forbidden()

        /**
         * Check for any existing profile image(s)
         */

        const oldImages = (await db
            .select()
            .from(schema.images)
            .where(eq(schema.images.profileImageUserId, event.locals.user.id))) as SelectImage[]

        /**
         * Delete the old images
         */

        if (oldImages.length) {
            oldImages.forEach(async (image) => {
                await deleteImage(image)
            })
            await db
                .delete(schema.images)
                .where(eq(schema.images.profileImageUserId, event.locals.user.id))
        }

        return Ok()
    } catch (e) {
        logger.exception(e, event)
        return InternalServerError()
    }
}
