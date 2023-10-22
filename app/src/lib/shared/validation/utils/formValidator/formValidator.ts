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
 *       validator: IValidator,
 *      args: {}
 *     },
 *    emailAddress: {
 *      validator: IValidator,
 *     args: {}
 *   }
 * })
 * 
 * const formValidators = validators.utils.formValidator(args)
 * 
 * // formValidators = {
 * //   email: {
 * //     required: IValidator,
 * //     emailAddress: IValidator
 * //   }
 * 
 * ```
 */

export default function ({
    definitions, 
    extras = null
}: {
    definitions: FormValidatorDefinition, 
    extras?: FormValidatorDefinition
}): FormValidator {
    const fields: Record<string, FieldValidator> = {}
    const final = extras ? utils.mergeFormValidatorDefinitions({definitions, extras}) : definitions
    Object.entries(final).forEach(([name, def]) => {
        fields[name] = utils.fieldValidator({definition:def})
    })
    const requiredFields: string[] = []
            Object.entries(fields).forEach(([name, field]) => {
                if (field.validators.required) {
                    requiredFields.push(name)
                }
            })
    return {
        fields,
        requiredFields,
        test: async (data) => {
            const errors: FormErrors = {}
            for (const [name, field] of Object.entries(fields)) {

                const result = await field.test(data[name])

                if (Object.entries(result).length > 0) {
                    errors[name] = result
                }
            }   

            return errors
        }
    }
}