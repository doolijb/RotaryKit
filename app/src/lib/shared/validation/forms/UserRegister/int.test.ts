import { expect, test } from "vitest"
import { UserRegister } from "."

const form = UserRegister.init()

test("UserRegister form test: passes", async () => {
    const data: UserRegister["Data"] = {
        username: "testuser",
        email: "testuser@example.com",
        passphrase: "testpassphrase!",
        passphraseConfirm: "testpassphrase!",
    }
    const result = await form.validate({data})
    expect(result).toEqual({})
})

test("UserRegister form test: fails when username is not a valid username", async () => {
    const data = {
        username: "invalid username", // username is not a valid username
        email: "testuser@example.com",
        passphrase: "testpassphrase!",
        passphraseConfirm: "testpassphrase!",
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("username")
})

test("UserRegister form test: fails when email is not a valid email", async () => {
    const data = {
        username: "testuser",
        email: "invalid email", // email is not a valid email
        passphrase: "testpassphrase!",
        passphraseConfirm: "testpassphrase!",
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("email")
})

test("UserRegister form test: fails when passphrase and passphraseConfirm do not match", async () => {
    const data = {
        username: "testuser",
        email: "testuser@example.com",
        passphrase: "testpassphrase!",
        passphraseConfirm: "differentpassphrase!", // passphraseConfirm does not match passphrase
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("passphraseConfirm")
})

test("UserRegister form test: fails when passphrase is not a valid passphrase", async () => {
    const data = {
        username: "testuser",
        email: "testuser@example.com",
        passphrase: "short", // passphrase is not a valid passphrase
        passphraseConfirm: "short",
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("passphrase")
})

test("UserRegister form test: fails when passphraseConfirm is not a valid passphrase", async () => {
    const data = {
        username: "testuser",
        email: "testuser@example.com",
        passphrase: "testpassphrase!",
        passphraseConfirm: "short", // passphraseConfirm is not a valid passphrase
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("passphraseConfirm")
})