import { expect, test } from "vitest"
import { UserLogin } from "."

const form = UserLogin.init()

test("UserLogin form test: passes", async () => {
    const data: FormDataOf<UserLogin> = {
        username: "usr",
        passphrase: "pass",
    }
    const result = await form.validate({data})
    expect(result).toEqual({})
})

test("UserLogin form test: fails when username is less than 3 characters", async () => {
    const data = {
        username: "us", // username is less than 3 characters
        passphrase: "pass",
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("username")
})

test("UserLogin form test: fails when passphrase is less than 3 characters", async () => {
    const data = {
        username: "usr",
        passphrase: "pa", // passphrase is less than 3 characters
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("passphrase")
})  