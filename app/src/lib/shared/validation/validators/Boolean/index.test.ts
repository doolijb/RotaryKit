import { expect, test } from "vitest"
import boolean from "."

const data = {
    a: "",
    b: "true",
    c: "what is love?",
}

test("boolean validator test: passes", async () => {
    const validator = boolean()

    // Validator should be truthy when empty
    let result = await validator.test({key:"a", data})
    expect(result).toBe(true)

    result = await validator.test({key:"b", data})
    expect(result).toBe(true)
})

test("boolean validator test: fails", async () => {
    const validator = boolean()

    const result = await validator.test({key:"c", data})

    expect(result).toBe(false)
})