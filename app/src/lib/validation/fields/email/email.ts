import type { IFieldValidatorDefinition } from '@interfaces'
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
    emailAddress: {
        args: {},
        validator: v.emailAddressComplete,
    },
} as IFieldValidatorDefinition