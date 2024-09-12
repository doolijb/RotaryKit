import { test, expect } from "@playwright/test"
import { axios, clearDB, basicUser } from "$shared/testing"
import { db } from "$server/database"
import type { ChangePassphrase } from "$shared/validation/forms"

test.describe("API Change Passphrase PUT", () => {
    test.beforeEach(async () => {
        await clearDB()
        await basicUser.create()
    })

    test("201 with correct current passphrase and valid new passphrase", async () => {
        const data: ChangePassphrase["Data"] = {
            currentPassphrase: basicUser.data.passphrase,
            passphrase: "N3w$tr0ngP@ssw0rd",
            passphraseConfirm: "N3w$tr0ngP@ssw0rd"
        }

        // Make the API call in the Node.js context
        const response = await axios.put("/profile/passphrase", data).catch(e => {
            console.log("error", e.response.data)
            return e.response
        })

        // Check the status code and body
        expect(response.status).toBe(201)
        expect(response.data.success).toBe(true)

        // Check the db that the passphrase was updated
        const user = await db.query.users.findFirst({
            where: (u, { eq }) => eq(u.username, basicUser.data.username)
        })

        // Validate the new passphrase
        const isValid = await users.passphrase.validate({
            userId: user.id,
            passphrase: data.passphrase
        })

        expect(isValid).toBe(true)
    })

    test("400 with incorrect current passphrase", async () => {
        const data: ChangePassphrase["Data"] = {
            currentPassphrase: "Wr0ngP@ssw0rd",
            passphrase: "N3w$tr0ngP@ssw0rd",
            passphraseConfirm: "N3w$tr0ngP@ssw0rd"
        }

        const response = await axios.put("/profile/passphrase", data).catch(e => e.response)

        // Check the response
        expect(response.status).toBe(400)
        expect(response.data.errors).toHaveProperty("currentPassphrase")
        expect(response.data.message).toBe("Your current passphrase is incorrect")
    })

    test("400 with mismatched new passphrase and confirmation", async () => {
        const data: ChangePassphrase["Data"] = {
            currentPassphrase: basicUser.data.passphrase,
            passphrase: "N3w$tr0ngP@ssw0rd",
            passphraseConfirm: "M1sm@tchedP@ssw0rd"
        }

        const response = await axios.put("/profile/passphrase", data).catch(e => e.response)

        // Check the response
        expect(response.status).toBe(400)
        expect(response.data.errors).toHaveProperty("passphraseConfirm")
    })

    test("400 with undefined required fields", async () => {
        const data = {}

        const response = await axios.put("/profile/passphrase", data).catch(e => e.response)

        // Check the response
        expect(response.status).toBe(400)
        expect(response.data.errors).toHaveProperty("currentPassphrase")
        expect(response.data.errors).toHaveProperty("passphrase")
        expect(response.data.errors).toHaveProperty("passphraseConfirm")
    })
})