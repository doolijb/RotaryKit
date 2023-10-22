import { utils, fields, validators } from "@validation"

export default {
    // Add email field and add required validator
    username: Object.assign({}, fields.username, {
        required: {
            validator: validators.required
        }
    }),
    email: Object.assign({}, fields.email, {
        required: {
            validator: validators.required
        }
    }),
    passphrase: Object.assign({}, fields.passphrase, {
        required: {
            validator: validators.required
        }
    }),
    passphraseConfirm: Object.assign({}, fields.passphraseConfirm, {
        required: {
            validator: validators.required
        },
    })
} as FormValidatorDefinition