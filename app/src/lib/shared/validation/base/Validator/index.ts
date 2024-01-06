export class Validator {
    constructor(args = {} ) {
        this.args = args
        if (typeof this.badge === "function") {
            this.badge = this.badge()
        }
        if (typeof this.message === "function") {
            this.message = this.message()
        }
    }
    hidden = false
    args: object
    sticky = false
    key: string
    badge: string | (() => string)
    message: string | (() => string)
    test: ValidatorTest
}