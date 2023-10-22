import utils from '..'

/**
 * TODO
 */

export default function ({
    definition, 
    extras = null 
}: {
    definition: FieldValidatorDefinition, 
    extras?: FieldValidatorDefinition
}): FieldValidator {
    if (!definition) throw new Error("definition is required, instead got:", definition)
    const validators: Record<string, IValidator> = {}
    const final = extras ? utils.mergeFieldValidatorDefinitions({definition, extras}) : definition
    Object.entries(final).forEach(([name, def]) => {
        validators[name] = def.validator(def.args)
    })
    return {
        validators,
        test: async (value): Promise<{[key: string]: string}> => {
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