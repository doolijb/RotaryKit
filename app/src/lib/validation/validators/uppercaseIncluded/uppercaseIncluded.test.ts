import { expect, test } from "vitest"
import uppercaseIncluded from "."

test("uppercaseIncluded validator passes", async () => {
    const validator = uppercaseIncluded()
    expect(validator.test("")).toBe(true) // Should pass when empty
    expect(validator.test("TEST")).toBe(true)
})

test("uppercaseIncluded validator fails", async () => {
    const validator = uppercaseIncluded()
    expect(validator.test("test")).toBe(false)
})