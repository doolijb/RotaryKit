import type { IFieldValidatorSet, IFieldValidatorSetDefs, IFieldValidatorSetDefaultArgs } from '@interfaces'
import validators from '@validators'
import utils from '@validators/utils'

const defaultDefinitions: IFieldValidatorSetDefaultArgs = {
    confirmMatch: {
        args: {},
        validator: validators.confirmMatch,
    }
}

export default function (args: IFieldValidatorSetDefs = {}): IFieldValidatorSet {
    const definitions = utils.mergeFieldValidatorSetArgs(defaultDefinitions, args)
    return utils.makeFieldValidatorSet(definitions)
}