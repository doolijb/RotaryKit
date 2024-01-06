import { validators as v } from "$validation"

export const postalCode = () => new v.String().minLength(3).maxLength(10).postalCodeComplete({countryCodeKey: "countryCode"})