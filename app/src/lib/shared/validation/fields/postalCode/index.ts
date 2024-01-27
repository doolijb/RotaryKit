import { validators as v } from "$validation"

export const postalCode = () => v.String.init().minLength(3).maxLength(10).postalCodeComplete({countryCodeKey: "countryCode"})