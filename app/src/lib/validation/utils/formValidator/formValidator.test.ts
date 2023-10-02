import { expect, test } from "vitest"
import formValidator from "."
import { validators } from "@validation"
import type { IFormValidatorDefinition, IFormValidator } from "@interfaces"

test("formValidator creates FormValidator", async () => {
    const definitions: IFormValidatorDefinition = {
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

    const extras: IFormValidatorDefinition = {
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

    const expected: IFormValidator = {
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