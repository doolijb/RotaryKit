import { expect, test } from "vitest"
import { Required } from "."

const data = {
    a: "",
    b: "Hello World",
}

test("Required validator test: passes", async () => {
    const validator = Required.init()
    expect(await validator.test({key:"b", data})).toBe(true)
})

test("Required validator test: fails", async () => {
    const validator = Required.init()
    expect(await validator.test({key:"a", data})).toBe(false) // Should fail when empty
})