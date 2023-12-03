import { utils } from "@validation"

/**
 * Validates that a string is not empty
 * 
 * @param {string} args.label
 * @returns Validator
 */
export default function required({
    label
}: { 
    label?: string 
} = {} ): Validator {
    return {
        args: { label },
        badge: "Required",
        key: "required",
        message: "This field is required",
        popup: utils.popupSettings(),
        sticky: true,
        test: async (value: any): Promise<boolean> => !!value
    }
}
