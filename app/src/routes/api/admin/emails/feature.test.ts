import { axios, apiRoute, basicUser, superUser, loginUser } from "$shared/testing"
import { db } from "$server/database"
import { test, expect } from "vitest"
import data from "./data.server"
data // silence unused warning, we need this to watch the file


test("admin emails GET: passes", async () => {

    /**
     * Create user
     */
    await db.transaction(async tx => {
        await basicUser.create({tx})
        await superUser.create({tx})
    })

    /**
     * Login
     */
    const cookie = await loginUser(superUser.data)

    /**
     * Send request
     */
    const response = await axios.get(apiRoute(__dirname), {
        headers: {
            cookie
        }
    })

    /**
     * Check the response
     */
    expect(response.status).toBe(200)
    expect(response.data.success).toBe(true)
    expect(response.data.results.length).toBe(2)
})

test("admin emails GET: passes with pageLimit", async () => {

    /**
     * Create user
     * We need two emails to test the limit
     */
    await db.transaction(async tx => {
        await basicUser.create({tx})
        await superUser.create({tx})
    })

    /**
     * Login
     */
    const cookie = await loginUser(superUser.data)

    /**
     * Send request
     */
    const query = "?pageLimit=1"
    const response = await axios.get(apiRoute(__dirname) + query, {
        headers: {
            cookie
        }
    })

    /**
     * Check the response
     */
    expect(response.status).toBe(200)
    expect(response.data.success).toBe(true)
    expect(response.data.results.length).toBe(1)
})

test("admin emails GET: fails for basic user", async () => {
    /**
     * Create user
     */
    await db.transaction(async tx => {
        await basicUser.create({tx})

    })

    /**
     * Login
     */
    const cookie = await loginUser(basicUser.data)

    /**
     * Send request
     */
    const response = await axios.get(apiRoute(__dirname), {
        headers: {
            cookie
        }
    }).catch(e => e.response)

    /**
     * Check the response
     */
    expect(response.status).toBe(403)

})