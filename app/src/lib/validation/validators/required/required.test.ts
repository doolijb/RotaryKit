import { expect, test } from "vitest"
import required from "."

test("required validator passes", async () => {
    const validator = required()
    expect(await validator.test("Hello World")).toBe(true)
})

test("required validator fails", async () => {
    const validator = required()
    expect(await validator.test("")).toBe(false) // Should fail when empty
})