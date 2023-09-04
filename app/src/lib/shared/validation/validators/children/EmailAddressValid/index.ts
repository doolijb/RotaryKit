import { Validator } from "$shared/validation/base"

/**
 * Validates that a string is a valid email address
 */
export class EmailAddressValid extends Validator {
	args = {}
	badge = "Valid"
	key = "emailAddressValid"
	message = "Must be a valid email address"
	test = async ({ key, data }) => {
		const value = data[key]
		return value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) : true
	}
}
