import { Validator } from "$shared/validation/base"

/**
 * Validates that a string contains at least one number
 * 
 * @param {number} args.count - defaults to 1
 */

export class NumbersIncluded extends Validator {
    constructor(args: { count: number } = { count: 1 }) {
        super(args)
    }
    declare args: { count: number }
    badge = "Numbers Required"
    key = "numbersRequired"
    message = () => `Must have at least ${this.args.count} number${this.args.count > 1 ? "s" : ""
        }`
    test = async ({key, data}) => {
        const value: string = data[key]
        const numbers = value.match(/\d/g) || []
        return value.length ? numbers.length >= this.args.count : true
    }
}
