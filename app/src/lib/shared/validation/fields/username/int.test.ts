import { expect, test } from "vitest"
import { username } from "."

const field = username()

test("username field validation: passes", async () => {
    const data = {
        username: "ValidUser",
    }
    const errors = await field.validate({ key: "username", data })
    expect(errors).toEqual({})
})

test("username field validation: fails when length is less than 5", async () => {
    const data = {
        username: "User",
    }
    const errors = await field.validate({ key: "username", data })
    expect(errors).toHaveProperty("minLength")
})

test("username field validation: fails when length is more than 20", async () => {
    const data = {
        username: "a".repeat(21),
    }
    const errors = await field.validate({ key: "username", data })
    expect(errors).toHaveProperty("maxLength")
})

test("username field validation: fails when special character is included", async () => {
    const data = {
        username: "InvalidUser!",
    }
    const errors = await field.validate({ key: "username", data })
    console.log(errors)
    expect(errors).toHaveProperty("specialCharExcluded")
})  