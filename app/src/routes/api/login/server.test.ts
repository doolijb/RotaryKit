import { axios, apiRoute, basicUser } from "@testing"
import { db, schema } from "@database"
import { eq } from "drizzle-orm"
import { test, expect } from "vitest"
import type { forms } from "@validation"


test("Login POST test: passes", async () => {

    /**
     * Create user
     */
    await db.transaction(async tx => {
        await basicUser.create({tx})
    })

    /**
     * Send request
     */
    const data: {[key in keyof typeof forms.userLogin]: string} = {
        username: basicUser.data.username,
        passphrase: basicUser.data.passphrase,
    }

    const response = await axios.post(apiRoute(__dirname), data)

    /**
     * Check the response
     */
    expect(response.status).toBe(201)
    expect(response.data.success).toBe(true)

    /**
     * Check that a cookie was set
     */
    expect(response.headers["set-cookie"]).toBeDefined()    
})