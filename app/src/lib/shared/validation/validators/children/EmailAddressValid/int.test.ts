import { expect, test } from "vitest"
import { EmailAddressValid } from "."

const data = {
    a: "",
    b: "jack.sparrow@example.com",
    c: "what is love?",
}

test("email address complete validator test: passes", async () => {
    const validator = EmailAddressValid.init()

    let result = await validator.test({key:"a", data})
    expect(Object.keys(result)).toHaveLength(0)

    result = await validator.test({key:"b", data})
    expect(result).toBe(true)
})

test("email address complete validator test: fails", async () => {
    const validator = EmailAddressValid.init()

    const result = await validator.test({key:"c", data})

    expect(result).toBe(false)
})