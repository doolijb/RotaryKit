import type { IFieldValidator } from "@interfaces"
import { utils } from "@validation"

/**
 * Validates that a string contains at least one uppercase letter
 * 
 * @param args { count: number }
 * @returns IFieldValidator
 */

export default function (
    args: { label?: string; count: number } = { count: 1 }
): IFieldValidator {
    return {
        args,
        badge: "Uppercase Required",
        key: "uppercaseRequired",
        message: `Must have at least ${args.count} uppercase letter${args.count > 1 ? "s" : ""
            }`,
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) => {
            const uppercase = value.match(/[A-Z]/g) || []
            return value ? uppercase && uppercase.length >= args.count : true
        }
    }
}
