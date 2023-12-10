import { utils } from "@validation"

/**
 * Validates that a value is an array
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
        badge: "Is Array",
        key: "isArray",
        message: "An array is required",
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: any[]) => {
            return Array.isArray(value)
        }
    }
}
