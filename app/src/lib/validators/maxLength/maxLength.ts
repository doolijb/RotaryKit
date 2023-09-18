import type { IFieldValidator } from "@interfaces"
import utils from "@validators/utils"

/**
 * Validates that a string is at most a certain length,
 * Defaults to 20 characters
 * 
 * @param args { label?: string, maxLen: number }
 * @returns IFieldValidator
 */

export default function (
    args: { label?: string; maxLen: number } = { maxLen: 20 }
): IFieldValidator {
    return {
        args,
        badge: "Max length",
        key: "maxLength",
        message: `Must be at most ${args.maxLen} characters long`,
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) => (value ? value.length <= args.maxLen : true)
    }
}
