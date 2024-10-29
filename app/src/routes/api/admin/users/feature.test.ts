import { fetch, basicUser, superUser, loginUser } from "$shared/testing"
import { db } from "$server/database"
import { test, expect } from "@playwright/test"
import api from "$shared/api"

test("admin users GET: passes", async () => {
	/**
	 * Create user
	 */
	await db.transaction(async (tx) => {
		await basicUser.create({ tx })
		await superUser.create({ tx })
	})

	/**
	 * Login
	 */
	const cookie = await loginUser(superUser.data)

	/**
	 * Send request
	 */
	const response = await api.admin.users.GET({
        headers: {
            cookie
        }
    }, fetch)

	/**
	 * Check the response
	 */
	expect(response.status).toBe(200)
	expect(response.body.success).toBe(true)
	expect(response.body.results.length).toBe(2)
})

test("admin users GET: passes with pageLimit", async () => {
	/**
	 * Create user
	 */
	await db.transaction(async (tx) => {
		await basicUser.create({ tx })
		await superUser.create({ tx })
	})

	/**
	 * Login
	 */
	const cookie = await loginUser(superUser.data)

	/**
	 * Send request
	 */
	const response = await api.admin.users.GET({
        query: {
            pageLimit: 1
        },
        headers: {
            cookie
        }
    }, fetch)

	/**
	 * Check the response
	 */
	expect(response.status).toBe(200)
	expect(response.body.success).toBe(true)
	expect(response.body.results.length).toBe(1)
})

test("admin users GET: fails for basic user", async () => {
	/**
	 * Create user
	 */
	await db.transaction(async (tx) => {
		await basicUser.create({ tx })
	})

	/**
	 * Login
	 */
	const cookie = await loginUser(basicUser.data)

	/**
	 * Send request
	 */
	const response = await api.admin.users.GET({
        headers: {
            cookie
        }
    }, fetch)

	/**
	 * Check the response
	 */
	expect(response.status).toBe(403)
})

test("admin users POST: passes", async () => {
	/**
	 * Login
	 */
	await superUser.create()
	const cookie = await loginUser(superUser.data)

	/**
	 * Send request
	 */

	const data = {
		username: "jacksparrow"
	}

	const response = await api.admin.users.POST({
        body: data,
        headers: {
            cookie
        }
    }, fetch)

	expect(response.status).toBe(201)
	expect(response.body.success).toBe(true)
	expect(response.body.result.username).toBe(data.username)
    expect(response.body.result.isAdmin).toBe(false)
    expect(response.body.result.isSuperUser).toBe(false)
    expect(response.body.result.verifiedAt).toBe(null)
    expect(response.body.result.emails.length).toBe(0)
})

test("admin users POST: passes with all data", async () => {
	/**
	 * Login
	 */
	await superUser.create()
	const cookie = await loginUser(superUser.data)

	/**
	 * Send request
	 */

	const data = {
		username: "jacksparrow",
        email: "jack.sparrow@example.com",
        isVerified: true,
        isAdmin: true,
        isSuperUser: true,
	}

	const response = await api.admin.users.POST({
        body: data,
        headers: {
            cookie
        }
    }, fetch)

	expect(response.status).toBe(201)
	expect(response.body.success).toBe(true)
	expect(response.body.result.username).toBe(data.username)
    expect(response.body.result.isAdmin).toBe(true)
    expect(response.body.result.isSuperUser).toBe(true)
    expect(response.body.result.verifiedAt).not.toBe(null)
    expect(response.body.result.emails.length).toBe(1)
    expect(response.body.result.emails[0].address).toBe(data.email)
    expect(response.body.result.emails[0].verifiedAt).not.toBe(null)
    expect(response.body.result.emails[0].isUserPrimary).toBe(true)
})

test("admin users POST: username is required", async() => {
    	/**
	 * Login
	 */
	await basicUser.create()
	const cookie = await loginUser(basicUser.data)

	/**
	 * Send request
	 */

	const data = {
	}

	const response = await api.admin.users.POST({
        body: data,
        headers: {
            cookie
        }
    }, fetch)

	expect(response.status).toBe(400)
})
