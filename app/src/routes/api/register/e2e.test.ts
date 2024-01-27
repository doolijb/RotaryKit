import { test, expect } from "@playwright/test"
import { axios, clearDB, basicUser } from "$testing"
import type { UserRegister } from "$validation/forms"
import { db } from "$database"

test("API Register POST: 201 with good credentials", async ({ page }) => {
    await clearDB()

    const data: UserRegister["Data"] = {
        username: "jack_sparrow",
        email: "jack@example.com",
        passphrase: "$Om3p4$$phr4$3",
        passphraseConfirm: "$Om3p4$$phr4$3",
    }

    // Make the API call in the Node.js context
    const response = await axios.post("/api/register", data).catch( e => {
        console.log("error", e.response.data)
        return e.response
    })

    // Check the status code and body
    expect(response.status).toBe(201)
    expect(response.data.success).toBe(true)

    // Check the db that the user was created
    const user = await db.query.users.findFirst({
        where: (u, {eq}) => eq(u.username, data.username),
        with: {
            emails: true
        }
    })

    // Check the user record
    expect(user.username).toBe(data.username)
    expect(user.verifiedAt).toBe(null)
})

test("API Register POST: 400 with undefined required fields", async () => {

    /**
     * Check required fields
     */
    const data = {}

    const response = await axios.post("/api/register", data).catch(e => e.response)

    /**
     * Check the response
     */

    expect(response.status).toBe(400)

    /**
     * Check the response body
     */
    expect(response.data.errors).toHaveProperty("username")
    expect(response.data.errors).toHaveProperty("email")
    expect(response.data.errors).toHaveProperty("passphrase")
    expect(response.data.errors).toHaveProperty("passphraseConfirm")
})


test("API Register POST: 400 for existing user", async () => {

    await basicUser.create()

    /**
     * Try to register again with the same username
     */
    const data = {
        username: basicUser.data.username,
        email: basicUser.data.email,
        passphrase: basicUser.data.passphrase,
        passphraseConfirm: basicUser.data.passphrase,
    }

    let response = await axios.post("/api/register", data).catch(e => e.response)

    /**
     * Check the response
     */
    expect(response.status).toBe(400)
    expect(response.data.errors).toHaveProperty("username")
    expect(response.data.errors.username).toHaveProperty("Taken")

    /**
     * Try to register again with the same email
     */
    response = await axios.post("/api/register", {
        ...data,
        username: "jack2"
    }).catch(e => e.response)

    /**
     * Check the response
     */

    expect(response.status).toBe(400)
    expect(response.data.errors).toHaveProperty("email")
    expect(response.data.errors.email).toHaveProperty("Taken")
})