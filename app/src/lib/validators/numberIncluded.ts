import utils from "@validators/utils"
import type { IFieldValidator } from "@interfaces"

export default function (
    args: { label?: string; count: number } = { count: 1 }
): IFieldValidator {
    return {
        args,
        badge: "Number Required",
        key: "numberIncluded",
        message: `Must have at least ${args.count} number${args.count > 1 ? "s" : ""
            }`,
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) => {
            const numbers = value.match(/\d/g) || []
            return value.length ? numbers.length >= args.count : true
        }
    }
}
