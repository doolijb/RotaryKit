import { validators as v } from "$validation"
import { FormSchema } from "$validation/base"

export class AdminEditAdminRole extends FormSchema {
    fields = {
        name: new v.String().minLength(3).maxLength(20),
        adminPermissions: new v.Array(),
    }
    optional = {}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = AdminEditAdminRole["Data"]