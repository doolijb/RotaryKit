import { validators as v, fields } from "$validation"
import { FormSchema } from "$validation/base"

export class AdminEditUser extends FormSchema {
    fields = {
        username: fields.username(),
        isVerified: v.Boolean.init(),
        isActive: v.Boolean.init(),
    }
    optional = {}
    fieldAttributes = {
        username: {
            label: "Username",
        },
        isVerified: {
            label: "Is Verified",
        },
        isActive: {
            label: "Is Active",
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<AdminEditUser>