import { Validator } from "$shared/validation/base"

const defaultChoices = [
	"!",
	"@",
	"#",
	"$",
	"%",
	"^",
	"&",
	"*",
	"(",
	")",
	"-",
	"_",
	"=",
	"+",
	"[",
	"]",
	"{",
	"}",
	";",
	":",
	",",
	".",
	"<",
	">",
	"?",
	"/",
	"|",
	"~",
	"`"
]

/**
 * Validates that a string contains at least one special character
 *
 * @param {string[]} args.choices - An array of special characters to check for
 * @param {number} args.count - The number of special characters required, defaults to 1
 */

export class SpecialCharIncluded extends Validator {
	args: { choices: string[]; count: number } = { choices: defaultChoices, count: 1 }
	badge = () => `Special character${this.args.count > 1 ? "s" : ""}`
	key = "specialCharIncluded"
	message = () =>
		`Must have at least ${this.args.count} special character${this.args.count > 1 ? "s" : ""}, such as ${this.args.choices.join(", ")}`
	test = async ({ key, data }) => {
		const value: string = data[key]
		if (!value) return true
		const escaped_chars = this.args.choices.map((char) => "\\" + char).join("")
		const regex = new RegExp("[" + escaped_chars + "]", "g")
		const specialChars = value.match(regex) || []
		return value ? specialChars && specialChars.length >= this.args.count : true
	}
}
