import { children as c } from "$validation/validators"
import { Validator, Primitive } from "$validation/base"

export class Root extends Validator {
    badge = "Boolean"
    key = "boolean"
    message = "Must be a True or False value"
    sticky = false
    hidden = true
    test = async ({key, data}) => {
        const value = data[key]
        return value == null || value == undefined || typeof value === "boolean"
    }
}

export class Boolean extends Primitive<boolean> {
    constructor() {
        super({Root})
    }
    matches = this.stageValidator(c.Matches)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
type ObservePrimitiveType = GenericOfPrimitive<Boolean>