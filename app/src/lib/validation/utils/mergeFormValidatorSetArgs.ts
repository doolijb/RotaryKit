import type { IFormValidatorDefinition } from "@interfaces"
/**
 * Merge default definitions with custom args
 * If a custom definition is provided, it will override the default
 * If a new definition is provided, it will be added to the set
 * @param definitions: IFormValidatorDefinition
 * @param args: IFormValidatorDefinition
 * @returns IFormValidatorDefinition
 */

export default function (definitions: IFormValidatorDefinition, args: IFormValidatorDefinition): IFormValidatorDefinition {
    Object.entries(args).forEach(([key, value]) => {
        if (definitions[key]) {
            definitions[key].args = { ...definitions[key].args, ...value.args }
        } else {
            definitions[key].args = { ...value.args }
        }
        if (args[key].field !== undefined) {
            definitions[key].field = args[key].field
        }
    })

    return definitions
}