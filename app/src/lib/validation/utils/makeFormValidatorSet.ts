import type { IFormValidatorSetArgs, IFormValidatorSet } from '@interfaces'
import { utils } from "@validation"

/**
 * Takes an object of form fields, their validators and 
 * extra arguments and returns a set of validators for the form.
 * 
 * @example
 * ```ts
 * import { validators as v } from "@validation"
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