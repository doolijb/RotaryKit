import { validators as v } from "@validation"

export default {
    minLength: {
        args: { minLen: 3 },
        validator: v.minLength,
    },
    maxLength: {
        args: { maxLen: 20 },
        validator: v.maxLength,
    },
    specialCharExcluded: {
        args: {},
        validator: v.specialCharExcluded,
    },
} as FieldValidatorDefinition