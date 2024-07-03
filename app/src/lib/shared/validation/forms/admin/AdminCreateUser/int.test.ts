import { expect, test } from "vitest"
import { AdminCreateUser } from "."

const form = AdminCreateUser.init()

test("AdminCreateUser form test: passes", async () => {
    const data: FormDataOf<AdminCreateUser> = {
        username: "testuser",
        email: "test@example.com",
        passphrase: "securePassphrase123!", // added special character
        isVerified: true,
    }
    const result = await form.validate({data})
    expect(result).toEqual({})
})

test("AdminCreateUser form test: fails when username is not valid", async () => {
    const data = {
        username: "test user", // username is not valid
        email: "test@example.com",
        passphrase: "securePassphrase123",
        isVerified: true,
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("username")
})

test("AdminCreateUser form test: fails when email is not valid", async () => {
    const data = {
        username: "testuser",
        email: "not an email", // email is not valid
        passphrase: "securePassphrase123",
        isVerified: true,
    }
    const result = await form.validate({data}) 
    expect(result).toHaveProperty("email")
})

test("AdminCreateUser form test: fails when passphrase is not valid", async () => {
    const data = {
        username: "testuser",
        email: "test@example.com",
        passphrase: "pass", // passphrase is not valid
        isVerified: true,
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("passphrase")
})

test("AdminCreateUser form test: fails when isVerified is not a boolean", async () => {
    const data = {
        username: "testuser",
        email: "test@example.com",
        passphrase: "securePassphrase123",
        isVerified: "true", // isVerified is not a boolean
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("isVerified")
})

test("AdminCreateUser form test: passes when email is not provided", async () => {
    const data = {
        username: "testuser",
        passphrase: "securePassphrase123!", // added special character
        isVerified: true,
    }
    const result = await form.validate({data})
    expect(result).toEqual({})
})