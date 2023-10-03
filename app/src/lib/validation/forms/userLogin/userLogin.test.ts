import { expect, test } from "vitest"
import userLogin from "."
import { utils } from "@validation"

test("userLogin form test passes", async () => {
    const data = {
        email: "jack.sparrow@example.com",
        passphrase: "$password123456789",
    } 

    const form = utils.formValidator({definitions: userLogin})
    const result = await form.test(data)

    expect(result).toEqual({})
})

test("userLogin form test fails", async () => {
    const data = {
        email: "jack.sparrow@example",
        passphrase: "",
    } 

    const form = utils.formValidator({definitions: userLogin})
    const expected = {
        email: {
            emailAddressComplete: expect.any(String),
        },
        passphrase: {
            required: expect.any(String),
        },
    }
    const result = await form.test(data)

    expect(result).toStrictEqual(expected)
})