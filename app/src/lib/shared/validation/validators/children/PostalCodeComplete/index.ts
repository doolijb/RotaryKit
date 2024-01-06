import postalCodes from "postal-codes-js"
import { Validator } from "$validation/base"

/**
 * Validates that a string is a valid postal code
 * 
 * @param {string} args.countryCodeKey
 */

export class PostalCodeComplete extends Validator {
    constructor(args: { countryCodeKey: string }) {
        super(args)
        }
    declare args: { countryCodeKey: string }
    badge = "Complete"
    key = "postalCode"
    message = "Must be a valid postal code"
    test = async ({key, data}) => {
        const value: string = data[key]
        const countryCode: string = data[this.args.countryCodeKey]
        
        // Ignore if empty
        if (!value || !value.trim() || !countryCode || !countryCode.trim()) {
            return true
        }

        return postalCodes.validate(countryCode, value) === true
    }
}
