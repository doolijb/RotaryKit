import { expect, test } from "vitest"
import userLogin from "."
import { utils } from "@validation"

test("userLogin form test: passes", async () => {
    const data = {
        username: "jacksparrow",
        passphrase: "$password123456789",
    } 

    const form = utils.formValidator({definitions: userLogin})
    const result = await form.test(data)

    expect(result).toEqual({})
})

test("userLogin form test: fails", async () => {
    const data = {
        username: "",
        passphrase: "",
    } 

    const form = utils.formValidator({definitions: userLogin})
    const expected = {
        username: {
            required: expect.any(String),
        },
        passphrase: {
            required: expect.any(String),
        },
    }
    const result = await form.test(data)

    expect(result).toStrictEqual(expected)
})