import type { Validator } from "$shared/validation/base/Validator"

/**
 * Chains a series of child validators together
 */
export class Primitive<T> {
    public type: T
    validators: Validator[] = []
    isRequired = false
    Root: typeof Validator

    static init<T extends Primitive<unknown>>(this: new () => T): T {
        const primitive = new this()
        primitive.addValidator(primitive.Root.init())
        return primitive
    }

    /**
     * Adds a validator to the chain, 
     * @param {Validator} validator 
     * @param {string} property? // Populate to limit the validator to one use per instance
     * @returns {this}
     */
    addValidator(validator: Validator) {
        this.validators.push(validator)
        if (validator.badge === "required") {
            this.isRequired = true
        }
        return this
    }

    stageValidator(ValidatorClass: typeof Validator) {
        type Args = Parameters<typeof Validator.init>
        return (...args: Args) => {
            const v = ValidatorClass.init(...args)
            return this.addValidator(v)
        }
    }

    async validate({key, data}) {
        const errors: FieldErrors = {}
        // Validators are async, so we can run them all in parallel
        await Promise.all(this.validators.map(async validator => {
            const valid = await validator.test({key, data})
            if (!valid) {
                errors[validator.key] = validator.message as string
            }
        }))
        return errors
    }
}