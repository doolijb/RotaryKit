import { children as c } from "$shared/validation/validators"
import { Validator, Primitive } from "$shared/validation/base"

class Root extends Validator {
	badge = "Number"
	key = "number"
	message = "Must be numeric"
	test = async ({ key, data }) => {
		const value = data[key]
		try {
			return !isNaN(parseInt(value))
		} catch {
			return value == null || value == undefined || typeof value === "number"
		}
	}
}

export class Number extends Primitive<boolean> {
	Root = Root
	matches = this.stageValidator(c.Matches)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types
type ObservePrimitiveType = GenericOfPrimitive<Number>
