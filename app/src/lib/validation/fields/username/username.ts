import type { IFieldValidatorSet, IFieldValidatorSetDefs, IFieldValidatorSetDefaultArgs } from '@interfaces'
import { validators as v, utils } from "@validation"

const defaultDefinitions: IFieldValidatorSetDefaultArgs = {
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

export default function (args: IFieldValidatorSetDefs = {}): IFieldValidatorSet {
    const definitions = utils.mergeFieldValidatorSetArgs(defaultDefinitions, args)
    return utils.makeFieldValidatorSet(definitions)
}