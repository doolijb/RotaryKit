import type { IFieldValidatorDefinition } from '@interfaces'
import { validators as v } from "@validation"

export default {
    matches: {
        args: {},
        validator: v.matches,
    }
} as IFieldValidatorDefinition