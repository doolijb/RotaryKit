import { axios, apiRoute, basicUser, superUser, loginUser } from "$testing"
import { db } from "$database"
import { test, expect, vi } from "vitest"
import data from "./data.server"
data // silence unused warning, we need this to watch the file

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
	const response = await axios
		.get(apiRoute(__dirname), {
			headers: {
				cookie
			}
		})
		.catch((e) => e.response)

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

	const response = await axios.post(apiRoute(__dirname), data, {
		headers: {
			cookie
		}
	})

	expect(response.status).toBe(201)
	expect(response.data.success).toBe(true)
	expect(response.data.result.username).toBe(data.username)
    expect(response.data.result.isAdmin).toBe(false)
    expect(response.data.result.isSuperUser).toBe(false)
    expect(response.data.result.verifiedAt).toBe(null)
    expect(response.data.result.emails.length).toBe(0)
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

	const response = await axios.post(apiRoute(__dirname), data, {
		headers: {
			cookie
		}
	})

	expect(response.status).toBe(201)
	expect(response.data.success).toBe(true)
	expect(response.data.result.username).toBe(data.username)
    expect(response.data.result.isAdmin).toBe(true)
    expect(response.data.result.isSuperUser).toBe(true)
    expect(response.data.result.verifiedAt).not.toBe(null)
    expect(response.data.result.emails.length).toBe(1)
    expect(response.data.result.emails[0].address).toBe(data.email)
    expect(response.data.result.emails[0].verifiedAt).not.toBe(null)
    expect(response.data.result.emails[0].isUserPrimary).toBe(true)
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

	const response = await axios.post(apiRoute(__dirname), data, {
		headers: {
			cookie
		}
	}).catch(e => e.response)

	expect(response.status).toBe(400)
})
