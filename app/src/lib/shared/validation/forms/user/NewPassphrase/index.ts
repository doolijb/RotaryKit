import { fields } from "$validation"
import { FormSchema } from "$validation/base"

export class NewPassphrase extends FormSchema {
    fields = {
        passphrase: fields.passphrase(),
        passphraseConfirm: fields.passphraseConfirm(),
    }
    optional = {}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<NewPassphrase>