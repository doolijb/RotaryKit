import type { IFieldValidator, IFieldValidatorDefinition } from '@interfaces'
import { validators as v, utils } from "@validation"

const definition: IFieldValidatorDefinition = {
    confirmMatch: {
        args: {},
        validator: v.confirmMatch,
    }
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