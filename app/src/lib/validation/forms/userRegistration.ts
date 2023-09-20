import { validators as v, utils } from "@validation"
import fields from '@validation/fields'
import type { IFormValidatorSetArgs } from '@interfaces'
import makeFormValidatorSet from '@validation/utils/makeFormValidatorSet'

const defaultDefinitions = {
    username: {
        field: fields.username,
        args: {
            required: {
                validator: v.required,
            }
        }
    },
    email: {
        field: fields.email,
        args: {
            required: {
                validator: v.required,
            }
        },
    },
    passphrase: {
        field: fields.passphrase,
        args: {
            required: {
                validator: v.required,
            }
        },
    },
    passphraseConf: {
        field: fields.passphraseConf,
        args: {
            required: {
                validator: v.required,
            }
        },
    }
} as IFormValidatorSetArgs

export default function (args: IFormValidatorSetArgs) { // Use typeof to get the type of defaultDefinitions
    args = utils.mergeFormValidatorSetArgs(defaultDefinitions, args)
    return makeFormValidatorSet(args)
}