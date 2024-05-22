import { users } from "$server/providers"
import { NewPassphrase as PostForm } from "$shared/validation/forms"
import { validateData } from "$server/requests"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { BadRequest, Forbidden, Ok } from "sveltekit-zero-api/http"

const postForm = PostForm.init()

interface Post {
	body: PostForm["Data"],
	params: {
		code: string
	}
}

/**
 * Validate the passphrase reset code and set a new passphrase.
 */
export async function POST(event: KitEvent<Post, RequestEvent>) {
	/**
	 * Must not be logged in
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
	 * Validate the code
	 */
	const reset = await users.passphrase.resets.validateCode({
		code: event.params.code
	})

	if (!reset) {
		return BadRequest({ body: { message: "Invalid code" }})
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
	await users.passphrase.notifyChange({userId})

	/**
	 * Return success
	 */
	return Ok({status: 201, body: { success: true }})
}
