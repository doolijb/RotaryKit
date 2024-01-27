import { fields } from "$validation"
import { FormSchema } from "$validation/base"

export class UserRegister extends FormSchema {
    fields = {
        username: fields.username(),
        email: fields.email(),
        passphrase: fields.passphrase(),
        passphraseConfirm: fields.passphraseConfirm(),
    }
    optional = {}
    fieldAttributes = {
        username: {
            label: "Username",
        },
        email: {
            label: "Email",
        },
        passphrase: {
            label: "Passphrase",
        },
        passphraseConfirm: {
            label: "Confirm Passphrase",
        },
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = UserRegister["Data"]