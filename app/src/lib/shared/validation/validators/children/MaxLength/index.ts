import { Validator } from "$validation/base"
/**
 * Validates that a string is at most a certain length,
 * Defaults to 20 characters
 * 
 * @param args { maxLen: number }
 */

export class MaxLength extends Validator {
    constructor(args: { maxLen: number } = { maxLen: 20 }) {
        super(args)
    }
    declare args: { maxLen: number }
    badge = "Max length"
    key = "maxLength"
    message = () => `Must be at most ${this.args.maxLen} characters long`
    test = async ({key, data}) => {
        const value = data[key]
        return value ? value.length <= this.args.maxLen : true
    }
}