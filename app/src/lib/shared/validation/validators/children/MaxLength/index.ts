import { Validator } from "$shared/validation/base"
/**
 * Validates that a string is at most a certain length,
 * Defaults to 20 characters
 * 
 * @param args { maxLen: number }
 */

export class MaxLength extends Validator {
    args: { maxLen: number } = { maxLen: 20 }
    badge = "Max length"
    key = "maxLength"
    message = () => `Must be at most ${this.args.maxLen} characters long`
    test = async ({key, data}) => {
        const value = data[key]
        return value ? value.length <= this.args.maxLen : true
    }
}