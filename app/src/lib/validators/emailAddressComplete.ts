import utils from "@validators/utils"
import type { IFieldValidator } from "@interfaces"

export default function (
    args: { label?: string } = {}
): IFieldValidator {
    return {
        args,
        badge: "Email",
        key: "email",
        message: "Must be a valid email address",
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) =>
            value ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) : true
    }
}
