import { fields } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class AdminEditUserPassphrase extends FormSchema {
    fields = {
        passphrase: fields.passphrase(),
    }
    optional = {}
    fieldAttributes = {
        passphrase: {
            label: "New Passphrase",
        },
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<AdminEditUserPassphrase>