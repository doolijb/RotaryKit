import { Validator } from "$validation/base"

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
    constructor(args: { choices: string[], count: number } = { choices: defaultChoices, count: 1 }) {
      super(args)
    }
    declare args: { choices: string[], count: number }
    badge = () => `Special Character${this.args.count > 1 ? "s" : ""} Required`
    key = "specialCharIncluded"
    message = () => `Must have at least ${this.args.count} special character${this.args.count > 1 ? "s" : ""}, such as ${this.args.choices.join(", ")}`
    test = async ({key, data}) => {
        const value: string = data[key]
        if (!value) return true
        const escaped_chars = this.args.choices.map(char => "\\" + char).join("")
        const regex = new RegExp("[" + escaped_chars + "]", "g")
        const specialChars = value.match(regex) || []
        return value ? specialChars && specialChars.length >= this.args.count : true
    }
}