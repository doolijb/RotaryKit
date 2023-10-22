import { expect, expectTypeOf, test, vi } from "vitest"
import fieldValidator from "."
import { validators } from "@validation"

test("fieldValidator creates a FieldValidator", async () => {
    
    const definition: FieldValidatorDefinition = {
        required: {
            args: {},
            validator: validators.required
        },
        email: {
            args: {},
            validator: validators.emailAddressComplete
        }
    }

    const extras: FieldValidatorDefinition = {
        minLength: {
            args: { minLen: 8 },
            validator: validators.minLength
        },
        maxLength: {
            args: { maxLen: 100 },
            validator: validators.maxLength
        }
    }

    const expected: FieldValidator = {
        validators: {
            required: expect.any(Object),
            email: expect.any(Object),
            minLength: expect.any(Object),
            maxLength: expect.any(Object)
        },
        test: expect.any(Function)
    }

    const result = fieldValidator({definition, extras})

    expect(result).toEqual(expected)
})

test("fieldValidator test returns errors", async () => {
    const definition: FieldValidatorDefinition = {
        emailAddressComplete: {
            args: {},
            validator: validators.emailAddressComplete
        }
    }

    const field = fieldValidator({definition})
    const data = {}
    const expected = { emailAddressComplete: expect.any(String) }
    const result = await field.test(data)

    expect(result).toEqual(expected)
})