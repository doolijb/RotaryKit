import type { IFormValidatorSetArgs } from '@interfaces'
import type { IFormValidatorSet } from '@interfaces'
import utils from '@validators/utils'

/**
 * Takes an object of form fields, their validators and 
 * extra arguments and returns a set of validators for the form.
 * 
 * @example
 * ```ts
 * import validators from '@validators'
 * 
 * export default function (args: {
 *    email: {
 *      required: {
 *       validator: IFieldValidator,
 *      args: {}
 *     },
 *    emailAddress: {
 *      validator: IFieldValidator,
 *     args: {}
 *   }
 * })
 * 
 * const formValidators = validators.utils.makeFormValidatorSet(args)
 * 
 * // formValidators = {
 * //   email: {
 * //     required: IFieldValidator,
 * //     emailAddress: IFieldValidator
 * //   }
 * 
 * ```
 */
export default function (args: IFormValidatorSetArgs): IFormValidatorSet {
    const fields: IFormValidatorSet = {}
    Object.entries(args).forEach(([name, data]) => {
        fields[name] = data.field(data.args || {})
    })
    return fields
}