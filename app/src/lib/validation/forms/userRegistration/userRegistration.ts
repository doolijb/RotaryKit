import { utils, fields } from "@validation"
import type { IFormValidatorDefinition } from '@interfaces'

export default {
    username: fields.username,
    email: fields.email,
    passphrase: fields.passphrase,
    passphraseConf: fields.passphraseConf
} as IFormValidatorDefinition