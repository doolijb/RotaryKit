import parsePhoneNumber, { type CountryCode } from "libphonenumber-js"
import type { IFieldValidator } from "@interfaces"
import utils from "@validators/utils"


export default function (
    args: { label?: string; getCountryCode: () => string } = {
        getCountryCode: null as unknown as () => string
    }
): IFieldValidator {
    if (!args.getCountryCode) {
        throw new Error(
            "completeTelephoneValidator requires a getCountryCode function"
        )
    }
    return {
        args,
        badge: "Invalid",
        key: "completeTelephone",
        message: "Must be a complete phone number",
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) => {
            const numOnly = value.replace(/\D/g, "")
            const countryCode = args.getCountryCode() as CountryCode
            const parsedNumber = parsePhoneNumber(numOnly, countryCode)
            if (!parsedNumber) {
                return false
            }
            return value && parsedNumber.isPossible()
                ? parsedNumber && parsedNumber.isValid()
                : true
        }
    }
}
