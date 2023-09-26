import { expect, test } from "vitest"
import passphraseConf from "."

test("passphraseConf field validation passes", async () => {
    const field = passphraseConf.field({ 
        confirmMatch: {
            args: { getMatchValue: () => "password" }
        }
    })
    const input = "password"
    const errors = await field.test(input)
    expect(errors).toHaveLength(0)
})

test("passphraseConf field validation fails", async () => {
    const field = passphraseConf.field({ 
        confirmMatch: {
            args: { getMatchValue: () => "password" }
        }
    })
    const input = "password1"
    const errors = await field.test(input)
    console.log("errors", errors)
    expect(errors).toHaveLength(1)
})