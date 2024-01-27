import { validators as v } from "$validation"
import { FormSchema } from "$validation/base"

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