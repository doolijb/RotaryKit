import { axios, apiRoute, basicUser, queryInbox } from "@testing"
import { db, schema } from "@database"
import { eq } from "drizzle-orm"
import { test, expect } from "vitest"
import type { forms } from "@validation"
import data from "./data"
data // silence unused warning, this is needed file watch to work


test("Passphrase forgot POST: passes with username", async () => {

    /**
     * Create user
     */
    await basicUser.create()
    const [{userId}] = await db.select({
        userId: schema.users.id
    }).from(
        schema.users
    ).where(
        eq(schema.users.username, basicUser.data.username)
    ).limit(1)

    /**
     * Send request
     */
    const data: Record<keyof typeof forms.resetPassphrase, string> = {
        username: basicUser.data.username,
    }

    const response = await axios.post(apiRoute(__dirname), data)

    /**
     * Check the response
     */
    expect(response.status).toBe(201)
    expect(response.data.success).toBe(true)  

    /**
     * Check that a passphrase reset code was created
     */
    const [{code}] = await db.select({
        code: schema.passphraseResets.id,
    }).from(
        schema.passphraseResets
    ).where(
        eq(schema.passphraseResets.userId, userId)
    ).limit(1)

    /**
     * Check maildev for an email containing a message
     */
    const inboxResponse = await queryInbox()
    const inboxEmail = inboxResponse.data.find((email: any) => {
        return (
                email.to[0].address.includes(basicUser.data.email)
                && email.html.includes(code)
            )
    })
    expect(inboxEmail).not.toBe(undefined)
})


test("Passphrase forgot POST: passes with email", async () => {

    /**
     * Create user
     */
    await basicUser.create()
    const [{userId}] = await db.select({
        userId: schema.users.id
    }).from(
        schema.users
    ).where(
        eq(schema.users.username, basicUser.data.username)
    ).limit(1)

    /**
     * Send request
     */
    const data: Record<keyof typeof forms.resetPassphrase, string> = {
        username: basicUser.data.email,
    }

    const response = await axios.post(apiRoute(__dirname), data)

    /**
     * Check the response
     */
    expect(response.status).toBe(201)
    expect(response.data.success).toBe(true)  

    /**
     * Check that a passphrase reset code was created
     */
    const [{code}] = await db.select({
        code: schema.passphraseResets.id,
    }).from(
        schema.passphraseResets
    ).where(
        eq(schema.passphraseResets.userId, userId)
    ).limit(1)

    /**
     * Check maildev for an email containing a message
     */
    const inboxResponse = await queryInbox()
    const inboxEmail = inboxResponse.data.find((email: any) => {
        return (
                email.to[0].address.includes(basicUser.data.email)
                && email.html.includes(code)
            )
    })
    expect(inboxEmail).not.toBe(undefined)
})

test("Passphrase forgot POST: fails with bad username", async () => {

    /**
     * Create user
     */
    await basicUser.create()

    /**
     * Send request
     */
    const data: Record<keyof typeof forms.resetPassphrase, string> = {
        username: "badusername",
    }

    const response = await axios.post(apiRoute(__dirname), data).catch((error) => {
        return error.response
    })

    /**
     * Check the response
     */
    expect(response.status).toBe(400)
    expect(response.data.success).toBe(undefined) 
    expect(response.data.message).toBeDefined()
})