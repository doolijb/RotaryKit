import { expect, test } from "vitest"
import definitions from "."
import type { IFormValidatorDefinition } from "@interfaces"
import { utils } from "@validation"

test("userRegistration form test passes", async () => {
    const data = {
        email: "jack.sparrow@example.com",
        passphrase: "$password123456789",
        passphraseConfirm: "$password123456789"
    }
 
    const extras: IFormValidatorDefinition = {
        passphraseConfirm: { 
            confirmMatch: {
                args: {
                    getMatchValue: () => data.passphrase
                }
            }
        }
    } 
 
    const form = utils.formValidator({definitions, extras})
    const result = await form.test(data)
    const expected = {}
    expect(result).toEqual(expected)
})

test("userRegistration form fields are required", async () => {
    const data = {}

    const extras: IFormValidatorDefinition = {
        passphraseConfirm: {
            confirmMatch: {
                args: {
                    getMatchValue: () => data["passphrase"]
                }
            }
        }
    }

    const form = utils.formValidator({definitions, extras})
    const expected = {
        email: {
            "required": expect.any(String),
        },
        passphrase: {
            "required": expect.any(String),
        },
        passphraseConfirm: {
            "required": expect.any(String),
        },
    }
    const result = await form.test(data)
    expect(result).toStrictEqual(expected)
})

test("userRegistration form passphrases must match", async () => {
    const data = {
        email: "jack.sparrow@example.com",
        passphrase: "$password123456789",
        passphraseConfirm: "$password1234567890"
    }

    const extras: IFormValidatorDefinition = {
        passphraseConfirm: {
            confirmMatch: {
                args: {
                    getMatchValue: () => data["passphrase"]
                }
            }
        }
    }

    const form = utils.formValidator({definitions, extras})
    const expected = {
        passphraseConfirm: {
            "confirmMatch": expect.any(String),
        }
    }

    const result = await form.test(data)

    expect(result).toStrictEqual(expected)
})