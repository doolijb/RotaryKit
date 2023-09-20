import { expect, test } from "vitest"
import userRegistration from "."

test("userRegistration test passes", async () => {
    const data = {
        email: "jack.sparrow@example.com",
        passphrase: "$password123456789",
        passphraseConfirm: "$password123456789"
    }
    const form = userRegistration({
        passphraseConf: {
            confirmMatch: {
                args: {
                    getMatchValue: () => data.passphrase
                }
            }
        }
    })
    console.log("form", form.passphraseConf.args)

    expect(form.validate(data)).toBe(true)
})

test("userRegistration test fails", async () => {
    expect(false).toBe(true) // TODO
})