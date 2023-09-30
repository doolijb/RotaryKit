import type { IFormValidatorDefinition } from "@interfaces"
import { utils } from "@validation"

/**
 * Merge default definitions with custom args
 * If a custom definition is provided, it will override the default
 * If a new definition is provided, it will be added to the set
 * @param definitions: IFormValidatorDefinition
 * @param extras: IFormValidatorDefinition
 * @returns IFormValidatorDefinition
 */

export default function mergeFormValidatorDefinitions({
    definitions,
    extras
}: {definitions: IFormValidatorDefinition, extras?: IFormValidatorDefinition}): IFormValidatorDefinition {
    if (extras) {
        Object.entries(extras).forEach(([name, e]) => {
            definitions[name] = utils.mergeFieldValidatorDefinitions({definition: definitions[name] || {}, extras: e})
        })
    }
    return definitions
}