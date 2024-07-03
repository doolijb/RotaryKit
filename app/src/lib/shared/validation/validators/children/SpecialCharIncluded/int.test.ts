import { expect, test } from "vitest"
import { SpecialCharIncluded } from "."

const data = {
    a: "",
    b: "HelloWorld",
    c: "Hello World!",
}

test("SpecialCharIncluded validator test: passes", async () => {
    const validator = SpecialCharIncluded.init()
    expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
    expect(await validator.test({key:"c", data})).toBe(true)
})

test("SpecialCharIncluded validator test: fails", async () => {
    const validator = SpecialCharIncluded.init()
    expect(await validator.test({key:"b", data})).toBe(false)
})