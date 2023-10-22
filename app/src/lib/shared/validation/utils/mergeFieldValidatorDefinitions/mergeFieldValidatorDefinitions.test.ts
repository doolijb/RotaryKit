import { expect, test } from "vitest"
import mergeFieldValidatorDefinitions from "."
import { validators } from "@validation"
import { deepCompare } from "@testing"


test("mergeFieldValidatorDefinitions has correct output", async () => {
    const definition = {
        required: {
            validator: null,
            args: {}
        },
        minLength: {
            validator: validators.minLength,
            args: {
                length: 3
            }
        }
    }
    const extras = {
        required: {
            validator: validators.required,
            args: {}
        },
        minLength: {
            validator: validators.minLength,
            args: {
                length: 5
            }
        },
        maxLength: {
            validator: validators.maxLength,
            args: {
                length: 10
            }
        }
    }
    const expected = {
        required: {
            validator: validators.required,
            args: {}
        },
        minLength: {
            validator: validators.minLength,
            args: {
                length: 5
            }
        },
        maxLength: {
            validator: validators.maxLength,
            args: {
                length: 10
            }
        }
    }
    const result = mergeFieldValidatorDefinitions({definition, extras})

    expect(deepCompare(result, expected)).toBe(true)
})