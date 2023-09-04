import type { IFieldValidator } from "@interfaces"
import utils from "@validators/utils"

export default function (
    args: { label?: string; minLen: number } = { minLen: 3 }
): IFieldValidator {
    return {
        args,
        badge: "Min length",
        key: "minLength",
        message: `Must be at least ${args.minLen} characters long`,
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) => (value ? value.length >= args.minLen : true)
    }
}
