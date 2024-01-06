import parsePhoneNumber, { type CountryCode } from "libphonenumber-js"
import { Validator } from "$validation/base"

/**
 * Validates that a string contains a complete phone number
 * 
 * @param {string} args.countryCodeKey
 */

export class TelephoneComplete extends Validator {
    constructor(args: { countryCodeKey: string }) {
        super(args)
    }
    declare args: { countryCodeKey: string }
    badge = "Invalid"
    key = "telephoneComplete"
    message = "Must be a complete phone number"
    test = async ({key, data}) => {
        const value: string = data[key]
        const countryCode: CountryCode = data[this.args.countryCodeKey]

        // Ignore if empty
        if (!value || !value.trim() || !countryCode || !countryCode.trim()) {
            return true
        }

        const numOnly = value.replace(/\D/g, "")

        const parsedNumber = parsePhoneNumber(numOnly, countryCode)

        if (!parsedNumber) {
            return false
        }

        return value && parsedNumber.isPossible()
            ? parsedNumber && parsedNumber.isValid()
            : true
    }
}