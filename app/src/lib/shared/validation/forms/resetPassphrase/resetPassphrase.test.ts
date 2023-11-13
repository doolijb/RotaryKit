import { expect, test } from "vitest"
import definitions from "."
import { utils } from "@validation"

test("resetPassphrase form test: passes", async () => {
    const data = {
        username: "test",
    }
 
    const form = utils.formValidator({definitions})
    const result = await form.test(data)
    const expected = {}
    expect(result).toEqual(expected)
})

test("resetPassphrase form fields are required", async () => {
    const data = {}

    const form = utils.formValidator({definitions})
    const expected = {
        username: {
            "required": expect.any(String),
        },
    }
    const result = await form.test(data)
    expect(result).toStrictEqual(expected)
})