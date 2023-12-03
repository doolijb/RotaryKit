import { users } from "@providers"
import { db } from "@database"
import { forms, utils } from "@validation"
import { validateForm, messageError } from "@requests"
import type { RequestEvent } from "@sveltejs/kit"

const form = utils.formValidator({definitions: forms.resetPassphrase})

/**
 * Request a passphrase reset code for a user or email address
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
	 * Get our variables ready
	 */
	let userId: string
	let toAddress: string

	/**
	 * Check if valid user exists
	 */
	const user = await db.query.users.findFirst({
		where: (u, {and, eq, isNotNull}) => and(
			eq(u.username, event.locals.data.username),
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
				eq(e.address, event.locals.data.username),
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
  	return {
      success: true, 
    }
}

export default {
    POST
}