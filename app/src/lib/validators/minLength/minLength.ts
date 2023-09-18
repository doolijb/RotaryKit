import type { IFieldValidator } from "@interfaces"
import utils from "@validators/utils"

/**
 * Validates that a string is at least a certain length,
 * Defaults to 3 characters
 * 
 * @param args { label?: string, minLen: number }
 * @returns IFieldValidator
 */

export default function ({ 
    label, 
    minLen = 3 
}: { 
    label?: string,
    minLen?: number
} = {} ): IFieldValidator {
    return {
        args: { label, minLen },
        badge: "Min length",
        key: "minLength",
        message: `Must be at least ${minLen} characters long`,
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) => (value ? value.length >= minLen : true)
    }
}
