import { validators as v } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class ResetPassphraseByUsername extends FormSchema {
    fields = {
        username: v.String.init().minLength(5),
    }
    optional = {}
    fieldAttributes = {
        username: {
            label: "Username",
        },
    }
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = ResetPassphraseByUsername["Data"]