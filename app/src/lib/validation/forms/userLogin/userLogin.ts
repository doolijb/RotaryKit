import type { IFormValidatorDefinition } from "@interfaces"
import { fields, validators } from "@validation"

export default {
    email: Object.assign({}, fields.email, {
        required: {
            validator: validators.required
        }
    }),
    passphrase: {
        // We aren't validating the passphrase here, just making sure it's present
        // because we aren't evaluating it's strength when logging in
        required: {
            validator: validators.required
        }
    },
} as IFormValidatorDefinition