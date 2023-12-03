import { utils } from "@validation"

/**
 * Validates that a string contains at least one special character
 * 
 * @param {string} args.label
 * @param {string[]} args.choices - An array of special characters to check for
 * @param {number} args.count - The number of special characters required, defaults to 1
 * @returns Validator
 */

export default function specialCharIncluded({
    label = "",
    choices = [
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
    ],
    count = 1
  }: {
    label?: string,
    choices?: string[],
    count?: number
  } = {}): Validator {

    return {
        args: { label, choices, count },
        badge: "Special Character Required",
        key: "specialCharIncluded",
        message: `Must have at least ${count} special character${count > 1 ? "s" : ""
            }, such as ${choices.join(", ")}`,
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: string): Promise<boolean> => {
            if (!value) return true
            const escaped_chars = choices.map(char => "\\" + char).join("")
            const regex = new RegExp("[" + escaped_chars + "]", "g")
            const specialChars = value.match(regex) || []
            return value ? specialChars && specialChars.length >= count : true
        }
    }
}
