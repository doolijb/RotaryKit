import type { IFieldValidator, IFieldValidatorDefinition } from '@interfaces'
import { validators as v, utils } from "@validation"

const defaultDefinitions: IFieldValidatorDefinition = {
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

export default function (args: IFieldValidatorDefinition = {}): IFieldValidator {
    const definitions = utils.mergeFieldValidatorSetArgs(defaultDefinitions, args)
    return utils.makeFieldValidator(definitions)
}