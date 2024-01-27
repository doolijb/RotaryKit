import { fields } from "$validation"
import { FormSchema } from "$validation/base"

export class AdminEditUserPassphrase extends FormSchema {
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
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<AdminEditUserPassphrase>