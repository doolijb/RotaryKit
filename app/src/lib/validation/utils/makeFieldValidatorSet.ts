import type { IFieldValidator, IFieldValidatorSetDefs } from '@interfaces'
import type { IFieldValidatorSet } from '@interfaces'

/**
 * Takes an object of validators and extra arguments and 
 * returns a set of validators for the form.
 * 
 * @example
 * ```ts
 * import { validators as v } from "@validation"
 * 
 * export default function (args: {
 *  required: {
 *    validator: IFieldValidator,
 *   args: {}
 *  },
 *  emailAddress: {
 *   validator: IFieldValidator,
 *   args: {}
 *  }
 * })
 * 
 * const fieldValidators = validators.utils.makeFieldValidatorSet(args)
 * 
 * // fieldValidators = {
 * //   email: {
 * //     required: IFieldValidator,
 * //     emailAddress: IFieldValidator
 * //   }
 */
export default function (definitions: IFieldValidatorSetDefs): IFieldValidatorSet {
    const fieldValidators: IFieldValidatorSet = {}
    Object.entries(definitions).forEach(([key, { args, validator }]) => {
        fieldValidators[key] = validator(args);
    })
    return fieldValidators
}