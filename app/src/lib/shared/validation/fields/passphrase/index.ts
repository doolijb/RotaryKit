import { validators as v } from "$validation"

export const passphrase = () => v.String.init().minLength({minLen:8}).maxLength({maxLen:100}).specialCharIncluded()