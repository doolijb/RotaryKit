import { expect, test } from "vitest"
import username from "."

test("username field validation passes", async () => {
    const fieldValidators = username()
    const input = "SparrowJack"
    for (const [key, validator] of Object.entries(fieldValidators)) {
        expect(await validator.test(input)).toBe(true)
    }
})

test("username field validation fails", async () => {
    const fieldValidators = username()
    const input = "$parrowJack"
    let failed = false
    for (const [key, validator] of Object.entries(fieldValidators)) {
        try {
            expect(await validator.test(input)).toBe(true)
        }
        catch {
            failed = true
        }
    }
    expect(failed).toBe(true)
})