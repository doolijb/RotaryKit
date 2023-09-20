import { expect, test } from "vitest"
import specialCharExcluded from "."

test("specialCharExcluded validator passes", async () => {
    const validator = specialCharExcluded()
    expect(validator.test("")).toBe(true) // Should pass when empty
    expect(validator.test("HelloWorld")).toBe(true)
})

test("specialCharExcluded validator fails", async () => {
    const validator = specialCharExcluded()
    expect(validator.test("Hello World!")).toBe(false)
})