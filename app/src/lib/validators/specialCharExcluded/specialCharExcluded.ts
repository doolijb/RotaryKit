import type { IFieldValidator } from "@interfaces"
import utils from "@validators/utils"

/**
 * Validates that a string does not contain spaces or special characters
 * 
 * @param args { label?: string }
 * @returns IFieldValidator
 */

export default function ({ 
    label 
}: {
    label?: string
} = {} ): IFieldValidator {
    return {
        args: { label },
        badge: "Special characters",
        key: "specialChar",
        message: "Must not contain spaces or special characters",
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) => (value ? /^[a-zA-Z0-9_]+$/.test(value) : true)
    }
}
