import { expect, test } from "vitest"
import { PostalCodeValid } from "."

const data = {
    a: "",
    b: "99208",
    c: "abc",
    d: "US",
}

test("postal code complete validator test: passes", async () => {
    const validator = PostalCodeValid.init({ countryCodeKey: "d" })
    expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
    expect(await validator.test({key:"b", data})).toBe(true)
})

test("postal code complete validator test: fails", async () => {
    const validator = PostalCodeValid.init({ countryCodeKey: "d" })
    expect(await validator.test({key:"c", data})).toBe(false)
}) 