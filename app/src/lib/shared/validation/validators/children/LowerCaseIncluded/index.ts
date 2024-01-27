import { Validator } from "$validation/base"
/**
 * Validates that a string contains at least one lowercase letter
 * 
 * @param args { count: number }
 */
export class LowerCaseIncluded extends Validator {
    args: { count: number } = { count: 1 }
    badge = "Lowercase Included"
    key = "lowercaseIncluded"
    message: ()=> string | undefined = () => `Must have at least ${this.args.count} lowercase letter${this.args.count > 1 ? "s" : ""}`
    test = async ({key, data}) => {
        const value: string = data[key]
        const lowercase = value.match(/[a-z]/g) || []
        return value ? lowercase && lowercase.length >= this.args.count : true
    }
}