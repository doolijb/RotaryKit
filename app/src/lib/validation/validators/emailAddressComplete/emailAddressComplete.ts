import type { IFieldValidator } from "@interfaces"
import { utils } from "@validation"

/**
 * Validates that a string is a valid email address
 * 
 * @param args { label?: string }
 * @returns IFieldValidator
 */

export default function ({
    label,
} : { 
    label?: string 
} = {} ): IFieldValidator {
    return {
        args: { label },
        badge: "Email",
        key: "email",
        message: "Must be a valid email address",
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) =>
            value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) : true
    }
}