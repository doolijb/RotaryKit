import { expect, test } from "vitest"
import boolean from "."

test("boolean validator test: passes", async () => {
    const validator = boolean()

    // Validator should be truthy when empty
    let result = await validator.test("")
    expect(result).toBe(true)

    result = await validator.test("true")
    expect(result).toBe(true)
})

test("boolean validator test: fails", async () => {
    const validator = boolean()

    let result = await validator.test("what is love?")

    expect(result).toBe(false)
})