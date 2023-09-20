import type { IValidator } from "@interfaces"
import { utils } from "@validation"

/**
 * Validates that a string is at most a certain length,
 * Defaults to 20 characters
 * 
 * @param args { label?: string, maxLen: number }
 * @returns IValidator
 */

export default function ({
    label,
    maxLen = 20
}: { 
    label?: string; 
    maxLen?: number
} = {} ): IValidator {
    return {
        args: { label, maxLen },
        badge: "Max length",
        key: "maxLength",
        message: `Must be at most ${maxLen} characters long`,
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) => (value ? value.length <= maxLen : true)
    }
}
