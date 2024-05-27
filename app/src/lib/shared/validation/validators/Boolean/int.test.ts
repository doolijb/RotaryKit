import { expect, test } from "vitest"
import { Boolean } from "."

const data = {
    a: true,
    b: false,
    c: "what is love?",
}

test("boolean primitive validator test: passes", async () => {
    const validator = Boolean.init()

    let result = await validator.validate({key:"a", data})
    expect(Object.keys(result)).toHaveLength(0)

    result = await validator.validate({key:"b", data})
    expect(Object.keys(result)).toHaveLength(0)
})

test("boolean primitive validator test: fails", async () => {
    const validator = Boolean.init()

    const result = await validator.validate({key:"c", data})

    expect(Object.keys(result)).toHaveLength(1)
})