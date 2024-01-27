import { validators as v } from "$validation"
import { FormSchema } from "$validation/base"

export class UserLogin extends FormSchema {
    fields = {
        username: v.String.init().minLength(3),
        passphrase: v.String.init().minLength(3),
    }
    optional = {}
    fieldAttributes = {
        username: {
            label: "Username",
        },
        passphrase: {
            label: "Passphrase",
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<UserLogin>

