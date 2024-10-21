import { db } from "$server/database"
import { UserProfileImage as PostForm } from "$shared/validation/forms"
import { validateData } from "$server/requests"
import type { RequestEvent } from "@sveltejs/kit"
import { BadRequest, Created, InternalServerError, Forbidden, Ok } from "sveltekit-zero-api/http"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"
import { schema } from "$server/database"
import { eq } from "drizzle-orm"
import { images } from "$server/providers"


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
		oldImages.forEach(async (image) => {
			await images.remove({image})
		})

		/**
		 * Upload new image
		 */

		const file = data.image[0] as File
		
		/**
		 * Add the new image to the database
		 */
		await db.transaction(async (tx) => {
			await images.create({ tx, file, uploadedByUserId: event.locals.user.id, profileImageUserId: event.locals.user.id })
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
		oldImages.forEach(async (image) => {
			await images.remove({image})
		})

        return Ok()
    } catch (e) {
        logger.exception(e, event)
        return InternalServerError()
    }
}
