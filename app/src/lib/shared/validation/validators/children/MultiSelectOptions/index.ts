import { Validator } from "$validation/base"

/**
 * Validates that a value is an array
 * 
 * @param {unknown[]} args.options
 */
export class MultiSelectOptions extends Validator{
    declare args: { options: unknown[] }
    badge = "Options"
    key = "minLength"
    message = `Only valid options may be selected`
    test = async ({key, data}) => {
        const values: unknown = data[key]
        return !Object.values(values).find((val) => Object.values(this.args.options).includes(val))
    }
}