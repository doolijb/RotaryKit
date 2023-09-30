import { expect, test } from "vitest"
import definition from "."
import { utils } from "@validation"
import type { IFieldValidatorDefinition } from "@interfaces"

test("passphraseConf field validation passes", async () => {
    const extras: IFieldValidatorDefinition = ({ 
        confirmMatch: {
            args: { getMatchValue: () => "password" }
        }
    })
    const field = utils.fieldValidator({definition, extras})
    const input = "password"
    const errors = await field.test(input)
    expect(Object.keys(errors)).toHaveLength(0)
})

test("passphraseConf field validation fails", async () => {
    const extras: IFieldValidatorDefinition = ({ 
        confirmMatch: {
            args: { getMatchValue: () => "bad pass" }
        }
    })
    const field = utils.fieldValidator({definition, extras})
    const input = "password1"
    const errors = await field.test(input)
    expect(Object.keys(errors)).toHaveLength(1)
})