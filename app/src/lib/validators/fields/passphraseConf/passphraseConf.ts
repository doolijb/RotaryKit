import type { IFieldValidatorSet, IFieldValidatorSetArgs, IFieldValidatorSetDefaultArgs } from '@interfaces'
import validators from '@validators'
import utils from '@validators/utils'

// interface SpecificArgs extends IFieldValidatorSetArgs {
//     getMatchValue: {
//         args: { [key: string]: any },
//     }
// }

const defaultDefinitions: IFieldValidatorSetDefaultArgs = {
    confirmMatch: {
        args: {},
        validator: validators.confirmMatch,
    }
}

export default function (args: IFieldValidatorSetArgs): IFieldValidatorSet {
    const definitions = utils.mergeFieldValidatorSetArgs(defaultDefinitions, args)
    return utils.makeFieldValidatorSet(definitions)
}