import { Validator } from "$shared/validation/base"

/**
 * Validates that a string is at least a certain length,
 * Defaults to 3 characters
 *
 * @param args: {number} args.minLen - defaults to 3
 */
export class MinCount extends Validator {
	args: { minCount: number } = { minCount: 2 }
	badge = "Min count"
	key = "minCount"
	message = () => `Must have a minimum of ${this.args.minCount} entries`
	test = async ({ key, data }) => {
		const value: string | unknown[] = data[key]
		return value.length === 0 || value.length >= this.args.minCount
	}
}
