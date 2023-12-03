import { validators, fields } from "@validation"
import deepmerge from "deepmerge"

export default {
    passphrase: deepmerge(fields.passphrase, {
        required: {
            validator: validators.required
        }
    }),
    passphraseConfirm: deepmerge(fields.passphraseConfirm, {
        required: {
            validator: validators.required
        },
    }),
} as FormValidatorDefinition