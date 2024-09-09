import { fields } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"

export class AddEmailAddress extends FormSchema {
    fields = {
        email: fields.email(),
    }
    optional = {}
    fieldAttributes = {
        email: {
            label: "Email",
        },
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = AddEmailAddress["Data"]