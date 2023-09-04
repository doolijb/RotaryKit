import { Validator } from "$shared/validation/base"

/**
 * Validates that a string is at least a certain length,
 * Defaults to 3 characters
 *
 * @param args: {number} args.minLen - defaults to 3
 */
export class MinLength extends Validator {
	args: { minLen: number } = { minLen: 3 }
	badge = "Min length"
	key = "minLength"
	message = () => `Must be at least ${this.args.minLen} in length`
	test = async ({ key, data }) => {
		const value: string | unknown[] = data[key]
		return value ? value.length >= this.args.minLen : true
	}
}
