import { validators as v } from "$shared/validation"

export const postalCode = () => v.String.init().minLength(3).maxLength(10).postalCodeValid({countryCodeKey: "countryCode"})