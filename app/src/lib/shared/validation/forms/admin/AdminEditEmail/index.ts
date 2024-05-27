import { validators as v, fields } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class AdminEditEmail extends FormSchema {
    fields = {
        address: fields.email(),
        isVerified: v.Boolean.init(),
        isUserPrimary: v.Boolean.init(),
    }
    optional = {}
    fieldAttributes = {
        address: {
            label: "Email Address",
        },
        isVerified: {
            label: "Is Verified",
        },
        isUserPrimary: {
            label: "Is User Primary",
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<AdminEditEmail>