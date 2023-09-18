import type { IFieldValidator } from "@interfaces"
import utils from "@validators/utils"

/**
 * Validates that a string is not empty
 * 
 * @param args { label?: string }
 * @returns IFieldValidator
 */

export default function (
    args: { label?: string } = {}
): IFieldValidator {
    return {
        args,
        badge: "Required",
        key: "required",
        message: "This field is required",
        popup: utils.makePopup(),
        sticky: true,
        test: (value: string) => !!value
    }
}
