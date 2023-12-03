import { axios, apiRoute, basicUser, superUser } from "@testing"
import { db } from "@database"
import { test, expect } from "vitest"
import type { forms } from "@validation"


test("login POST : passes with basicUser", async () => {

    /**
     * Create user
     */
    await db.transaction(async tx => {
        await basicUser.create({tx})
        await superUser.create({tx})
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
    
    /**
     * Get the token and make sure it's the correct user
     */
    const userToken = await db.query.userTokens.findFirst({
        with: {
            user: true
        }
    })
    expect(userToken.user.username).toBe(basicUser.data.username)
})

test("login POST: passes with superUser", async () => {

    /**
     * Create user
     */
    await db.transaction(async tx => {
        await basicUser.create({tx})
        await superUser.create({tx})
    })

    /**
     * Send request
     */
    const data: {[key in keyof typeof forms.userLogin]: string} = {
        username: superUser.data.username,
        passphrase: superUser.data.passphrase,
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

    /**
     * Get the token and make sure it's the correct user
     */
    const userToken = await db.query.userTokens.findFirst({
        with: {
            user: true
        }
    })
    expect(userToken.user.username).toBe(superUser.data.username)
})

test("login POST: fails with bad username", async () => {

    /**
     * Create user
     */
    await db.transaction(async tx => {
        await basicUser.create({tx})
        await superUser.create({tx})
    })

    /**
     * Send request
     */
    const data: {[key in keyof typeof forms.userLogin]: string} = {
        username: "badUsername",
        passphrase: superUser.data.passphrase,
    }

    const response = await axios.post(apiRoute(__dirname), data).catch(err => err.response)

    /**
     * Check the response
     */
    expect(response.status).toBe(400)
    expect(response.data.message).toBeDefined()
})

test("login POST: fails with bad password", async () => {

    /**
     * Create user
     */
    await db.transaction(async tx => {
        await basicUser.create({tx})
        await superUser.create({tx})
    })

    /**
     * Send request
     */
    const data: {[key in keyof typeof forms.userLogin]: string} = {
        username: superUser.data.username,
        passphrase: "badPassword",
    }

    const response = await axios.post(apiRoute(__dirname), data).catch(err => err.response)

    /**
     * Check the response
     */
    expect(response.status).toBe(400)
    expect(response.data.message).toBeDefined()
})