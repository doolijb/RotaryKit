import { expect, test } from "vitest"
import definitions from "."
import { utils } from "@validation"

test("newPassphrase form test: passes", async () => {
    const data = {
        passphrase: "$password123456789",
        passphraseConfirm: "$password123456789"
    }
 
    const extras: FormValidatorDefinition = {
        passphraseConfirm: { 
            matches: {
                args: {
                    getValue: () => data.passphrase
                }
            }
        }
    } 
 
    const form = utils.formValidator({definitions, extras})
    const result = await form.test(data)
    const expected = {}
    expect(result).toEqual(expected)
})

test("newPassphrase form: passphrases must match", async () => {
    const data = {
        passphrase: "$password123456789",
        passphraseConfirm: "$password1234567890"
    }

    const extras: FormValidatorDefinition = {
        passphraseConfirm: {
            matches: {
                args: {
                    getValue: () => data["passphrase"]
                }
            }
        }
    }

    const form = utils.formValidator({definitions, extras})
    const expected = {
        passphraseConfirm: {
            "matches": expect.any(String),
        }
    }

    const result = await form.test(data)

    expect(result).toStrictEqual(expected)
})