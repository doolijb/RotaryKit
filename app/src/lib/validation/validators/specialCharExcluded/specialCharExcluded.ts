import type { IValidator } from "@interfaces"
import { validators as v, utils } from "@validation"

/**
 * Validates that a string does not contain spaces or special characters
 * 
 * @param args { label?: string }
 * @returns IValidator
 */

export default function specialCharExcluded({ 
    label 
}: {
    label?: string
} = {} ): IValidator {
    return {
        args: { label },
        badge: "Special characters",
        key: "specialChar",
        message: "Must not contain spaces or special characters",
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: string): Promise<boolean> => (value ? /^[a-zA-Z0-9_]+$/.test(value) : true)
    }
}
