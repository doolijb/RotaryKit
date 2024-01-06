import { children as c } from "$validation/validators"
import { Validator, Primitive } from "$validation/base"

/**
 * Validates that a value is a string
 */
class Root extends Validator {
    args = {}
    key = "string"
    badge = "String"
    message = "Must be a string"
    hidden = true
    test = async ({key, data}) => {
        const value = data[key]
        if (value == null || value == undefined) return true
        return typeof value === "string"
    }
}

export class String extends Primitive<string> {
    constructor() {
        super({Root})
    }
    emailAddressComplete = this.stageValidator(c.EmailAddressComplete)
    lowerCaseIncluded = this.stageValidator(c.LowerCaseIncluded)
    matches = this.stageValidator(c.Matches)
    maxLength = this.stageValidator(c.MaxLength)
    minLength = this.stageValidator(c.MinLength)
    multiSelectOptions = this.stageValidator(c.MultiSelectOptions)
    numbersIncluded = this.stageValidator(c.NumbersIncluded)
    postalCodeComplete = this.stageValidator(c.PostalCodeComplete)
    specialCharExcluded = this.stageValidator(c.SpecialCharExcluded)
    specialCharIncluded = this.stageValidator(c.SpecialCharIncluded)
    telephoneComplete = this.stageValidator(c.TelephoneComplete)
    telephonePossible = this.stageValidator(c.TelephonePossible)
    upperCaseIncluded = this.stageValidator(c.UpperCaseIncluded)
}