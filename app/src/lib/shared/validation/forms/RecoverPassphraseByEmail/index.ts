import { validators as v } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class RecoverPassphraseByEmail extends FormSchema {
    fields = {
        email: v.String.init().emailAddressValid(),
    }
    optional = {}
    fieldAttributes = {
        email: {
            label: "Email",
        },
    }
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = RecoverPassphraseByEmail["Data"]