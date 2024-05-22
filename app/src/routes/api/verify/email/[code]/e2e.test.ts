import { axios, basicUser, clearDB } from "$shared/testing"
import { test, expect } from "@playwright/test"
import { db, schema } from "$server/database"


test("API Email Verification: 200", async () => {
    await clearDB()

    // Create user and get emailId
    await basicUser.create({isVerified: false})
    const email = await db.query.emails.findFirst({
        where: (e, {eq}) => eq(e.address, basicUser.data.email),
        columns: {
            id: true
        }
    })

    // Create email verification
    const [code] = await db.insert(schema.emailVerifications).values({
        emailId: email.id,
    }).returning({ id: schema.emailVerifications.id })


    // Send request
    const response = await axios.post(`/api/verify/email/${code.id}`).catch(e => {
        console.log(e.response)
        return e.response
    })

    // Check the response
    expect(response.status).toBe(200)
    expect(response.data.success).toBe(true)

    // Check the Email and User
    const updatedEmail = await db.query.emails.findFirst({
        where: (e, {eq}) => eq(e.id, email.id),
        with: {
            user: true
        }
    })

    expect(updatedEmail.verifiedAt).not.toBe(null)
    expect(updatedEmail.user.verifiedAt).not.toBe(null)
})