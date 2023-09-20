import type { IFormValidatorDefinition, IFormValidator, IFieldValidator } from '@interfaces'

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
 *       validator: IValidator,
 *      args: {}
 *     },
 *    emailAddress: {
 *      validator: IValidator,
 *     args: {}
 *   }
 * })
 * 
 * const formValidators = validators.utils.makeFormValidator(args)
 * 
 * // formValidators = {
 * //   email: {
 * //     required: IValidator,
 * //     emailAddress: IValidator
 * //   }
 * 
 * ```
 */

export default function (args: IFormValidatorDefinition): IFormValidator {
    const fields: Record<string, IFieldValidator> = {}
    Object.entries(args).forEach(([name, data]) => {
        fields[name] = data.field(data.args || {})
    })
    return {
        fields,
        test: async (data) => {
            const errors: Record<string, string[]> = {}
            await Promise.all(Object.entries(fields).map(async ([name, field]) => {
                const value = data[name]
                const fieldErrors = await field.test(value)
                if (fieldErrors.length) {
                    errors[name] = fieldErrors
                }
            }))
            return errors
        }
    }
}