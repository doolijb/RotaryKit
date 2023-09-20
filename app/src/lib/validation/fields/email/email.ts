import type { IFieldValidator, IFieldValidatorDefinition } from '@interfaces'
import { validators as v, utils } from "@validation"

const defaultDefinitions: IFieldValidatorDefinition = {
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

export default function (args: IFieldValidatorDefinition = {}): IFieldValidator {
    const definitions = utils.mergeFieldValidatorSetArgs(defaultDefinitions, args)
    return utils.makeFieldValidator(definitions)
}