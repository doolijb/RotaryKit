import { children as c } from "$validation/validators"
import { Validator, Primitive } from "$validation/base"

class Root extends Validator {
    badge = "Boolean"
    key = "boolean"
    message = "Must be a True or False value"
    test = async ({key, data}) => {
        const value = data[key]
        return value == null || value == undefined || typeof value === "boolean"
    }
}

export class Boolean extends Primitive<boolean> {
    Root = Root
    matches = this.stageValidator(c.Matches)
    truthy = this.stageValidator(c.Truthy)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
type ObservePrimitiveType = GenericOfPrimitive<Boolean>