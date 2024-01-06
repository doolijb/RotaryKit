import { validators as v } from "$validation"

export const username = () => new v.String().minLength(5).maxLength(20).specialCharExcluded()
