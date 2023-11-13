import { users } from "@providers"
import { messageError } from "@requests"
import { utils, forms } from "@validation"
import { validateForm } from "@requests"

/**
 * Helper function to get the form
 * This is done because the passphraseConfirm field
 * needs to be able to reference the passphrase field.
 */
function getForm (data: Record<string, any>) {
	return utils.formValidator({
		definitions: forms.newPassphrase,
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
 * Validate the passphrase reset code and set a new passphrase.
 *
 * @param {{code:string}} event.params
 * @returns {{success: true}}
 */
async function POST({
	locals,
	params
}: {
	locals: App.Locals
	params: {
		code: string
	}
}): Promise<{ [key: string]: any }> {
	/**
	 * Must not be logged in
	 */
	if (locals.user) {
		throw messageError("You are already logged in.")
	}

	/**
	 * Validate the form
	 */
	await validateForm({
		form: getForm(locals.data),
		data: locals.data
	})

	/**
	 * Validate the code
	 */
	const reset = await users.passphrase.resets.validateCode({
		code: params.code
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
		passphrase: locals.data.passphrase
	})

	/**
	 * Send confirmation email
	 */
	await users.passphrase.notifyChange({userId})

	/**
	 * Return success
	 */
	return {
		success: true
	}
}

export default {
	POST
}
