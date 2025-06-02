import { Validator } from "$shared/validation/base"

/**
 * Validates that a string is at least a certain length,
 * Defaults to 3 characters
 *
 * @param args: {number} args.minLen - defaults to 3
 */
export class MaxCount extends Validator {
	args: { maxCount: number } = { maxCount: 3 }
	badge = "Max Count"
	key = "maxCount"
	message = () => `A maximum of ${this.args.maxCount} selected items`
	test = async ({ key, data }) => {
		const value: unknown[] = data[key]
		return value.length <= this.args.maxCount
	}
}
