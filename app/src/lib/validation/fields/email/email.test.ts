import { expect, test } from "vitest"
import email from "."

test("email field validation passes", async () => {
    const fieldValidators = email()
    const input = "jack.sparrow@example.com"
    for (const [key, validator] of Object.entries(fieldValidators)) {
        expect(await validator.test(input)).toBe(true)
    }
})

test("email field validation fails", async () => {
    const fieldValidators = email()
    const input = "jack.sparrow@example"
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