import type { IFieldValidator, IFieldValidatorDefinition } from '@interfaces'
import { validators as v, utils } from "@validation"

export const definition: IFieldValidatorDefinition = {
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
}

/**
 * Instantiates the field
 * 
 * @param args IFieldValidatorDefinition // Additional definitions
 * @returns IFieldValidator
 */
export function field (args: IFieldValidatorDefinition = {}): IFieldValidator {
    const final = utils.mergeFieldValidatorSetArgs(definition, args)
    return utils.makeFieldValidator(final)
}

export default {
    definition,
    field,
}