import { expect, test } from "vitest"
import { AdminEditUserPassphrase } from "."

const form = AdminEditUserPassphrase.init()

test("AdminEditUserPassphrase form test: passes", async () => {
	const data: FormDataOf<AdminEditUserPassphrase> = {
		passphrase: "testpassphrase!"
		// passphraseConfirm: "testpassphrase!",
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})

test("AdminEditUserPassphrase form test: fails when passphrase is not a valid passphrase", async () => {
	const data: FormDataOf<AdminEditUserPassphrase> = {
		passphrase: "short" // passphrase is not a valid passphrase
		// passphraseConfirm: "short",
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("passphrase")
})
