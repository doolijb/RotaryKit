import { Validator } from "$validation/base"

/**
 * Validates that a string does not contain spaces or special characters
 * 
 */
export class SpecialCharExcluded extends Validator {
    badge = "No special characters"
    key = "specialChar"
    message = "Must not contain spaces or special characters"
    test = async ({key, data}) => {
        const value: string = data[key]
        return (value ? /^[a-zA-Z0-9_]+$/.test(value) : true)
    }
}
