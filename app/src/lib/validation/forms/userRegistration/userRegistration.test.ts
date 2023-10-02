import { expect, test } from "vitest"
import definitions from "."
import type { IFormValidatorDefinition } from "@interfaces"
import { utils } from "@validation"

test("userRegistration test passes", async () => {
    const data = {
        email: "jack.sparrow@example.com",
        passphrase: "$password123456789",
        passphraseConfirm: "$password123456789"
    }
    const extras = {
        passphraseConf: {
            confirmMatch: {
                args: {
                    getMatchValue: () => data.passphrase
                }
            }
        }
    } as IFormValidatorDefinition

    const form = utils.formValidator({definitions, extras})
    const result = await form.test(data)
    expect(Object.entries(result)).toHaveLength(0)
})

test("userRegistration test fails when empty", async () => {
    const data = {
        email: "",
        passphrase: "",
        passphraseConfirm: ""
    }

    const extras = {
        passphraseConf: {
            confirmMatch: {
                args: {
                    getMatchValue: () => data.passphrase
                }
            }
        }
    } as IFormValidatorDefinition

    const form = utils.formValidator({definitions, extras})
    const result = await form.test(data)
    expect(Object.entries(result)).toHaveLength(3)
})