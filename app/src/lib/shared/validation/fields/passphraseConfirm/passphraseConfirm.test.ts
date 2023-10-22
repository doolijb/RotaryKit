import { expect, test } from "vitest"
import definition from "."
import { utils } from "@validation"


test("passphraseConfirm field validation passes", async () => {
    const extras: FieldValidatorDefinition = ({ 
        matches: {
            args: { getValue: () => "password" }
        }
    })
    const field = utils.fieldValidator({definition, extras})
    const input = "password"
    const errors = await field.test(input)
    expect(Object.keys(errors)).toHaveLength(0)
})

test("passphraseConfirm field validation fails", async () => {
    const extras: FieldValidatorDefinition = ({ 
        matches: {
            args: { getValue: () => "bad pass" }
        }
    })
    const field = utils.fieldValidator({definition, extras})
    const input = "password1"
    const errors = await field.test(input)
    expect(Object.keys(errors)).toHaveLength(1)
})