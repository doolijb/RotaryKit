import { expect, test } from "vitest"
import { NewPassphrase } from "."

const form = NewPassphrase.init()

test("NewPassphrase form test: passes", async () => {
    const data: FormDataOf<NewPassphrase> = {
        passphrase: "testpassphrase!",
        passphraseConfirm: "testpassphrase!",
    }
    const result = await form.validate({data})
    expect(result).toEqual({})
})

test("NewPassphrase form test: fails when passphrase and passphraseConfirm do not match", async () => {
    const data = {
        passphrase: "testpassphrase!",
        passphraseConfirm: "differentpassphrase!", // passphraseConfirm does not match passphrase
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("passphraseConfirm")
})

test("NewPassphrase form test: fails when passphrase is not a valid passphrase", async () => {
    const data = {
        passphrase: "short", // passphrase is not a valid passphrase
        passphraseConfirm: "short",
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("passphrase")
})

test("NewPassphrase form test: fails when passphraseConfirm is not a valid passphrase", async () => {
    const data = {
        passphrase: "testpassphrase!",
        passphraseConfirm: "short", // passphraseConfirm is not a valid passphrase
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("passphraseConfirm")
}) 