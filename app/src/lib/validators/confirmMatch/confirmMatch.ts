import { sentenceCase } from "change-case"

import type { IFieldValidator } from "@interfaces"
import utils from "@validators/utils"

/**
 * Validates that a string is not empty
 * 
 * @param args { label?: string }
 * @returns IFieldValidator
 */

export default function (
    args: { label?: string; getMatchValue: () => string } = {
        getMatchValue: null as unknown as () => string
    }
): IFieldValidator {
    if (!args.getMatchValue) {
        throw new Error(
            "confirmMatchValidator requires a getMatchValue function"
        )
    }
    return {
        args,
        badge: `${args.label ? sentenceCase(args.label) + "s" : "Values"
            } Match`,
        key: "confirmMatch",
        message: `The ${args.label ? args.label.toLowerCase() + "s" : "values"
            } entered does not match, please try again`,
        popup: utils.makePopup(),
        sticky: false,
        test: (value: any) => {
            const matchValue = args.getMatchValue()
            return Boolean(value ? matchValue && value === matchValue : true)
        }
    }
}
