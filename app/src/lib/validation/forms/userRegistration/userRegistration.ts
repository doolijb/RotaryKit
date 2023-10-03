import { utils, fields, validators } from "@validation"
import type { IFormValidatorDefinition } from '@interfaces'

export default {
    // Add email field and add required validator
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
} as IFormValidatorDefinition