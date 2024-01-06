import { expect, test } from "vitest"
import required from "."

const data = {
    a: "",
    b: "Hello World",
}

test("required validator test: passes", async () => {
    const validator = required()
    expect(await validator.test({key:"b", data})).toBe(true)
})

test("required validator test: fails", async () => {
    const validator = required()
    expect(await validator.test({key:"a", data})).toBe(false) // Should fail when empty
})