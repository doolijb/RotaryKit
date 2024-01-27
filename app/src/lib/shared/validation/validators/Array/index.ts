import { children as c } from "$validation/validators"
import { Validator, Primitive } from "$validation/base"

/**
 * Validates that a value is an array
 */
class Root extends Validator {
    args = {}
    badge = "Is Array"
    key = "isArray"
    message = "An array is required"
    test = async ({key, data}) => {
        const value: unknown[] = data[key]
        return Array.isArray(value)
    }
}

class ArrayPrimitive extends Primitive<unknown[]> {
    Root = Root
    maxLength = this.stageValidator(c.MaxLength)
    minLength = this.stageValidator(c.MinLength)
}

export {
    ArrayPrimitive as Array
}
