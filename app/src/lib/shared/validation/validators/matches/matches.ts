import { sentenceCase } from "change-case"
import { utils } from "@validation"

/**
 * Validates that a string is not empty
 * 
 * @param args { label?: string }
 * @returns Validator
 */

export default function matches({
    label,
    getValue
}: { 
    label?: string; 
    getValue: () => string 
}): Validator {
    if (!getValue) {
        throw new Error(
            "matches validator requires a getValue function"
        )
    }
    return {
        args: { label, getValue },
        badge: `${label ? sentenceCase(label) + "s" : "Values"
            } Match`,
        key: "matches",
        message: `The ${label ? label.toLowerCase() + "s" : "values"
            } entered do not match, please try again`,
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: any): Promise<boolean> => {
            if (!value) return true
            return getValue() === value
        }
    }
}
