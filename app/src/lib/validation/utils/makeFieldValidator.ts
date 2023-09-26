import type { IValidator, IFieldValidatorDefinition, IFieldValidator } from '@interfaces'

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
 *    validator: IValidator,
 *   args: {}
 *  },
 *  emailAddress: {
 *   validator: IValidator,
 *   args: {}
 *  }
 * })
 * 
 * const fieldValidators = validators.utils.makeFieldValidator(args)
 * 
 * // fieldValidators = {
 * //   email: {
 * //     required: IValidator,
 * //     emailAddress: IValidator
 * //   }
 */
export default function (definitions: IFieldValidatorDefinition): IFieldValidator {
    const validators: Record<string, IValidator> = {}
    Object.entries(definitions).forEach(([name, { args = {}, validator }]) => {
        validators[name] = validator(args)
    })

    return {
        validators,
        test: async (value): Promise<string[]> => {
            const errors: string[] = []
            for (const [name, validator] of Object.entries(validators)) {
                const passes = await validator.test(value)
                if (!passes) {
                    errors.push(validator.message)
                }
            }
            return errors
        }
    }
}