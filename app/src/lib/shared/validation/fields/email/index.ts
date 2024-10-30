import { validators as v } from "$shared/validation"

export const email = () => v.String.init().emailAddressValid()
