import { expect, test } from "vitest"
import formValidator from "."
import { validators } from "@validation"

test("formValidator creates FormValidator", async () => {
    const definitions: FormValidatorDefinition = {
        email: {
            required: {
                args: {},
                validator: validators.required
            },
            emailAddressComplete: {
                args: {},
                validator: validators.emailAddressComplete
            }
        }
    }

    const extras: FormValidatorDefinition = {
        passphrase: {
            required: {
                args: {},
                validator: validators.required
            },
            minLength: {
                args: { minLen: 8 },
                validator: validators.minLength
            },
            maxLength: {
                args: { maxLen: 100 },
                validator: validators.maxLength
            }
        }
    }

    const expected: FormValidator = {
        fields: {
            email: expect.objectContaining({
                validators: expect.objectContaining({
                    required: expect.any(Object),
                    emailAddressComplete: expect.any(Object)
                }),
                test: expect.any(Function),
            }),
            passphrase: expect.objectContaining({
                validators: expect.objectContaining({
                    required: expect.any(Object),
                    minLength: expect.any(Object),
                    maxLength: expect.any(Object)
                }),
                test: expect.any(Function),
            })
        },
        test: expect.any(Function)
    }

    const result = formValidator({definitions: definitions, extras: extras})

    expect(result).toEqual(expected)
})

test("formValidator test returns errors", async () => {
    const definitions: FormValidatorDefinition = {
        email: {
            emailAddressComplete: {
                args: {},
                validator: validators.emailAddressComplete
            }
        }
    }

    const form = formValidator({definitions})
    const data = {
        email: "jack.sparrow@example"
    }
    const expected = { email: { emailAddressComplete: expect.any(String) } }
    const result = await form.test(data)

    expect(result).toEqual(expected)
})