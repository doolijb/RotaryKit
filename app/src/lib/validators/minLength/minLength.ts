import type { IFieldValidator } from "@interfaces"
import utils from "@validators/utils"

/**
 * Validates that a string is at least a certain length,
 * Defaults to 3 characters
 * 
 * @param args { label?: string, minLen: number }
 * @returns IFieldValidator
 */

export default function (
    args: { label?: string; minLen: number } = { minLen: 3 }
): IFieldValidator {
    return {
        args,
        badge: "Min length",
        key: "minLength",
        message: `Must be at least ${args.minLen} characters long`,
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) => (value ? value.length >= args.minLen : true)
    }
}
