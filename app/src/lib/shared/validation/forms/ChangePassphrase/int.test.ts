import { expect, test } from "vitest"
import { ChangePassphrase } from "."

const form = ChangePassphrase.init()

test("ChangePassphrase form test: passes", async () => {
	const data: FormDataOf<ChangePassphrase> = {
		currentPassphrase: "currentpassphrase!",
		passphrase: "newpassphrase!",
		passphraseConfirm: "newpassphrase!"
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})

test("ChangePassphrase form test: fails when passphrase and passphraseConfirm do not match", async () => {
	const data = {
		currentPassphrase: "currentpassphrase!",
		passphrase: "newpassphrase!",
		passphraseConfirm: "differentpassphrase!" // passphraseConfirm does not match passphrase
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("passphraseConfirm")
})

test("ChangePassphrase form test: fails when passphrase is not a valid passphrase", async () => {
	const data = {
		currentPassphrase: "currentpassphrase!",
		passphrase: "short", // passphrase is not a valid passphrase
		passphraseConfirm: "short"
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("passphrase")
})

test("ChangePassphrase form test: fails when passphraseConfirm is not a valid passphrase", async () => {
	const data = {
		currentPassphrase: "currentpassphrase!",
		passphrase: "newpassphrase!",
		passphraseConfirm: "short" // passphraseConfirm is not a valid passphrase
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("passphraseConfirm")
})

test("ChangePassphrase form test: fails when currentPassphrase is not provided", async () => {
	const data = {
		passphrase: "newpassphrase!",
		passphraseConfirm: "newpassphrase!"
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("currentPassphrase")
})
