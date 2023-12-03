import { axios, apiRoute, basicUser, queryInbox} from "@testing"
import { db } from "@database"
import { test, expect } from "vitest"
import type { forms } from "@validation"
import data from "./data"
data // silence unused warning, this is needed file watch to work


test("Register POST test: passes", async () => {

    const data: {[key in keyof typeof forms.userRegister]: string} = {
        username: "jack",
        email: "jack@example.com",
        passphrase: "$Om3p4$$phr4$3",
        passphraseConfirm: "$Om3p4$$phr4$3",
    }

    const response = await axios.post(apiRoute(__dirname), data)

    /**
     * Check the response
     */
    expect(response.status).toBe(201)
    expect(response.data.success).toBe(true)

    /**
     * Check the db that the user was created
     */
    const user = await db.query.users.findFirst({
        where: (u, {eq}) => eq(u.username, data.username),
        with: {
            emails: true
        }
    })

    /**
     * Check the user record
     */
    expect(user.username).toBe(data.username)
    expect(user.verifiedAt).toBe(null)

    /**
     * Check the email record
     */
    expect(user.emails.length).toBe(1)
    expect(user.emails[0].isUserPrimary).toBe(true)
    expect(user.emails[0].verifiedAt).toBe(null)
    expect(user.emails[0].address).toBe(data.email)

    /**
     * Check that a verification email was sent
     */
    const emailVerification = await db.query.emailVerifications.findFirst({
        where: (v, {and, eq, isNull, or, gt}) => and(
            eq(v.emailId, user.emails[0].id),
            isNull(v.verifiedAt),
            or(
                isNull(v.expiresAt),
                gt(v.expiresAt, new Date())
            ),
        )
    })

    /**
     * Check maildev for an email containing the activation code
     */
    const inboxResponse = await queryInbox()
    const inboxEmail = inboxResponse.data.find((email: any) => {
        return (
                email.to[0].address.includes(data.email)
                && email.html.includes(emailVerification.id)
            )
    })
    expect(inboxEmail).not.toBe(undefined)
})

test("Register POST test fails when required fields are missing", async () => {

    /**
     * Check required fields
     */
    const data = {}

    const response = await axios.post(apiRoute(__dirname), data).catch(e => e.response)

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


test("Register POST test fails when username and email already exists", async () => {

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

    let response = await axios.post(apiRoute(__dirname), data).catch(e => e.response)

    /**
     * Check the response
     */
    expect(response.status).toBe(400)
    expect(response.data.errors).toHaveProperty("username")
    expect(response.data.errors.username).toHaveProperty("Taken")

    /**
     * Try to register again with the same email
     */
    response = await axios.post(apiRoute(__dirname), {
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