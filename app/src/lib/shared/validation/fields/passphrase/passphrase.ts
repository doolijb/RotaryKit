import { validators as v } from "@validation"

export default {
    minLength: {
        args: { minLen: 8 },
        validator: v.minLength,
    },
    maxLength: {
        args: { maxLen: 100 },
        validator: v.maxLength,
    },
    specialChar: {
        args: {},
        validator: v.specialCharIncluded,
    },
} as FieldValidatorDefinition