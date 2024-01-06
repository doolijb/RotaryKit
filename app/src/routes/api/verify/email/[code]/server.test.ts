import { axios, apiRoute, basicUser } from "$testing"
import { db, schema } from "$database"
import { eq } from "drizzle-orm"
import { test, expect } from "vitest"
import data from "./data.server"
data // silence unused warning, this is needed file watch to work


test("Register POST test: passes", async () => {

    // Create user and get emailId
    await basicUser.create({isVerified: false})
    const [{emailId}] = await db.select({
        emailId: schema.emails.id,
    }).from(
        schema.emails
    ).where(
        eq(schema.emails.address, basicUser.data.email)
    )

    // Create email verification
    const [{code}] = await db.insert(schema.emailVerifications).values({
        emailId,
    }).returning({
        code: schema.emailVerifications.id,
    }).execute()

    // Send request
    const response = await axios.get(apiRoute(__dirname.replace("[code]", code)))

    // Check the response
    expect(response.status).toBe(200)
    expect(response.data.success).toBe(true)

    // Check the Email and User
    const email = await db.query.emails.findFirst({
        where: (e, {eq}) => eq(e.id, emailId),
        with: {
            user: true
        }
    })

    expect(email.verifiedAt).not.toBe(null)
    expect(email.user.verifiedAt).not.toBe(null)
})