import type { IFieldValidatorSet, IFieldValidatorSetArgs, IFieldValidatorSetDefaultArgs } from '@interfaces'
import validators from '@validators'
import utils from '@validators/utils'

const defaultDefinitions: IFieldValidatorSetDefaultArgs= {
    minLength: {
        args: { minLen: 8 },
        validator: validators.minLength,
    },
    maxLength: {
        args: { maxLen: 100 },
        validator: validators.maxLength,
    },
    specialChar: {
        args: {},
        validator: validators.specialCharIncluded,
    },
}

export default function (args: IFieldValidatorSetArgs = {}): IFieldValidatorSet {
    const definitions = utils.mergeFieldValidatorSetArgs(defaultDefinitions, args);
    return utils.makeFieldValidatorSet(definitions);
}