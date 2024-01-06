import { validators as v, forms as f } from "$validation"
import { FormSchema } from "$validation/base"

export class AdminCreateAdminRole extends FormSchema {
	fields = {
        name: new v.String().minLength({minLen: 3}),
        adminPermissions: new v.Array()
    }
    optional = {}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveFormType = FormDataOf<AdminCreateAdminRole>