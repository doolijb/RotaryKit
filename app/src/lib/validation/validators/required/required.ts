import type { IFieldValidator } from "@interfaces"
import { utils } from "@validation"

/**
 * Validates that a string is not empty
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
        badge: "Required",
        key: "required",
        message: "This field is required",
        popup: utils.makePopup(),
        sticky: true,
        test: (value: string) => !!value
    }
}
