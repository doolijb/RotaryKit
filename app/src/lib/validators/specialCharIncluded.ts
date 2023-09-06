import utils from "@validators/utils"
import type { IFieldValidator } from "@interfaces"

export default function (
    args = { 
        label: "",
        choices: [
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
        count: 1
    },
): IFieldValidator {

    return {
        args,
        badge: "Special Character Required",
        key: "specialCharIncluded",
        message: `Must have at least ${args.count} special character${args.count > 1 ? "s" : ""
            }, such as ${args.choices.join(", ")}`,
        popup: utils.makePopup(),
        sticky: false,
        test: (value: string) => {
            const escaped_chars = args.choices.map(char => "\\" + char).join("")
            const regex = new RegExp("[" + escaped_chars + "]", "g")
            const specialChars = value.match(regex) || []
            return value ? specialChars && specialChars.length >= args.count : true
        }
    }
}
