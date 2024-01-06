import { fields, validators as v } from "$validation"
import { FormSchema } from "$validation/base"

export class AdminEditUserWithPermissions extends FormSchema {
    fields = {
        username: fields.username(),
        isVerified: new v.Boolean(),
        isActive: new v.Boolean(),
        isAdmin: new v.Boolean(),
        isSuperUser: new v.Boolean(),
    }
    optional = {}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<AdminEditUserWithPermissions>