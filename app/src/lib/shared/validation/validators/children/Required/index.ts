import { Validator } from "$validation/base"

/**
 * Validates that a string is not empty
 */
export class Required extends Validator {
    badge = "Required"
    key = "required"
    message = "This field is required"
    sticky = true
    test = async ({key, data}) => {
        const value: unknown = data[key]
        
        // If string or array, check length
        if (typeof value === "string" || Array.isArray(value)) {
            return value.length > 0
        }

        // If number, check if not NaN
        if (typeof value === "number") {
            return !isNaN(value)
        }

        // Else, undefined?
        return value !== undefined
    }
}