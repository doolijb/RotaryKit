import { expect, test } from "vitest"
import specialCharIncluded from "."

test("specialCharIncluded validator passes", async () => {
    const validator = specialCharIncluded()
    expect(validator.test("")).toBe(true) // Should pass when empty
    expect(validator.test("Hello World!")).toBe(true)
})

test("specialCharIncluded validator fails", async () => {
    const validator = specialCharIncluded()
    expect(validator.test("Hello World")).toBe(false)
})