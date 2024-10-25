import { children as c } from "$shared/validation/validators"
import { Validator, Primitive } from "$shared/validation/base"

/**
 * Validates that a value is a string
 */
class Root extends Validator {
    key = "string"
    badge = "String"
    message = "Must be a string"
    isHidden = true
    test = async ({key, data}) => {
        const value = data[key]
        if (value == null || value == undefined) return true
        return typeof value === "string"
    }
}

export class String extends Primitive<string> {
    Root = Root
    emailAddressValid = this.stageValidator(c.EmailAddressValid)
    lowerCaseIncluded = this.stageValidator(c.LowerCaseIncluded)
    matches = this.stageValidator(c.Matches)
    maxLength = this.stageValidator(c.MaxLength)
    minLength = this.stageValidator(c.MinLength)
    multiSelectOptions = this.stageValidator(c.MultiSelectOptions)
    numbersIncluded = this.stageValidator(c.NumbersIncluded)
    postalCodeValid = this.stageValidator(c.PostalCodeValid)
    selectOptions = this.stageValidator(c.SelectOptions)
    specialCharExcluded = this.stageValidator(c.SpecialCharExcluded)
    specialCharIncluded = this.stageValidator(c.SpecialCharIncluded)
    telephoneValid = this.stageValidator(c.TelephoneValid)
   
    upperCaseIncluded = this.stageValidator(c.UpperCaseIncluded)
}