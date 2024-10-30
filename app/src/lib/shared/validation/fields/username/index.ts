import { validators as v } from "$shared/validation"

export const username = () =>
	v.String.init().minLength({ minLen: 5 }).maxLength({ maxLen: 20 }).specialCharExcluded()
