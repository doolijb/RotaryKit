import { Validator } from "$shared/validation/base"

/**
 * Validates that the value is one of the options
 * 
 * @param {unknown[]} args.options
 */
export class SelectOptions extends Validator{
    declare args: { options: unknown[] }
    badge = "Options"
    key = "selectOptions"
    message = `Only valid options may be selected`
    test = async ({key, data}) => {
        const value: unknown = data[key]

        // If value is null/undefined, return true
        if (value === null || value === undefined || value === "") {
            return true
        }

        return !!Object.values(this.args.options).includes(value)
    }
}