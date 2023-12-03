import postalCodes from "postal-codes-js"
import { validators as v, utils } from "@validation"

/**
 * Validates that a string is a valid postal code
 * 
 * @param {string} args.label
 * @param {() => string} args.getCountryCode
 * @returns { Validator }
 */

export default function postalCodeComplete({
    label,
    getCountryCode
}: { 
    label?: string,
    getCountryCode: () => string
}
): Validator {
    if (!getCountryCode) {
        throw new Error("getCountryCode is required")
    }
    return {
        args: { label, getCountryCode },
        badge: "Format",
        key: "postalCode",
        message: "Must be a valid postal code",
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: string): Promise<boolean> => {
            // Ignore if empty
            if (!value) {
                return true
            }
            const countryCode = getCountryCode()
            // We will only test if the country code is valid
            if (!countryCode) {
                return true
            }
            return postalCodes.validate(countryCode, value) === true
        },
    }
}
