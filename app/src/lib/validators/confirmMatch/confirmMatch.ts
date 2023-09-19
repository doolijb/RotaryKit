import { sentenceCase } from "change-case"

import type { IFieldValidator } from "@interfaces"
import utils from "@validators/utils"

/**
 * Validates that a string is not empty
 * 
 * @param args { label?: string }
 * @returns IFieldValidator
 */

export default function ({
    label,
    getMatchValue
}: { 
    label?: string; 
    getMatchValue: () => string 
}): IFieldValidator {
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
        test: (value: any) => {
            const matchValue = getMatchValue()
            return Boolean(value ? matchValue && value === matchValue : true)
        }
    }
}
