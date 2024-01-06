import { users } from "$providers"
import { db } from "$database"
import { ResetPassphraseByUsername as PostForm } from "$validation/forms"
import { validateData, messageError } from "$requests"
import { Ok } from "sveltekit-zero-api/http"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"

const postForm = new PostForm()

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
		throw messageError("Invalid username or email address")
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