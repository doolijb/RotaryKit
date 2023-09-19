import { expect, test } from "@playwright/test"
import passphraseConf from "."

test("passphraseConf field validation passes", async () => {
    const getMatchValue = () => "password"
    const fieldValidators = passphraseConf({ 
        confirmMatch: {
            args: { getMatchValue }
        }
    })
    const input = "password"
    for (const [key, validator] of Object.entries(fieldValidators)) {
        expect(validator.test(input)).toBe(true)
    }
})

test("passphraseConf field validation fails", async () => {
    const getMatchValue = () => "password"
    const fieldValidators = passphraseConf({
        confirmMatch: {
            args: { getMatchValue }
        }
    })
    const input = "password1"
    let failed = false
    for (const [key, validator] of Object.entries(fieldValidators)) {
        try {
            expect(validator.test(input)).toBe(true)
        }
        catch {
            failed = true
        }
    }
    expect(failed).toBe(true)
})