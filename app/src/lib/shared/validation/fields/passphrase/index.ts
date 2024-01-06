import { validators as v } from "$validation"

export const passphrase = () => new v.String().minLength(8).maxLength(100).specialCharIncluded()