import { users, emails } from "$providers"
import { db, schema } from "$database"
import { UserRegister as PostForm } from "$validation/forms"
import { validateData } from "$requests"
import type { RequestEvent } from "@sveltejs/kit"
import { BadRequest, Created, InternalServerError, Forbidden } from "sveltekit-zero-api/http"
import type { KitEvent } from "sveltekit-zero-api"

const postForm = PostForm.init()

interface Post {
	body: PostForm["Data"]
}

/**
 * Register a new user
 */
export async function POST (event: KitEvent<Post, RequestEvent>) {
	try {

		/**
		 * Check if user is already logged in
		 */
		if (event.locals.user) return Forbidden()
		
		/**
		 * Validate the data
		 */
		const { data, errors } = await validateData<PostForm["Data"]>({ form: postForm, event })
		if (Object.keys(errors).length) return BadRequest({ body: { errors }})

		/**
		 * Check if the username or email address is already in use
		 */
		if (await users.exists({username: data.username})) {
			errors["username"] = {"Taken": "This username is already registered"}
			return BadRequest({ body: { errors }})
		}

		if (await emails.exists({address: data.email})) {
			errors["email"] = {"Taken": "This email address is already registered"}
			return BadRequest({ body: { errors }})
		}

		/**
		 * Create the user
		 */

		let emailId: string

		await db.transaction(async tx => {
			const [{userId}] = await users.create({
				tx,
				username: data.username,
				returning: {userId: schema.users.id}
			})

			const [createdEmail] = await emails.create({
				tx,
				userId,
				address: data.email,
				isUserPrimary: true,
				returning: {id: schema.emails.id}
			})

			emailId = createdEmail.id

			await users.passphrase.set({
				tx,
				userId,
				passphrase: data.passphrase,
				createOnly: true
			})

		}).then(async () => {
			await emails.verifications.sendCode({
				emailId,
				username: data.username
			})
		})

		/**
		 * Return the response
		 */
		return Created({ status: 201, body: { success: true }})
		
	} catch (e) {
		console.error(e)
		return InternalServerError()
	}
}