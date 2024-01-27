// import { expect, test } from "vitest"
// import definition from "."
// import { utils } from "$validation"


// test("passphraseConfirm field validation: passes", async () => {

//     const data = {
//         testField: "password",
//         matchingField: "password"
//     }

//     const extras: FieldValidatorDefinition = ({ 
//         matches: {
//             args: { matchingField: "matchingField" }
//         }
//     })
//     const field = utils.fieldValidator({definition, extras})
//     const errors = await field.test({key:testField, data})
//     expect(Object.keys(errors)).toHaveLength(0)
// })

// test("passphraseConfirm field validation: fails", async () => {
//     const data = {
//         testField: "password1",
//         matchingField: "password"
//     }
//     const extras: FieldValidatorDefinition = ({ 
//         matches: {
//             args: { matchingField: "matchingField" }
//         }
//     })
//     const field = utils.fieldValidator({definition, extras})
//     const input = "password1"
//     const errors = await field.test({key:testField, data})
//     expect(Object.keys(errors)).toHaveLength(1)
// })