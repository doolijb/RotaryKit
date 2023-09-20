import type { IFieldValidator, IFieldValidatorDefinition } from '@interfaces'
import { validators as v, utils } from "@validation"

const defaultDefinitions: IFieldValidatorDefinition = {
    confirmMatch: {
        args: {},
        validator: v.confirmMatch,
    }
}

export default function (args: IFieldValidatorDefinition = {}): IFieldValidator {
    const definitions = utils.mergeFieldValidatorSetArgs(defaultDefinitions, args)
    return utils.makeFieldValidator(definitions)
}