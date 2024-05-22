import { fields } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class NewPassphrase extends FormSchema {
    fields = {
        passphrase: fields.passphrase(),
        passphraseConfirm: fields.passphraseConfirm(),
    }
    optional = {}
    fieldAttributes = {
        passphrase: {
            label: "Passphrase",
        },
        passphraseConfirm: {
            label: "Confirm Passphrase",
        },
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<NewPassphrase>