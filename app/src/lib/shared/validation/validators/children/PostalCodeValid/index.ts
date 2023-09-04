import postalCodes from "postal-codes-js"
import { Validator } from "$shared/validation/base"

/**
 * Validates that a string is a complete and valid postal code
 *
 * @param {string} args.countryCodeKey
 */

export class PostalCodeValid extends Validator {
	declare args: { countryCodeKey: string }
	badge = "Valid"
	key = "postalCodeValid"
	message = "Must be a valid postal code"
	test = async ({ key, data }) => {
		const value: string = data[key]
		const countryCode: string = data[this.args.countryCodeKey]

		if (countryCode === undefined) {
			throw new Error(`Country code key "${this.args.countryCodeKey}" not found in data`)
		}

		// Ignore if empty
		if (!value || !countryCode || !countryCode.trim()) {
			return true
		}

		if (!value.trim()) {
			return false
		}

		return postalCodes.validate(countryCode, value) === true
	}
}
