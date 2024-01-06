import { fields, validators as v} from "$validation"
import { FormSchema } from "$validation/base"

export class AdminCreateUserWithPermissions extends FormSchema {
    fields = {
        username: fields.username(),
        email: fields.email(),
        passphrase: fields.passphrase(),
        isVerified: new v.Boolean(),
        isAdmin: new v.Boolean(),
        isSuperUser: new v.Boolean(),
        adminPermissions: new v.Array(),
    }
    optional = {
        email: true
    }
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = AdminCreateUserWithPermissions["Data"]