import { expect, test } from "vitest"
import specialCharIncluded from "."

test("specialCharIncluded validator test: passes", async () => {
    const validator = specialCharIncluded()
    expect(await validator.test("")).toBe(true) // Should pass when empty
    expect(await validator.test("Hello World!")).toBe(true)
})

test("specialCharIncluded validator test: fails", async () => {
    const validator = specialCharIncluded()
    expect(await validator.test("Hello World")).toBe(false)
})