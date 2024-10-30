import { expect, test } from "vitest"
import { passphraseConfirm } from "."

const field = passphraseConfirm()

test("passphraseConfirm field validation: passes", async () => {
	const data = {
		passphrase: "ValidPassphrase1!",
		passphraseConfirm: "ValidPassphrase1!"
	}
	const errors = await field.validate({ key: "passphraseConfirm", data })
	expect(errors).toEqual({})
})

test("passphraseConfirm field validation: fails when it does not match passphrase", async () => {
	const data = {
		passphrase: "ValidPassphrase1!",
		passphraseConfirm: "DifferentPassphrase1!"
	}
	const errors = await field.validate({ key: "passphraseConfirm", data })
	expect(errors).toHaveProperty("matches")
})
