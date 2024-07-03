import { expect, test } from "vitest"
import { ResetPassphraseByUsername } from "."

const form = ResetPassphraseByUsername.init()

test("ResetPassphraseByUsername form test: passes", async () => {
    const data: ResetPassphraseByUsername["Data"] = {
        username: "testuser",
    }
    const result = await form.validate({data})
    expect(result).toEqual({})
})

test("ResetPassphraseByUsername form test: fails when username is empty", async () => {
    const data = {
        username: "", // username is less than 5 characters
    }
    const result = await form.validate({data})
    expect(result).toHaveProperty("username")
}) 