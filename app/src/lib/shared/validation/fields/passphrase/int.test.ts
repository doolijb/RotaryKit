import { expect, test } from "vitest"
import { passphrase } from "."

const field = passphrase()

test("passphrase field validation: passes", async () => {
    const data = {
        passphrase: "ValidPassphrase1!",
    }
    const errors = await field.validate({ key: "passphrase", data })
    expect(errors).toEqual({})
})

test("passphrase field validation: fails when length is less than 8", async () => {
    const data = {
        passphrase: "Short1!",
    }
    const errors = await field.validate({ key: "passphrase", data })
    expect(errors).toHaveProperty("minLength")
})

test("passphrase field validation: fails when length is more than 100", async () => {
    const data = {
        passphrase: "a".repeat(101),
    }
    const errors = await field.validate({ key: "passphrase", data })
    expect(errors).toHaveProperty("maxLength")
})

test("passphrase field validation: fails when no special character is included", async () => {
    const data = {
        passphrase: "NoSpecialChar1",
    }
    const errors = await field.validate({ key: "passphrase", data })
    expect(errors).toHaveProperty("specialCharIncluded")
})