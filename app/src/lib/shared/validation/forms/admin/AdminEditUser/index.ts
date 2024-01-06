import { validators as v, fields } from "$validation"
import { FormSchema } from "$validation/base"

export class AdminEditUser extends FormSchema {
    fields = {
        username: fields.username(),
        isVerified: new v.Boolean(),
        isActive: new v.Boolean(),
    }
    optional = {}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<AdminEditUser>