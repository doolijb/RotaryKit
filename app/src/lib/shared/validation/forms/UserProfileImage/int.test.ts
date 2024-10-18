import { expect, test } from "vitest"
import { UserLogin } from "."

const form = UserLogin.init()

test("UserLogin form test: passes", async () => {
    const data: FormDataOf<UserLogin> = {
        email: "test@example.com",
        passphrase: "pass",
    }
    const result = await form.validate({data})
    expect(result).toEqual({})
})

test("UserLogin form test: fails when email is less than 3 characters", async () => {
    const data = {
        email: "us", // email is invalid format
        passphrase: "pass",
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("email")
})

test("UserLogin form test: fails when passphrase is less than 3 characters", async () => {
    const data = {
        email: "test@example.com",
        passphrase: "pa", // passphrase is less than 3 characters
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("passphrase")
})  