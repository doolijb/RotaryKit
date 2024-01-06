import { users, emails } from "$providers"
import { db, schema } from "$database"
import { UserRegister as PostForm } from "$validation/forms"
import { validateData, customFieldError, messageError } from "$requests"
import { Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"

const postForm = new PostForm()

interface Post {
	body: PostForm['Data']
}

/**
 * Register a new user
 */
export async function POST (event: KitEvent<Post, RequestEvent>) {
	/**
	 * Check if user is already logged in
	 */
	if (event.locals.user) {
		throw messageError("You are already logged in.")
	}
	
	/**
	 * Validate the data
	 */
	const data = await event.request.json()
	await validateData({
		form: postForm,
		data, 
	})

	/**
	 * Check if the username or email address is already in use
	 */
	if (await users.exists({username: data.username})) {
		throw customFieldError("username", "Taken", "This username is already registered")
	}

	if (await emails.exists({address: data.email})) {
		throw customFieldError("email", "Taken", "This email address is already registered")
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
	return Ok({ status: 201, body: { success: true }})
}