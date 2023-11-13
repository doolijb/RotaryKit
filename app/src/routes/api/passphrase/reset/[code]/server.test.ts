import { axios, apiRoute, basicUser, queryInbox } from "@testing"
import { db, schema } from "@database"
import { eq } from "drizzle-orm"
import { test, expect } from "vitest"
import data from "./data"
import type { forms } from "@validation"
data // silence unused warning, this is needed file watch to work


test("Passphrase reset code POST: passes", async () => {

    /**
     * Create user and get userId
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
     * Create passphrase reset code
     */
    const [{code}] = await db.insert(schema.passphraseResets).values({
        userId,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    }).returning({
        code: schema.emailVerifications.id,
    })

    const data: Record<keyof typeof forms.newPassphrase, string> = {
        passphrase: basicUser.data.passphrase,
        passphraseConfirm: basicUser.data.passphrase,
    }

    /**
     * Send request 
     */ 

    const response = await axios.post(apiRoute(__dirname.replace("[code]", code)), data)

    /**
     * Check the response
     */
    expect(response.status).toBe(201)
    expect(response.data.success).toBe(true)

    /**
     * Check maildev for an email containing a message
     */
    const inboxResponse = await queryInbox()
    const inboxEmail = inboxResponse.data.find((email: any) => {
        return (
                email.to[0].address.includes(basicUser.data.email)
                && email.html.includes("passphrase was successfully changed")
            )
    })
    expect(inboxEmail).not.toBe(undefined)
})


test("Passphrase reset code POST: fails with invalid code", async () => {

    /**
     * Create user and get userId
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
     * Create passphrase reset code
     */
    const [{code}] = await db.insert(schema.passphraseResets).values({
        userId,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    }).returning({
        code: schema.emailVerifications.id,
    })

    const data: Record<keyof typeof forms.newPassphrase, string> = {
        passphrase: basicUser.data.passphrase,
        passphraseConfirm: basicUser.data.passphrase,
    }

    /**
     * Send request 
     */ 
    const response = await axios.post(apiRoute(__dirname.replace("[code]", "123")), data).catch((e) => {
        return e.response
    })

    /**
     * Check the response
     */
    expect(response.status).toBe(400)
    expect(response.data.success).toBeUndefined()
    expect(response.data.message).toBeDefined()
})


test("Passphrase reset code POST: fails with mismatched passphrases", async () => {

    /**
     * Create user and get userId
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
     * Create passphrase reset code
     */
    const [{code}] = await db.insert(schema.passphraseResets).values({
        userId,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    }).returning({
        code: schema.emailVerifications.id,
    })

    const data: Record<keyof typeof forms.newPassphrase, string> = {
        passphrase: basicUser.data.passphrase,
        passphraseConfirm: "missmatched",
    }

    /**
     * Send request 
     */ 
    const response = await axios.post(apiRoute(__dirname.replace("[code]", code)), data).catch((e) => {
        return e.response
    })

    /**
     * Check the response
     */
    expect(response.status).toBe(400)
    expect(response.data.success).toBeUndefined()
    expect(response.data.errors).toBeDefined()
})