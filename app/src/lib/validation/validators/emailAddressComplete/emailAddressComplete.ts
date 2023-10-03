import type { IValidator } from "@interfaces"
import { utils } from "@validation"

/**
 * Validates that a string is a valid email address
 * 
 * @param args { label?: string }
 * @returns IValidator
 */

export default function emailAddressComplete({
    label,
} : { 
    label?: string 
} = {} ): IValidator {
    return {
        args: { label },
        badge: "Email",
        key: "email",
        message: "Must be a valid email address",
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: string): Promise<boolean> =>
            value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) : true
    }
}
