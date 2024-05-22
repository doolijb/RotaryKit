import { validators as v } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class AdminEditAdminRolesToUser extends FormSchema {
    fields = {
        adminRoles: v.Array.init(),
    }
    optional = {}
    fieldAttributes = {
        adminRoles: {
            label: "Admin Roles",
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<AdminEditAdminRolesToUser>