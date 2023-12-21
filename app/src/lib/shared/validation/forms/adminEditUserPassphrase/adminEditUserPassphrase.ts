import { fields, validators } from "@validation"

export default {
    passphrase: {
        ...fields.passphrase,
        required: {
            validator: validators.required,
        },
    },
} as FormValidatorDefinition