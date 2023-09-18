import parsePhoneNumber, { type CountryCode } from "libphonenumber-js"

import type { IFieldValidator } from "@interfaces"
import utils from "@validators/utils"

/**
 * Validates that a string contains a complete phone number
 * 
 * @param args { getCountryCode: () => string }
 * @returns IFieldValidator
 */

export default function (
    args: { label?: string; getCountryCode: () => string } = {
        getCountryCode: null as unknown as () => string
    }
): IFieldValidator {
    if (!args.getCountryCode) {
        throw new Error(
            "telephoneComplete validator requires a getCountryCode function"
        )
    }
    return {
        args,
        badge: "Invalid",
        key: "telephoneComplete",
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
