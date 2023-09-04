import type { IFieldValidator, IFieldValidatorSetArgs } from '@interfaces'
import type { IFieldValidatorSet } from '@interfaces'

/**
 * Takes an object of validators and extra arguments and 
 * returns a set of validators for the form.
 * 
 * @example
 * ```ts
 * import validators from '@validators'
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
export default function (args: IFieldValidatorSetArgs): IFieldValidatorSet {
    const field: IFieldValidatorSet = {}
    Object.entries(args).forEach(([name, data]) => {
        field[name] = data.validator(data.args || {})
    })
    return field
}