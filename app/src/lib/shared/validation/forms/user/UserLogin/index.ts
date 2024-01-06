import { validators as v } from "$validation"
import { FormSchema } from "$validation/base"

export class UserLogin extends FormSchema {
    fields = {
        username: new v.String().minLength(3),
        passphrase: new v.String().minLength(3),
    }
    optional = {}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<UserLogin>

