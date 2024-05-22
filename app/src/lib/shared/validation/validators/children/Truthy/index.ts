import { Validator } from "$shared/validation/base"

/**
 * Validates that a string is not empty
 */
export class Truthy extends Validator {
    badge = "Must Check"
    key = "truthy"
    message = "This field must be checked"
    isSticky = true
    test = async ({key, data}) => {
        const value: boolean = data[key]
        return value
    }
}