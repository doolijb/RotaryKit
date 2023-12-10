import deepmerge from "deepmerge"

/**
 * TODO
 */

export default function fieldValidator({
	definition,
	extras = undefined
}: {
	definition: FieldValidatorDefinition
	extras?: FieldValidatorDefinition
}): FieldValidator {
	const validators: Record<string, Validator> = {}
	const final = !!extras ? deepmerge(definition, extras) : definition
	Object.entries(final).forEach(([name, def]) => {
        validators[name] = def.validator(def.args)
	})
	return {
		validators,
		test: async (value = ""): Promise<{ [key: string]: string }> => {
			const errors = {}
			for (const [name, validator] of Object.entries(validators)) {
				const passes = await validator.test(value)
				if (!passes) {
					errors[name] = validator.message
				}
			}
			return errors
		}
	}
}
