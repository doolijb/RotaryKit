import { test, expect } from "@playwright/test"
import { axios, clearDB, basicUser } from "$shared/testing"
import type { UserLogin } from "$shared/validation/forms"

test("API Login: 400 with bad credentials", async ({ page }) => {

    const data: UserLogin["Data"] = {
        username: "test",
        passphrase: "test",
    }

    // Make the API call in the Node.js context
    const response = await axios({
        method: "POST",
        url: "/api/login",
        data: data,
    }).catch((error) => error.response)

    // Check the status code and body
    expect(response.status).toBe(400)
    expect(response.data.success).toBeUndefined()
    expect(response.data.message).toBeDefined()

    // Expect there to be no new cookies
    const setCookie = response.headers["set-cookie"]
    expect(setCookie).toBeUndefined()
})

test("API Login: 200 with good credentials", async ({ page }) => {
    await clearDB()
    await basicUser.create()

    const data: UserLogin["Data"] = {
        username: basicUser.data.username,
        passphrase: basicUser.data.passphrase,
    }

    // Make the API call in the Node.js context
    const response = await axios({
        method: "POST",
        url: "/api/login",
        data: data,
    }).catch((error) => error.response)

    // Check the status code and body
    expect(response.status).toBe(200)
    expect(response.data.success).toBe(true)

    // Expect there to be new cookies
    const setCookie = response.headers["set-cookie"]
    expect(setCookie).toBeDefined()
})

test("API Login: 400 with empty body", async ({ page }) => {
    
    // Make the API call in the Node.js context
    const response = await axios({
        method: "POST",
        url: "/api/login",
        data: {},
    }).catch((error) => error.response)

    // Check the status code and body
    expect(response.status).toBe(400)
    expect(response.data.success).toBeUndefined()
    expect(response.data.errors).toBeDefined()
    expect(response.data.errors.username).toBeDefined()
    expect(response.data.errors.passphrase).toBeDefined()

    // Expect there to be no new cookies
    const setCookie = response.headers["set-cookie"]
    expect(setCookie).toBeUndefined()
})

test("API: 403 when already logged in", async ({ page }) => {
    await clearDB()
    await basicUser.create()

    const data: UserLogin["Data"] = {
        username: basicUser.data.username,
        passphrase: basicUser.data.passphrase,
    }

    // Make the API call in the Node.js context
    const response = await axios({
        method: "POST",
        url: "/api/login",
        data: data,
    }).catch((error) => error.response)

    // Check the status code and body
    expect(response.status).toBe(200)
    expect(response.data.success).toBe(true)

    // Expect there to be new cookies
    const setCookie = response.headers["set-cookie"]
    expect(setCookie).toBeDefined()

    // Make the API call in the Node.js context
    const response2 = await axios({
        method: "POST",
        url: "/api/login",
        data: data,
        headers: {
            cookie: setCookie,
        }
    }).catch((error) => error.response)

    // Check the status code and body
    expect(response2.status).toBe(403)
    expect(response2.data.success).toBeUndefined()
    expect(response2.data.message).toBeDefined()

    // Expect there to be no new cookies
    const setCookie2 = response2.headers["set-cookie"]
    expect(setCookie2).toBeUndefined()
})