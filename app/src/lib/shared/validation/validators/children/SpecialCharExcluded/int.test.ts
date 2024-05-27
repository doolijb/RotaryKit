import { expect, test } from "vitest"
import { SpecialCharExcluded } from "."

const data = {
    a: "",
    b: "HelloWorld",
    c: "Hello World!",
}

test("specialCharExcluded validator test: passes", async () => {
    const validator = SpecialCharExcluded.init()
    expect(await validator.test({key:"a", data})).toBe(true) // Should pass when empty
    expect(await validator.test({key:"a", data})).toBe(true)
})

test("specialCharExcluded validator test: fails", async () => {
    const validator = SpecialCharExcluded.init()
    expect(await validator.test({key:"a", data})).toBe(false)
})