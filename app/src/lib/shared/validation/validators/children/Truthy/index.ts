import { Validator } from "$shared/validation/base"

/**
 * Validates that a value is true or a positive number
 */
export class Truthy extends Validator {
    badge = "Must Check"
    key = "truthy"
    message = "This field must be checked"
    isSticky = true
    test = async ({key, data}) => {
        const value: boolean | number = data[key]
        if (value == null || value == undefined) return true // Empty is valid
        if (typeof value === "number") {
            return value > 0
        }
        if (typeof value === "boolean") {
            return value
        }
        return false
    }
}