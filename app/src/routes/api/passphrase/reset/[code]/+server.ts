import { users } from "$providers"
import { messageError } from "$requests"
import { NewPassphrase as PostForm } from "$validation/forms"
import { validateData } from "$requests"
import type { RequestEvent } from "@sveltejs/kit"
import type { KitEvent } from "sveltekit-zero-api"
import { Ok } from "sveltekit-zero-api/http"

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
	 * Validate the code
	 */
	const reset = await users.passphrase.resets.validateCode({
		code: event.params.code
	})

	if (!reset) {
		throw messageError("Invalid passphrase reset code.")
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
