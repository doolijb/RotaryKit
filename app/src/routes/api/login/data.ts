import { users } from "@providers"
import { db } from "@database"
import { forms, utils } from "@validation"
import { validateForm, messageError } from "@requests"
import type { RequestEvent } from "@sveltejs/kit"

const form = utils.formValidator({definitions: forms.userLogin})

/**
 * Login a user
 */
async function POST (event: RequestEvent): Promise<{[key:string]: any}> {

	/**
	 * Check if user is already logged in
	 */
	if (event.locals.user) {
		throw messageError("Already logged in")
	}

	/**
	 * Validate the data
	 */
	await validateForm({
		form,
		data: event.locals.data,
	})

	/**
	 * Login
	 */
	await db.transaction(async tx => {
		await users.auth.login({
			tx,
			event,
			username: event.locals.data.username,
			passphrase: event.locals.data.passphrase,
		})
	})

	/**
	 * Return the response
	 */
  	return {
      success: true, 
    }
}

export default {
    POST
}