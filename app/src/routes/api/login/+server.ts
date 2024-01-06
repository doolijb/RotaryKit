import { users } from "$providers"
import { db } from "$database"
import { UserLogin as PostForm } from "$validation/forms"
import { validateData } from "$requests"
import { BadRequest, Created, InternalServerError } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"

const postForm = new PostForm()

interface Post {
	body: PostForm['Data']
}

/**
 * Login a user
 */
export async function POST (event: KitEvent<Post, RequestEvent>) {
	try {

		/**
		 * Check if user is already logged in
		 */
		if (event.locals.user) return BadRequest({
			body: {
				message: "Already logged in"
			}
		})

		/**
		 * Validate the data
		 */
		const {data, errors} = await validateData({ form: postForm, event })
		if (Object.keys(errors).length) return BadRequest({ body: { errors }})

		/**
		 * Login
		 */
		await db.transaction(async tx => {
			await users.auth.login({
				tx,
				event,
				username: data.username,
				passphrase: data.passphrase,
			})
		})

		/**
		 * Return the response
		 */
		return Created()

	} catch (e) {
		return InternalServerError()
	}
}