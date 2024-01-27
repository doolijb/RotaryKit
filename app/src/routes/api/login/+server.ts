import { users } from "$providers"
import { db } from "$database"
import { UserLogin as PostForm } from "$validation/forms"
import { validateData } from "$requests"
import { BadRequest, InternalServerError, Forbidden, Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"

const postForm = PostForm.init()

type Post = {
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
		if (event.locals.user) return Forbidden({body: {message: "You are already logged in"}})

		/**
		 * Validate the data
		 */
		const {data, errors} = await validateData({ form: postForm, event })
		if (Object.keys(errors).length) return BadRequest({ body: { errors }})

		/**
		 * Login
		 */
		let user: SelectUser | void
		await db.transaction(async tx => {
			user = await users.auth.login({
				tx,
				event,
				username: data.username,
				passphrase: data.passphrase,
			})
		})

		/**
		 * Invalid credentials
		 */
		if (!user) {
			return BadRequest({
				body: {
					message: "Invalid username or passphrase",
				}
			})
		}

		/**
		 * Return the response
		 */
		return Ok({ body: { success: true } })

	} catch (e) {
		console.error(e)
		return InternalServerError()
	}
}