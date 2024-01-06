import { expect, test } from "vitest"
import {default as definitions} from "."
import { utils } from "$validation"

test("adminCreateUser form: passes", async () => {
    const data = {
        username: "jacksparrow",
        email: "jack.sparrow@example.com",
        passphrase: "$password123456789",
        isVerified: true,
        isAdmin: true,
        isSuperUser: true
    }

    const expected = {}
 
    // Test single field
    const form = utils.formValidator({definitions})
    let result = await form.test({username: data.username})
    expect(result).toEqual(expected)

    // Test all fields
    result = await form.test(data)
    expect(result).toEqual(expected)
})

test("admiNCreateUser form: username is required", async () => {
    const data = {}
    const form = utils.formValidator({definitions})
    const expected = {
        username: {
            "required": expect.any(String),
        }
    }
    const result = await form.test(data)
    expect(result).toStrictEqual(expected)
})