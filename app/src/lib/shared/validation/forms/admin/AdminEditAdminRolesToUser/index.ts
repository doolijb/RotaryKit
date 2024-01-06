import { validators as v } from "$validation"
import { FormSchema } from "$validation/base"

export class AdminEditAdminRolesToUser extends FormSchema {
    fields = {
        adminRoles: new v.Array(),
    }
    optional = {}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<AdminEditAdminRolesToUser>