import { sentenceCase } from "change-case"

import type { IValidator } from "@interfaces"
import { utils } from "@validation"

/**
 * Validates that a string is not empty
 * 
 * @param args { label?: string }
 * @returns IValidator
 */

export default function ({
    label,
    getMatchValue
}: { 
    label?: string; 
    getMatchValue: () => string 
}): IValidator {
    // if (!args.getMatchValue) {
    //     throw new Error(
    //         "confirmMatch validator requires a getMatchValue function"
    //     )
    // }
    return {
        args: { label, getMatchValue },
        badge: `${label ? sentenceCase(label) + "s" : "Values"
            } Match`,
        key: "confirmMatch",
        message: `The ${label ? label.toLowerCase() + "s" : "values"
            } entered do not match, please try again`,
        popup: utils.makePopup(),
        sticky: false,
        test: async (value: any) => {
            const matchValue = getMatchValue()
            return Boolean(value ? matchValue && value === matchValue : true)
        }
    }
}
