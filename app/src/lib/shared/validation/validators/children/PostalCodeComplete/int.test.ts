import { expect, test } from "vitest"
import { PostalCodeComplete } from "."

const data = {
    a: "",
    b: "99208",
    c: "abc",
    d: "US",
}

test("postal code complete validator test: passes", async () => {
    const validator = PostalCodeComplete.init({ countryCodeKey: "d" })
    expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
    expect(await validator.test({key:"b", data})).toBe(true)
})

test("postal code complete validator test: fails", async () => {
    const validator = PostalCodeComplete.init({ countryCodeKey: "d" })
    expect(await validator.test({key:"c", data})).toBe(false)
})