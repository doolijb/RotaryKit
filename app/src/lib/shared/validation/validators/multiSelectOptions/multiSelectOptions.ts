import { validators as v, utils } from "@validation"
import { string } from "io-ts"

type ValidOptions = string[] | Record<string, any>[] | number[]

/**
 * Validates that a string is at least a certain length,
 * Defaults to 3 characters
 * 
 * @param {string} args.label
 * @param {number} args.minLen
 * @returns Validator
 */
export default function minLength({ 
    label, 
    options
}: { 
    label?: string
    options: ValidOptions
} ): Validator {
    return {
        args: { label, options },
        badge: "Options",
        key: "minLength",
        message: `Only valid options may be selected`,
        popup: utils.popupSettings(),
        sticky: false,
        test: async (values: ValidOptions): Promise<boolean> => {
            return !Object.values(values).find((val) => Object.values(options).includes(val))
        }
    }
}
