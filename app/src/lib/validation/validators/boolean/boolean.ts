import type { IValidator } from "@interfaces"
import { utils } from "@validation"

/**
 * Validates that a value is a boolean, or a string that can be converted to a boolean
 * 
 * @param args { label?: string }
 * @returns IValidator
 */

export default function boolean({
    label,
} : { 
    label?: string 
} = {} ): IValidator {
    return {
        args: { label },
        badge: "Boolean",
        key: "boolean",
        message: "Must be a True or False value",
        popup: utils.popupSettings(),
        sticky: false,
        test: async (value: string) => {
            if ([null, undefined, ""].includes(value)) return true

            return [
                true,
                false,
                0,
                1,
                "true", "True", "TRUE",
                "false", "False", "FALSE",
                "0",
                "1",
                "yes", "Yes", "YES",
                "no", "No", "NO",
                "y", "Y",
                "n", "N",
                "on", "ON", "On",
                "off", "OFF", "Off",
            ].includes(value.toLowerCase())
        }
    } 
}