import { utils } from "@validation"

/**
 * Validates that a string is not empty
 * 
 * @param {string} args.label
 * @returns Validator
 */
export default function required({
    label
}: { 
    label?: string 
} = {} ): Validator {
    return {
        args: { label },
        badge: "Required",
        key: "required",
        message: "This field is required",
        popup: utils.popupSettings(),
        sticky: true,
        test: async (value: any) => {
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
}
