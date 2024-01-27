import { Validator } from "$validation/base"

/**
 * Validates that a string is not empty
 * 
 * @param args { label?: string }
 * @returns Validator
 */

export class Matches extends Validator {
    declare args: { matchingLabel?: string, matchingField: string }
    badge = "Matches"
    key = "matches"
    message = () => `The ${this.args.matchingLabel ? this.args.matchingLabel.toLowerCase() + "s" : "values"
        } entered do not match, please try again`
    test = async ({key, data })=> {
        const value = data[key]
        const matchingValue = data[this.args.matchingField]

        // We will skip this if value is empty
        if (!value) return true

        return matchingValue === value
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveValidatorType = GenericOfPrimitive<Matches>
