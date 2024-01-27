// import { expect, test } from "vitest"
// import definition from "."
// import { utils } from "$validation"


// test("postalCodeComplete field validation: passes", async () => {
//     const extras: FieldValidatorDefinition = ({ 
//         postalCodeComplete: {
//             args: { getCountryCode: () => "US" }
//         }
//     })
//     const field = utils.fieldValidator({definition, extras})
//     const input = "99208"
//     const errors = await field.test(input)
//     expect(Object.keys(errors)).toHaveLength(0)
// })

// test("postalCodeComplete field validation: fails", async () => {
//     const extras: FieldValidatorDefinition = ({ 
//         postalCodeComplete: {
//             args: { getCountryCode: () => "US" }
//         }
//     })
//     const field = utils.fieldValidator({definition, extras})
//     const input = "NotAPostalCode"
//     const errors = await field.test(input)
//     expect(Object.keys(errors)).toHaveLength(2)
// })