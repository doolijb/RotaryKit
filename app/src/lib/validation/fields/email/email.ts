import type { IFieldValidator, IFieldValidatorDefinition } from '@interfaces'
import { validators as v, utils } from "@validation"

const definition: IFieldValidatorDefinition = {
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
}

/**
 * Instantiates the field
 * 
 * @param args IFieldValidatorDefinition // Additional definitions
 * @returns IFieldValidator
 */
function field (args: IFieldValidatorDefinition = {}): IFieldValidator {
    const definitions = utils.mergeFieldValidatorSetArgs(definition, args)
    return utils.makeFieldValidator(definitions)
}

export default {
    definition,
    field,
}