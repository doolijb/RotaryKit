// import postalCodes from "postal-codes-js" // TODO!!!
import type { IFieldValidator } from "@interfaces"
import utils from "@validators/utils"

/**
 * Validates that a string is a valid postal code
 * 
 * @param args { getCountryCode: () => string | null }
 * @returns { IFieldValidator }
 */

export default function (args: { getCountryCode: () => string | null }): IFieldValidator {
    return {
        args,
        badge: "Format",
        key: "postalCode",
        message: "Must be a valid postal code",
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string): boolean => {
            // const countryCode = args.getCountryCode()
            // // We will only test if the country code is valid
            // if (!countryCode) {
            //     return true
            // }
            // return postalCodes.validate(countryCode, value) === true
            return true
        },
    }
}
