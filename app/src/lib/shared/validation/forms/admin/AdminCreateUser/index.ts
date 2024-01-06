import { fields, validators as v} from "$validation"
import { FormSchema } from "$validation/base"

export class AdminCreateUser extends FormSchema {
    fields = {
        username: fields.username(),
        email: fields.email(),
        passphrase: fields.passphrase(),
        isVerified: new v.Boolean(),
    }
    optional = {
        email: true,
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = AdminCreateUser["Data"]