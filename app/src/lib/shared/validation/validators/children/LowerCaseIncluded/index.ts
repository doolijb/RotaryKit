import { Validator } from "$validation/base"
/**
 * Validates that a string contains at least one lowercase letter
 * 
 * @param args { count: number }
 */
export class LowerCaseIncluded extends Validator {
    constructor(args: { count: number } = { count: 1 }) {
        super(args)
    }
    declare args: { count: number }
    badge = "Lowercase Required"
    key = "lowercaseRequired"
    message: ()=> string | undefined = () => `Must have at least ${this.args.count} lowercase letter${this.args.count > 1 ? "s" : ""}`
    test = async ({key, data}) => {
        const value: string = data[key]
        const lowercase = value.match(/[a-z]/g) || []
        return value ? lowercase && lowercase.length >= this.args.count : true
    }
}