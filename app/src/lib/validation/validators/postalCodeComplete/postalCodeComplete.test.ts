import { expect, test } from "@playwright/test"
import postalCodeComplete from "."

test("postalCode validator passes", async () => {
    const validator = postalCodeComplete({ getCountryCode: () => "US" })
    expect(validator.test("")).toBe(true) // Should pass when empty
    expect(validator.test("99208")).toBe(true)
})

test("postalCode validator fails", async () => {
    const validator = postalCodeComplete({ getCountryCode: () => "US" })
    expect(validator.test("abc")).toBe(false)
})