import type { IFieldValidatorDefinition } from '@interfaces'
import { validators as v } from "@validation"

export default {
    confirmMatch: {
        args: {},
        validator: v.confirmMatch,
    }
} as IFieldValidatorDefinition