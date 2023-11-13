import { validators, fields } from "@validation"

export default {
    passphrase: Object.assign({}, fields.passphrase, {
        required: {
            validator: validators.required
        }
    }),
    passphraseConfirm: Object.assign({}, fields.passphraseConfirm, {
        required: {
            validator: validators.required
        },
    }),
} as FormValidatorDefinition