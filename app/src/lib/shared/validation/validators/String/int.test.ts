import { expect, test } from "vitest"
import { String } from "."

const data = {
    a: "",
    b: "what is love?",
    c: 1,
}

test("String primitive validator test: passes", async () => {
    const validator = String.init()

    let result = await validator.validate({key:"a", data})
    expect(Object.keys(result)).toHaveLength(0)

    result = await validator.validate({key:"b", data})
    expect(Object.keys(result)).toHaveLength(0)
})

test("String primitive validator test: fails", async () => {
    const validator = String.init()

    const result = await validator.validate({key:"c", data})

    expect(Object.keys(result)).toHaveLength(1)
}) 