import { validators as v } from "@validation"

export default {
    minLength: {
        args: { minLen: 3 },
        validator: v.minLength,
    },
    maxLength: {
        args: { maxLen: 10 },
        validator: v.maxLength,
    },
    postalCodeComplete: {
        args: {},
        validator: v.postalCodeComplete,
    }
} as FieldValidatorDefinition