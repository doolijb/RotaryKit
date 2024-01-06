import { validators as v } from "$validation"

export const email = () =>  new v.String().minLength(8).maxLength(100).emailAddressComplete()