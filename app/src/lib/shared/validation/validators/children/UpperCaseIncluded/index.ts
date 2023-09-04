import { Validator } from "$shared/validation/base"

/**
 * Validates that a string contains at least one uppercase letter
 *
 * @param {number} args.count - The number of uppercase letters required, defaults to 1
 * @returns Validator
 */
export class UpperCaseIncluded extends Validator {
	args: { count: number } = { count: 1 }
	badge = "Uppercase Included"
	key = "uppercaseIncluded"
	message = () =>
		`Must have at least ${this.args.count} uppercase letter${this.args.count > 1 ? "s" : ""}`
	test = async ({ key, data }) => {
		const value: string = data[key]
		const uppercase = value.match(/[A-Z]/g) || []
		return value ? uppercase && uppercase.length >= this.args.count : true
	}
}
