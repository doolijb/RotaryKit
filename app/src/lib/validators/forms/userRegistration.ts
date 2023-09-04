import validators from '@validators'
import utils from '@validators/utils'
import fields from '@validators/fields'
import type { IFormValidatorSetArgs } from '@interfaces'
import makeFormValidatorSet from '@validators/utils/makeFormValidatorSet'

const defaultDefinitions = {
    username: {
        field: fields.username,
        args: {
            required: {
                validator: validators.required,
            }
        }
    },
    email: {
        field: fields.email,
        args: {
            required: {
                validator: validators.required,
            }
        },
    },
    passphrase: {
        field: fields.passphrase,
        args: {
            required: {
                validator: validators.required,
            }
        },
    },
    passphraseConf: {
        field: fields.passphraseConf,
        args: {
            required: {
                validator: validators.required,
            }
        },
    }
} as IFormValidatorSetArgs

export default function (args: IFormValidatorSetArgs) { // Use typeof to get the type of defaultDefinitions
    args = utils.mergeFormValidatorSetArgs(defaultDefinitions, args)
    return makeFormValidatorSet(args)
}