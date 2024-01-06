import { expect, test } from "vitest"
import definitions from "."
import { utils } from "$validation"

test("userRegister form test: passes", async () => {
    const data = {
        username: "jacksparrow",
        email: "jack.sparrow@example.com",
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

test("userRegister form fields are required", async () => {
    const data = {}

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
        username: {
            "required": expect.any(String),
        },
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

test("userRegister form passphrases must match", async () => {
    const data = {
        username: "jacksparrow",
        email: "jack.sparrow@example.com",
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