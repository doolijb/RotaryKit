import { users, emails } from "@providers"
import { db, schema } from "@database"
import { forms, utils } from "@validation"
import { error } from "@sveltejs/kit"
import { validateForm, customFieldError } from "@requests"


/**
 * Helper function to get the form
 * This is done because the passphraseConfirm field
 * needs to be able to reference the passphrase field.
 */
function getForm (data: Record<string, any>) {
	return utils.formValidator({
		definitions: forms.userRegister,
		extras: {
			passphraseConfirm: {
				matches: {
					args: {
						getValue: () => data.passphrase
					}
				}
			}
		}
	})
}


/**
 * Register a new user
 */
async function POST ({ 
	locals 
}: { 
	locals: App.Locals
}): Promise<{[key:string]: any}> {
	/**
	 * Validate the data
	 */
	
	await validateForm({
		form: getForm(locals.data),
		data: locals.data,
	})

	/**
	 * Check if the username or email address is already in use
	 */
	if (await users.exists({username: locals.data.username})) {
		throw customFieldError("username", "Taken", "This username is already registered")
	}

	if (await emails.exists({address: locals.data.email})) {
		throw customFieldError("email", "Taken", "This email address is already registered")
	}

	/**
	 * Create the user
	 */

	let emailId: string

	await db.transaction(async tx => {
		const [{userId}] = await users.create({
			tx,
			username: locals.data.username,
			returning: {userId: schema.users.id}
		})

		const [createdEmail] = await emails.create({
			tx,
			userId,
			address: locals.data.email,
			isUserPrimary: true,
			returning: {id: schema.emails.id}
		})

		emailId = createdEmail.id

		await users.passphrase.set({
			tx,
			userId,
			passphrase: locals.data.passphrase,
			createOnly: true
		})

	}).then(async () => {
		await emails.verifications.sendCode({
			emailId,
			username: locals.data.username
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