import { validators as v, utils } from "@validation"

/**
 * Validates that a string contains at least one lowercase letter
 * 
 * @param args { label?: string, count: number }
 * @returns IValidator
 */

export default function lowercaseRequired({ 
    label,
    count = 1
 } : { 
    label?: string; 
    count?: number 
} = {} ): IValidator {
    return {
        args: { label, count },
        badge: "Lowercase Required",
        key: "lowercaseRequired",
        message: `Must have at least ${count} lowercase letter${count > 1 ? "s" : ""
            }`,
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: string): Promise<boolean> => {
            const lowercase = value.match(/[a-z]/g) || []
            return value ? lowercase && lowercase.length >= count : true
        }
    }
}