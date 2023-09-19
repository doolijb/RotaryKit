import type { IFieldValidatorSetDefs } from "@interfaces"
/**
 * Merge default definitions with custom args
 * If a custom definition is provided, it will override the default
 * If a new definition is provided, it will be added to the set
 * @param definitions: IFieldValidatorSetArgs 
 * @param extraArgs: IFieldValidatorSetArgs 
 * @returns IFieldValidatorSetArgs
 */

export default function (definitions: IFieldValidatorSetDefs, extraArgs: IFieldValidatorSetDefs): IFieldValidatorSetDefs {
    
    // Merge extraArgs into definitions, extraArgs will override definitions where values are not null
    Object.entries(extraArgs).forEach(([key, {args = {}, validator = null}]) => {
        // Check if the key exists in definitions
        if (!definitions[key]) {
            definitions[key] = {args, validator}
        } else {
            // If the key exists, check if the validator is null
            if (validator) {
                definitions[key].validator = validator
            }
            // Merge the args
            if (args) {
                definitions[key].args = {
                    ...definitions[key].args,
                    ...args
                }
            }
        }
    })
    
    // Check if dev server or test suite is running
    if ([undefined, "development", "test"].includes(process.env.NODE_ENV)) {
        // Check if any definitions are missing a validator
        Object.entries(definitions).forEach(([key, {validator}]) => {
            if (!validator) {
                throw new Error(`Validator for ${key} is missing, check the definitions for this field`)
            }
        })
    }

    return definitions
}