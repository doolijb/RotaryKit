import { users } from "$server/providers"
import { db } from "$server/database"
import { ResetPassphraseByUsername as PostForm } from "$shared/validation/forms"
import { validateData } from "$server/requests"
import { BadRequest, Forbidden, Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"

const postForm = PostForm.init()

interface Post {
	body: PostForm['Data']
}

/**
 * Request a passphrase reset code for a user or email address
 */
export async function POST (event: KitEvent<Post, RequestEvent>) {
	/**
	 * Check if user is already logged in
	 */
	if (event.locals.user) {
		return Forbidden({ body: { message: "You are already logged in" }})
	}

	/**
	 * Validate the data
	 */
	const { data, errors } = await validateData({ form: postForm, event })
	if (Object.keys(errors).length) {
		return BadRequest({ body: { errors }})
	}

	/**
	 * Get our variables ready
	 */
	let userId: string
	let toAddress: string

	/**
	 * Check if valid user exists
	 */
	const user = await db.query.users.findFirst({
		where: (u, {and, eq, isNotNull}) => and(
			eq(u.username, data.username),
			isNotNull(u.verifiedAt),
			eq(u.isActive, true),
		)
	})

	/**
	 * Get userId, or check if username is an email
	 */
	if (user) {
		userId = user.id
	} else {
		const email = await db.query.emails.findFirst({
			where: (e, {and, eq, isNotNull}) => and(
				eq(e.address, data.username),
				isNotNull(e.verifiedAt),
			),
			with: {
				user: true
			}
		})
		if (email && email.user && email.user.verifiedAt) {
			userId = email.user.id
			toAddress = email.address
		}
	}

	/**
	 * If no user, throw error
	 */
	if (!userId) {
		return BadRequest({ body: { message: "Invalid username or email address" }})
	}

	/**
	 * Send the code
	 */
	await db.transaction(async tx => {
		await users.passphrase.resets.sendCode({
			tx,
			userId,
			toAddress,
		})
	})

	/**
	 * Return the response
	 */
	return Ok({ status: 201, body: { success: true }})
}