import type { IFieldValidatorSet, IFieldValidatorSetDefs, IFieldValidatorSetDefaultArgs } from '@interfaces'
import { validators as v, utils } from "@validation"

const defaultDefinitions: IFieldValidatorSetDefaultArgs = {
    confirmMatch: {
        args: {},
        validator: v.confirmMatch,
    }
}

export default function (args: IFieldValidatorSetDefs = {}): IFieldValidatorSet {
    const definitions = utils.mergeFieldValidatorSetArgs(defaultDefinitions, args)
    return utils.makeFieldValidatorSet(definitions)
}