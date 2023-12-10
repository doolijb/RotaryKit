import { utils } from "@validation"
import deepmerge from "deepmerge"

/**
 * Takes an object of form fields, their validators and
 * extra arguments and returns a set of validators for the form.
 *
 * @param {FormValidatorDefinition} args.definitions - The form fields and their validators
 * @param {FormValidatorDefinition} args.extras - Extra validators to add to the form, optional
 *
 * @example
 * ```ts
 * import { validators as v } from "@validation"
 *
 * export default function (args: {
 *    email: {
 *      required: {
 *       validator: Validator,
 *      args: {}
 *     },
 *    emailAddress: {
 *      validator: Validator,
 *     args: {}
 *   }
 * })
 *
 * const formValidators = validators.utils.formValidator(args)
 *
 * // formValidators = {
 * //   email: {
 * //     required: Validator,
 * //     emailAddress: Validator
 * //   }
 *
 * ```
 */

export default function formValidator({
	definitions,
	extras = undefined
}: {
	definitions: FormValidatorDefinition
	extras?: FormValidatorDefinition
}): FormValidator {
	const fields: Record<string, FieldValidator> = {}
	const final = !!extras ? deepmerge(definitions, extras) : definitions
	Object.entries(final).forEach(([name, def]) => {
		fields[name] = utils.fieldValidator({ definition: def })
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
		test: async (data: { [key in keyof typeof fields]?: any }): Promise<{
			[key in keyof typeof fields]?: { [key: string]: string }
		}> => {
			const errors: FormErrors = {}

			const tests = Object.entries(fields).map(async ([name, field]) => {
				const result = await field.test(data[name])
				if (Object.entries(result).length > 0) {
					errors[name] = result
				}
			})

			await Promise.all(tests)

			return errors
		}
	}
}
