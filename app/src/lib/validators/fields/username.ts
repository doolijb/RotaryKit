import type { IFieldValidatorSet, IFieldValidatorSetArgs, IFieldValidatorSetDefaultArgs } from '@interfaces'
import validators from '@validators'
import utils from '@validators/utils'

const defaultDefinitions: IFieldValidatorSetDefaultArgs = {
    minLength: {
        args: { minLen: 3 },
        validator: validators.minLength,
    },
    maxLength: {
        args: { maxLen: 20 },
        validator: validators.maxLength,
    },
    specialChar: {
        args: {},
        validator: validators.specialChar,
    },
}

export default function (args: IFieldValidatorSetArgs): IFieldValidatorSet {
    const definitions = utils.mergeFieldValidatorSetArgs(defaultDefinitions, args)
    return utils.makeFieldValidatorSet(definitions)
}