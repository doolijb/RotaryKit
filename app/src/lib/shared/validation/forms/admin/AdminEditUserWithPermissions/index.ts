import { fields, validators as v } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class AdminEditUserWithPermissions extends FormSchema {
    fields = {
        username: fields.username(),
        isVerified: v.Boolean.init(),
        isActive: v.Boolean.init(),
        isAdmin: v.Boolean.init(),
        isSuperUser: v.Boolean.init(),
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
        },
        isAdmin: {
            label: "Is Admin",
        },
        isSuperUser: {
            label: "Is Super User",
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<AdminEditUserWithPermissions>