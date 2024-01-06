import { validators as v } from "$validation"
import { FormSchema } from "$validation/base"

export class ResetPassphraseByUsername extends FormSchema {
    fields = {
        username: new v.String().minLength(5),
    }
    optional = {}
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = ResetPassphraseByUsername["Data"]