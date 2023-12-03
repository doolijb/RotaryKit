import { validators as v, utils } from "@validation"

/**
 * Validates that a string is at least a certain length,
 * Defaults to 3 characters
 * 
 * @param {string} args.label
 * @param {number} args.minLen
 * @returns Validator
 */
export default function minLength({ 
    label, 
    minLen = 3 
}: { 
    label?: string,
    minLen?: number
} = {} ): Validator {
    return {
        args: { label, minLen },
        badge: "Min length",
        key: "minLength",
        message: `Must be at least ${minLen} characters long`,
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: string): Promise<boolean> => (value ? value.length >= minLen : true)
    }
}
