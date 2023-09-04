import utils from "@validators/utils"
// import postalCodes from "postal-codes-js" // TODO!!!
import type { IFieldValidator } from "@interfaces"

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
