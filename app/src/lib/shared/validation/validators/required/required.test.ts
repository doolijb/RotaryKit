import { expect, test } from "vitest"
import required from "."

test("required validator test: passes", async () => {
    const validator = required()
    expect(await validator.test("Hello World")).toBe(true)
})

test("required validator test: fails", async () => {
    const validator = required()
    expect(await validator.test("")).toBe(false) // Should fail when empty
})