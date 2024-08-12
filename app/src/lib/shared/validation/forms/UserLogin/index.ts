import { validators as v } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class UserLogin extends FormSchema {
    fields = {
        email: v.String.init().emailAddressValid(),
        passphrase: v.String.init().minLength(3),
    }
    optional = {}
    fieldAttributes = {
        email: {
            label: "Email",
        },
        passphrase: {
            label: "Passphrase",
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<UserLogin>

