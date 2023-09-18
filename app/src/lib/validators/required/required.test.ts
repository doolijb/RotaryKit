import { expect, test } from "@playwright/test"
import required from "."

test("required validator passes", async () => {
    const validator = required()
    expect(validator.test("Hello World")).toBe(true)
})

test("required validator fails", async () => {
    const validator = required()
    expect(validator.test("")).toBe(false) // Should fail when empty
})