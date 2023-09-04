import { Validator } from "$shared/validation/base"

/**
 * Validates that all values are in the options
 *
 * @param {unknown[]} args.options
 */
export class MultiSelectOptions extends Validator {
	declare args: { options: unknown[] }
	badge = "Options"
	key = "multiSelectOptions"
	message = `Only valid options may be selected`
	test = async ({ key, data }) => {
		const values: unknown[] = data[key]

		// If value is null/undefined, return true
		if (values === null || values === undefined || values.length === 0) {
			return true
		}

		const violators = values.filter((val) => !Object.values(this.args.options).includes(val))

		return violators.length === 0
	}
}
