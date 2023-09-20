import { validators as v, utils } from "@validation"
import fields from '@validation/fields'
import type { IFormValidatorDefinition } from '@interfaces'
import makeFormValidator from '@validation/utils/makeFormValidator'

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
            },
            confirmMatch: {
                validator: v.confirmMatch,
            }
        },
    }
} as IFormValidatorDefinition

/**
 * Default definitions for user registration form
 * 
 * @field username: string,
 * @field email: string,
 * @field passphrase: string,
 * @field passphraseConf: string
 * 
 * @param {IFormValidatorDefinition} args
 * @returns {IFormValidatorDefinition}
 */
export default function (args: IFormValidatorDefinition) { // Use typeof to get the type of defaultDefinitions
    args = utils.mergeFormValidatorSetArgs(defaultDefinitions, args)
    return makeFormValidator(args)
}