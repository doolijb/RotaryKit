import { validators as v } from "$shared/validation"
import { FormSchema } from "$shared/validation/base"
import { ImageStatus } from "$shared/constants"


export class AdminEditImage extends FormSchema {
    fields = {
        title: v.String.init().maxLength({max: 255}),
        status: v.String.init().selectOptions({options: ImageStatus.options}),
    }
    optional = {}
    fieldAttributes = {
        title: {
            label: "Title",
        },
        status: {
            label: "Status",
        },
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ObserveForm = FormDataOf<AdminEditImage>

