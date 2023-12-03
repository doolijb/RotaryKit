import { utils } from "@validation"

/**
 * Validates that a string is at most a certain length,
 * Defaults to 20 characters
 * 
 * @param args { label?: string, maxLen: number }
 * @returns Validator
 */

export default function maxLength({
    label,
    maxLen = 20
}: { 
    label?: string; 
    maxLen?: number
} = {} ): Validator {
    return {
        args: { label, maxLen },
        badge: "Max length",
        key: "maxLength",
        message: `Must be at most ${maxLen} characters long`,
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: string): Promise<boolean> => (value ? value.length <= maxLen : true)
    }
}
