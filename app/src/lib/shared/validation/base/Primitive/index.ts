import type { Validator } from "../Validator"

/**
 * Chains a series of child validators together
 */
export abstract class Primitive<T> {
    public type: T
    validators: Validator[] = []
    isRequired = false

    constructor({Root}: {Root: typeof Validator}) {   
        // Add the root validator to the chain
        this.addValidator(new Root())
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

    stageValidator(validator: typeof Validator) {
        type Args = ConstructorParameters<typeof Validator>
        return (...args: Args) => {
            return this.addValidator(new validator(...args))
        }
    }

    async validate({key, data}) {
        const errors: FieldErrors = {}
        // Validators are async, so we can run them all in parallel
        await Promise.all(this.validators.map(async validator => {
            if (validator.hidden) return
            const valid = await validator.test({key, data})
            if (!valid) {
                errors[key] = validator.message as string
            }
        }))
        return errors
    }
}