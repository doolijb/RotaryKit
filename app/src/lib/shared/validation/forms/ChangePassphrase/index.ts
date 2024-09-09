import { fields, validators as v } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class ChangePassphrase extends FormSchema {
    fields = {
        currentPassphrase: v.String.init().minLength().maxLength({maxLen:200}), // Add current passphrase field
        passphrase: fields.passphrase(),
        passphraseConfirm: fields.passphraseConfirm(),
    }
    optional = {}
    fieldAttributes = {
        currentPassphrase: {
            label: "Current Passphrase",
        },
        passphrase: {
            label: "New Passphrase",
        },
        passphraseConfirm: {
            label: "Confirm New Passphrase",
        },
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<ChangePassphrase>