import { utils } from "@validation"

/**
 * Validates that a string contains at least one number
 * 
 * @param {string} args.label
 * @param {number} args.count
 * @returns Validator
 */

export default function numberIncluded({ 
    label,
    count = 1
}: {
    label?: string; 
    count?: number
} = {} ): Validator {
    return {
        args: { label, count },
        badge: "Number Required",
        key: "numberIncluded",
        message: `Must have at least ${count} number${count > 1 ? "s" : ""
            }`,
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: string): Promise<boolean> => {
            const numbers = value.match(/\d/g) || []
            return value.length ? numbers.length >= count : true
        }
    }
}
