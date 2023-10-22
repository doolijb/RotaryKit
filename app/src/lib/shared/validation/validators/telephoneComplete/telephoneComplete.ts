import parsePhoneNumber, { type CountryCode } from "libphonenumber-js"
import { utils } from "@validation"

/**
 * Validates that a string contains a complete phone number
 * 
 * @param args { getCountryCode: () => string }
 * @returns IValidator
 */

export default function telephoneComplete(
    args: { label?: string; getCountryCode: () => string } = {
        getCountryCode: null as unknown as () => string
    }
): IValidator {
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
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: string): Promise<boolean> => {
            // Ignore if empty
            if (!value) {
                return true
            }
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
