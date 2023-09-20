import postalCodes from "postal-codes-js"
import type { IFieldValidator } from "@interfaces"
import { validators as v, utils } from "@validation"

/**
 * Validates that a string is a valid postal code
 * 
 * @param args { getCountryCode: () => string | null }
 * @returns { IFieldValidator }
 */

export default function ({
    label,
    getCountryCode
}: { 
    label?: string,
    getCountryCode: () => string | null 
}
): IFieldValidator {
    return {
        args: { label, getCountryCode },
        badge: "Format",
        key: "postalCode",
        message: "Must be a valid postal code",
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string): boolean => {
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
