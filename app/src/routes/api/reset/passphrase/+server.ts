import { users } from "$server/providers"
import { db } from "$server/database"
import { RecoverPassphraseByEmail as PostForm } from "$shared/validation/forms"
import { validateData } from "$server/requests"
import { BadRequest, InternalServerError, Forbidden, Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"

const postForm = PostForm.init()

interface Post {
	body: PostForm["Data"]
}

/**
 * Request a passphrase reset code for a user or email address
 */
export async function POST(event: KitEvent<Post, RequestEvent>) {
	try {
		/**
		 * Check if user is already logged in
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
		 * Check if valid user exists
		 */

		const email = await db.query.emails.findFirst({
			where: (e, { and, eq, isNotNull }) => and(eq(e.address, data.email), isNotNull(e.verifiedAt)),
			with: {
				user: true
			}
		})

		/**
		 * If email and user are verified, send the code
		 */
		if (email && email.user && email.user.verifiedAt) {
			await db.transaction(async (tx) => {
				await users.passphrase.sendCode({
					tx,
					userId: email.user.id,
					toAddress: email.address
				})
			})
		} else {
			// wait a bit to prevent timing attacks
			await new Promise((resolve) => setTimeout(resolve, 1000))
		}

		/**
		 * Return the response
		 */
		return Ok({ status: 201, body: { success: true } })
	} catch (e) {
		logger.error(e)
		return InternalServerError()
	}
}
