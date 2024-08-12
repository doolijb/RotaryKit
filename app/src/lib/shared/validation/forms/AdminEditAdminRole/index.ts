import { validators as v } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class AdminEditAdminRole extends FormSchema {
    fields = {
        name: v.String.init().minLength(3).maxLength(20),
        adminPermissions: v.Array.init(),
    }
    optional = {}
    fieldAttributes = {
        name: {
            label: "Name",
        },
        adminPermissions: {
            label: "Admin Permissions",
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = AdminEditAdminRole["Data"]