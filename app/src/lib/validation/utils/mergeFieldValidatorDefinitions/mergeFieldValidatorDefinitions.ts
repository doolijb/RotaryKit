import type { IFieldValidatorDefinition } from "@interfaces"
/**
 * Merge default definitions with custom args
 * If a custom definition is provided, it will override the default
 * If a new definition is provided, it will be added to the set
 * @param definitions: IValidatorSetArgs 
 * @param extras: IValidatorSetArgs 
 * @returns IValidatorSetArgs
 */

export default function mergeFieldValidatorDefinitions({
    definition, 
    extras
}: {
    definition: IFieldValidatorDefinition, 
    extras?: IFieldValidatorDefinition
}): IFieldValidatorDefinition {
    
    // Merge extras into definitions, extras will override definitions where values are not null
    Object.entries(extras).forEach(([key, {args = {}, validator = null}]) => {
        // Check if the key exists in definitions
        if (!definition[key]) {
            definition[key] = {args, validator}
        } else {
            // If the key exists, check if the validator is null
            if (validator) {
                definition[key].validator = validator
            }
            // Merge args
            if (args) {
                Object.entries(args).forEach(([argKey, argValue]) => {
                    if (!definition[key].args) definition[key].args = {}
                    definition[key].args[argKey] = argValue
                }) 
            }
        }
    })
    
    // Check if dev server or test suite is running
    if ([undefined, "development", "test"].includes(process.env.NODE_ENV)) {
        // Check if any definitions are missing a validator
        Object.entries(definition).forEach(([key, {validator}]) => {
            if (!validator) {
                throw new Error(`Validator for ${key} is missing, check the definitions for this field`)
            }
        })
    }

    return definition
}