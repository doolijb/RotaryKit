import type { IFieldValidatorSet, IFieldValidatorSetDefs, IFieldValidatorSetDefaultArgs } from '@interfaces'
import { validators as v, utils } from "@validation"

const defaultDefinitions: IFieldValidatorSetDefaultArgs= {
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

export default function (args: IFieldValidatorSetDefs = {}): IFieldValidatorSet {
    const definitions = utils.mergeFieldValidatorSetArgs(defaultDefinitions, args);
    return utils.makeFieldValidatorSet(definitions);
}