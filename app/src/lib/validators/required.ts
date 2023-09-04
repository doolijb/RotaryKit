import utils from "@validators/utils"
import type { IFieldValidator } from "@interfaces"

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
