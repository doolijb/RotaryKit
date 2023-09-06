import utils from "@validators/utils"
import parsePhoneNumber, { type CountryCode } from "libphonenumber-js"
import type { IFieldValidator } from "@interfaces"

export default function (args: {
    label?: string
    getCountryCode: () => string
}): IFieldValidator {
    if (!args.getCountryCode) {
        throw new Error(
            "telephonePossible validator requires a getCountryCode function"
        )
    }
    return {
        args,
        badge: "Partial",
        key: "telephonePossible",
        message: "You must enter a valid phone number",
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) => {
            const numOnly = value.replace(/\D/g, "")
            const countryCode = args.getCountryCode() as CountryCode
            const parsedNumber = parsePhoneNumber(numOnly, countryCode)
            return Boolean(value ? (parsedNumber && parsedNumber.isPossible()) : true)
        }
    }
}
