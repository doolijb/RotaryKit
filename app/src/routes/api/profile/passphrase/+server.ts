import { users } from "$server/providers"
import { db } from "$server/database"
import { ChangePassphrase as PutForm } from "$shared/validation/forms"
import { validateData } from "$server/requests"
import type { RequestEvent } from "@sveltejs/kit"
import { BadRequest, Created, InternalServerError, Forbidden } from "sveltekit-zero-api/http"
import type { KitEvent } from "sveltekit-zero-api"
import { logger } from "$server/logging"

const putForm = PutForm.init()

interface Put {
	body: PutForm["Data"]
}

/**
 * Change user's passphrase if their old passphrase is correct
 */
export async function PUT(event: KitEvent<Put, RequestEvent>) {
	try {
		/**
		 * Check if user is not logged in
		 */
		if (!event.locals.user) return Forbidden()

		/**
		 * Validate the data
		 */
		const { data, errors } = await validateData<PutForm["Data"]>({ form: putForm, event })
		if (Object.keys(errors).length) return BadRequest({ body: { errors } })

		/**
		 * Check if the current passphrase is correct
		 */
		if (
			!(await users.passphrase.validate({
				userId: event.locals.user.id,
				passphrase: data.currentPassphrase
			}))
		) {
			errors["currentPassphrase"] = { Incorrect: "Your current passphrase is incorrect" }
			return BadRequest({
				body: {
					errors,
					message: "Your current passphrase is incorrect"
				}
			})
		}

		/**
		 * Set the new passphrase
		 */

		await db
			.transaction(async (tx) => {
				await users.passphrase.set({
					tx,
					userId: event.locals.user.id,
					passphrase: data.passphrase
				})
			})
			.then(async () => {
				await users.passphrase.notifyChange({ userId: event.locals.user.id })
			})

		/**
		 * Return the response
		 */
		return Created({ body: { success: true } })
	} catch (e) {
		logger.exception(e, event)
		return InternalServerError()
	}
}
