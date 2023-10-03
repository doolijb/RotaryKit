import type { IValidator } from "@interfaces"
import { utils } from "@validation"

/**
 * Validates that a string contains at least one uppercase letter
 * 
 * @param args { count: number }
 * @returns IValidator
 */

export default function uppercaseIncluded(
    args: { label?: string; count: number } = { count: 1 }
): IValidator {
    return {
        args,
        badge: "Uppercase Required",
        key: "uppercaseRequired",
        message: `Must have at least ${args.count} uppercase letter${args.count > 1 ? "s" : ""
            }`,
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: string): Promise<boolean> => {
            const uppercase = value.match(/[A-Z]/g) || []
            return value ? uppercase && uppercase.length >= args.count : true
        }
    }
}
