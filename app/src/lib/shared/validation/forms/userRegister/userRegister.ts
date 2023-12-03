import { fields, validators } from "@validation"
import deepmerge from "deepmerge"

export default {
    // Add email field and add required validator
    username: deepmerge(fields.username, {
        required: {
            validator: validators.required
        }
    }),
    email: deepmerge(fields.email, {
        required: {
            validator: validators.required
        }
    }),
    passphrase: deepmerge(fields.passphrase, {
        required: {
            validator: validators.required
        }
    }),
    passphraseConfirm: deepmerge(fields.passphraseConfirm, {
        required: {
            validator: validators.required
        },
    })
} as FormValidatorDefinition