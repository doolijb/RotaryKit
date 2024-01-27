import parsePhoneNumber, { type CountryCode } from "libphonenumber-js"
import { Validator } from "$validation/base"

const types = "string"

/**
 * Validates that a string contains a possible phone number,
 * useful for validating when a user is still typing
 * 
 * @param {string} args.countryCodeKey
 * @returns Validator
 */

export class TelephonePossible extends Validator {
    declare args: { countryCodeKey: string }
    badge = "Partial"
    key = "telephonePossible"
    message = "You must enter a valid phone number"
    test = async ({key, data}) => {
        const value: string = data[key]
        const countryCode: CountryCode = data[this.args.countryCodeKey]

        // Ignore if empty
        if (!value || !value.trim() || !countryCode || !countryCode.trim()) {
            return true
        }

        const numOnly = value.replace(/\D/g, "")
        const parsedNumber = parsePhoneNumber(numOnly, countryCode)
        return Boolean(value ? (parsedNumber && parsedNumber.isPossible()) : true)
    }
}