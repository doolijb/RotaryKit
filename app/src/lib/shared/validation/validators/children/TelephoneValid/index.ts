import parsePhoneNumber, { type CountryCode } from "libphonenumber-js"
import { Validator } from "$shared/validation/base"

/**
 * Validates that a string contains a complete phone number
 *
 * @param {string} args.countryCodeKey
 */

export class TelephoneValid extends Validator {
	declare args: { countryCodeKey: string }
	badge = "Invalid"
	key = "telephoneValid"
	message = "Must be a complete and valid phone number"
	test = async ({ key, data }) => {
		const value: string = data[key]
		const countryCode: CountryCode = data[this.args.countryCodeKey]

		// Ignore if empty
		if (!value || !value.trim() || !countryCode || !countryCode.trim()) {
			return true
		}

		const numOnly = value.replace(/\D/g, "")

		const parsedNumber = parsePhoneNumber(numOnly, countryCode)

		return parsedNumber && parsedNumber.isValid()
	}
}
