import { expect, test } from "vitest"
import { Truthy } from "."

const data = {
    country: "US",
    a: 1,
    b: true,
    c: false,
    d: 0,
    e: "true",
}

test("Truthy validator test: passes", async () => {
    const validator = Truthy.init({countryCodeKey: "country"})
    expect(await validator.test({key:"a",  data})).toBe(true) // Should pass when empty
    expect(await validator.test({key:"b",  data})).toBe(true)
})

test("Truthy validator test: fails", async () => {
    const validator = Truthy.init({countryCodeKey: "country"})
    expect(await validator.test({key:"c", data})).toBe(false)
    expect(await validator.test({key:"d", data})).toBe(false)
    expect(await validator.test({key:"e", data})).toBe(false)
}) 