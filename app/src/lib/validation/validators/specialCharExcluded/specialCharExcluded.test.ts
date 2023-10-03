import { expect, test } from "vitest"
import specialCharExcluded from "."

test("specialCharExcluded validator test passes", async () => {
    const validator = specialCharExcluded()
    expect(await validator.test("")).toBe(true) // Should pass when empty
    expect(await validator.test("HelloWorld")).toBe(true)
})

test("specialCharExcluded validator test fails", async () => {
    const validator = specialCharExcluded()
    expect(await validator.test("Hello World!")).toBe(false)
})