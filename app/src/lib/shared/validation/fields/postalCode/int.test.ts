import { expect, test } from "vitest"
import { postalCode } from "."

const field = postalCode()

test("PostalCodeValid field validation: passes", async () => {
    const data = {
        postalCode: "12345",
        countryCode: "US"
    }
    const errors = await field.validate({ key: "postalCode", data })
    expect(errors).toEqual({})
})

test("PostalCodeValid field validation: fails when length is less than 3", async () => {
    const data = {
        postalCode: "12",
        countryCode: "US"
    }
    const errors = await field.validate({ key: "postalCode", data })
    expect(errors).toHaveProperty("minLength")
})

test("PostalCodeValid field validation: fails when postal code is not valid for the country", async () => {
    const data = {
        postalCode: "Invalid",
        countryCode: "US"
    }
    const errors = await field.validate({ key: "postalCode", data })
    expect(errors).toHaveProperty("postalCodeValid")
})  