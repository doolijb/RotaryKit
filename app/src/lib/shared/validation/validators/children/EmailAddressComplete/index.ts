import { Validator } from "$shared/validation/base"

/**
 * Validates that a string is a valid email address
 */
export class EmailAddressComplete extends Validator {
    args = {}
    badge = "Email Complete"
    key = "emailAddressComplete"
    message = "Must be a valid email address"
    test = async ({key, data}) => {
        const value = data[key]
        return value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) : true
    }
}