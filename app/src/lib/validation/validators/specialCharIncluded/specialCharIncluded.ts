import type { IFieldValidator } from "@interfaces"
import { utils } from "@validation"

/**
 * Validates that a string contains at least one special character
 * 
 * @param args { count: number, choices: string[] }
 * @returns IFieldValidator
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
  } = {}): IFieldValidator {

    return {
        args: { label, choices, count },
        badge: "Special Character Required",
        key: "specialCharIncluded",
        message: `Must have at least ${count} special character${count > 1 ? "s" : ""
            }, such as ${choices.join(", ")}`,
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) => {
            const escaped_chars = choices.map(char => "\\" + char).join("")
            const regex = new RegExp("[" + escaped_chars + "]", "g")
            const specialChars = value.match(regex) || []
            return value ? specialChars && specialChars.length >= count : true
        }
    }
}
