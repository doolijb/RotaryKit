import { expect, test } from "vitest"
import { RecoverPassphraseByEmail } from "."

const form = RecoverPassphraseByEmail.init()

test("RecoverPassphraseByEmail form test: passes when email is valid", async () => {
	const data: RecoverPassphraseByEmail["Data"] = {
		email: "test@example.com"
	}
	const result = await form.validate({ data })
	expect(result).toEqual({})
})

test("RecoverPassphraseByEmail form test: fails when email is invalid", async () => {
	const data = {
		email: "invalid email" // invalid email
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("email")
})

test("RecoverPassphraseByEmail form test: fails when email is empty", async () => {
	const data = {
		email: "" // empty email
	}
	const result = await form.validate({ data })
	expect(result).toHaveProperty("email")
})
