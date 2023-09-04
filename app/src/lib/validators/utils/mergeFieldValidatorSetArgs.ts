import type { IFieldValidatorSetArgs } from "@interfaces"
/**
 * Merge default definitions with custom args
 * If a custom definition is provided, it will override the default
 * If a new definition is provided, it will be added to the set
 * @param definitions: IFieldValidatorSetArgs 
 * @param args: IFieldValidatorSetArgs 
 * @returns IFieldValidatorSetArgs
 */

export default function (definitions: IFieldValidatorSetArgs, args: IFieldValidatorSetArgs): IFieldValidatorSetArgs {
    // // Required should not be included in the default definitions
    // if (definitions.required !== undefined) {
    //     throw new Error('Required should not be included in the default definitions, instead, include it in the form validator set as an argument')
    // }

    Object.entries(args).forEach(([key, value]) => {
        // If new validator definition is provided, add it to the set
        if (!definitions[key]) {
            definitions[key] = value
        } else {
            // If custom args are provided for a default validator, merge them
            if (definitions[key] && value.args !== undefined) {
                definitions[key].args = { ...definitions[key].args, ...value.args }
            }
            if (value.validator !== undefined) {
                definitions[key].validator = args[key].validator
            }
        }
    })

    return definitions
}