import { users } from "$server/providers"
import { NewPassphrase as PostForm } from "$shared/validation/forms"
import { validateData } from "$server/requests"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { BadRequest, Forbidden, InternalServerError, Ok } from "sveltekit-zero-api/http"
import { logger } from "$server/logging"

const postForm = PostForm.init()

interface Get {
	body?: undefined
}

interface Post {
	body: PostForm["Data"]
}

/**
 * Validate the passphrase reset code.
 */
export async function GET(event: KitEvent<Get, RequestEvent>) {
	try {
		const reset = await users.passphrase.validateCode({
			code: event.params.code
		})

		if (!reset) {
			return BadRequest()
		}

		return Ok({ body: { success: true } })
	} catch (e) {
		logger.error(e)
		return InternalServerError()
	}
}

/**
 * Validate the passphrase reset code and set a new passphrase.
 */
export async function PUT(event: KitEvent<Post, RequestEvent>) {
	try {
		/**
		 * Must not be logged in
		 */
		if (event.locals.user) {
			return Forbidden({ body: { message: "You are already logged in" } })
		}

		/**
		 * Validate the data
		 */
		const { data, errors } = await validateData({ form: postForm, event })
		if (Object.keys(errors).length) {
			return BadRequest({ body: { errors } })
		}

		/**
		 * Validate the code
		 */
		const reset = await users.passphrase.validateCode({
			code: event.params.code
		})

		if (!reset) {
			return BadRequest({ body: { message: "Invalid code" } })
		}

		const userId = reset.userId

		/**
		 * Set the new passphrase
		 */
		await users.passphrase.set({
			userId,
			passphrase: data.passphrase
		})

		/**
		 * Send confirmation email
		 */
		await users.passphrase.notifyChange({ userId })

		/**
		 * Return success
		 */
		return Ok({ body: { message: "Passphrase updated" } })
	} catch (e) {
		logger.error(e)
		return InternalServerError()
	}
}
