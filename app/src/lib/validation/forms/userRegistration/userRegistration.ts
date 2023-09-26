// import { utils, fields } from "@validation"
// import type { IFormValidatorDefinition, IFormValidator } from '@interfaces'
// import makeFormValidator from '@validation/utils/makeFormValidator'

// const definition = {
//     username: fields.username.definition,
//     email: fields.email.definition,
//     passphrase: fields.passphrase.definition,
//     passphraseConf: fields.passphraseConf.definition
// } as IFormValidatorDefinition

// /**
//  * Default definitions for user registration form
//  * 
//  * @field username: string,
//  * @field email: string,
//  * @field passphrase: string,
//  * @field passphraseConf: string
//  * 
//  * @param {IFormValidatorDefinition} args
//  * @returns {IFormValidatorDefinition}
//  */
// function form (args: IFormValidatorDefinition): IFormValidator {
//     const final = utils.mergeFormValidatorSetArgs(definition, args)
//     return makeFormValidator(final)
// }

// export default {
//     form,
//     definition
//   }