import type { IFieldValidator, IFieldValidatorDefinition } from '@interfaces'
import { validators as v, utils } from "@validation"

const definition: IFieldValidatorDefinition = {
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
}

/**
 * Instantiates the field
 * 
 * @param args IFieldValidatorDefinition // Additional definitions
 * @returns IFieldValidator
 */
function field (args: IFieldValidatorDefinition = {}): IFieldValidator {
    const final = utils.mergeFieldValidatorSetArgs(definition, args)
    return utils.makeFieldValidator(final)
}

export default {
    definition,
    field,
}