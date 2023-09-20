import { expect, test } from "vitest"
import passphrase from "."

test("passphrase field validation passes", async () => {
    const fieldValidators = passphrase()
    const input = "$some 5tr0ng p4ssphr4se!"
    for (const [key, validator] of Object.entries(fieldValidators)) {
        expect(validator.test(input)).toBe(true)
    }
})

test("passphrase field validation fails", async () => {
    const fieldValidators = passphrase()
    const input = "password"
    let failed = false
    for (const [key, validator] of Object.entries(fieldValidators)) {
        try {
            expect(validator.test(input)).toBe(true)
        } 
        catch (error) {
            failed = true
        }
    }
    expect(failed).toBe(true)
})