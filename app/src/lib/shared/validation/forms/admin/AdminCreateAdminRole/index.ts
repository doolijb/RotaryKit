import { validators as v, forms as f } from "$validation"
import { FormSchema } from "$validation/base"

export class AdminCreateAdminRole extends FormSchema {
	fields = {
        name: v.String.init().minLength({minLen: 3}),
        adminPermissions: v.Array.init()
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
type ObserveFormType = FormDataOf<AdminCreateAdminRole>