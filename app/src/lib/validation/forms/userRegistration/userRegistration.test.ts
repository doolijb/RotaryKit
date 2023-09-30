import { expect, test } from "vitest"
import definition from "."
import type { IFormValidatorDefinition } from "@interfaces"
import { utils } from "@validation"

// test("userRegistration test passes", async () => {
//     const data = {
//         email: "jack.sparrow@example.com",
//         passphrase: "$password123456789",
//         passphraseConfirm: "$password123456789"
//     }
//     const extras = {
//         passphraseConf: {
//             confirmMatch: {
//                 args: {
//                     getMatchValue: () => data.passphrase
//                 }
//             }
//         }
//     } as IFormValidatorDefinition

//     const form = utils.formValidator({definition, extras})
//     const result = await form.test(data)
//     expect(result).toHaveLength(0)
// })

test("userRegistration test fails", async () => {
    // expect(false).toBe(true) // TODO
})