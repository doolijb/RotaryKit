import { expect, test } from "vitest"
import postalCodeComplete from "."

test("postalCode validator passes", async () => {
    const validator = postalCodeComplete({ getCountryCode: () => "US" })
    expect(await validator.test("")).toBe(true) // Should pass when empty
    expect(await validator.test("99208")).toBe(true)
})

test("postalCode validator fails", async () => {
    const validator = postalCodeComplete({ getCountryCode: () => "US" })
    expect(await validator.test("abc")).toBe(false)
})