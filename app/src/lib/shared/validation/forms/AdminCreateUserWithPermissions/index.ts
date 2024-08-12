import { fields, validators as v} from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class AdminCreateUserWithPermissions extends FormSchema {
    fields = {
        username: fields.username(),
        email: fields.email(),
        passphrase: fields.passphrase(),
        isVerified: v.Boolean.init(),
        isAdmin: v.Boolean.init(),
        isSuperUser: v.Boolean.init(),
    }
    optional = {
        email: true
    }
    fieldAttributes = {
        username: {
            label: "Username",
        },
        email: {
            label: "Email",
        },
        passphrase: {
            label: "Passphrase",
        },
        isVerified: {
            label: "Is Verified",
        },
        isAdmin: {
            label: "Is Admin",
        },
        isSuperUser: {
            label: "Is Super User",
        },
    }
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = AdminCreateUserWithPermissions["Data"]