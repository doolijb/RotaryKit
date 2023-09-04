import { test, expect } from "@playwright/test"
import { fetch, clearDB, basicUser } from "$shared/testing"
import type { UserLogin } from "$shared/validation/forms"
import api from "$shared/api"

function isUserTokenSet(headers: Headers): boolean {
	const setCookieHeader = headers.get("set-cookie")
	if (setCookieHeader) {
		const cookies = setCookieHeader.split(";")
		return cookies.some((cookie) => cookie.trim().startsWith("userToken="))
	}
	return false
}

test("API Login: 400 with bad credentials", async ({ page }) => {
	const data: UserLogin["Data"] = {
		email: "foo@bar.com",
		passphrase: "test"
	}

	const response = await api.login.POST({ body: data }, fetch).then((res) => res)

	// Check the status code and body
	expect(response.status).toBe(400)
	expect(response.body.message).toBeDefined()

	// Expect there to be no new cookies
	expect(isUserTokenSet(response["headers"])).toBe(false)
})

test("API Login: 200 with good credentials", async ({ page }) => {
	await clearDB()
	await basicUser.create()

	const data: UserLogin["Data"] = {
		email: basicUser.data.email,
		passphrase: basicUser.data.passphrase
	}

	// Make the API call in the Node.js context
	const response = await api.login.POST({ body: data }, fetch).then((res) => res)

	// Check the status code and body
	expect(response.status).toBe(200)

	// Expect there to be new cookies
	// const setCookie = response.headers["set-cookie"]
	// console.log(response['headers'])
	expect(isUserTokenSet(response["headers"])).toBe(true)
})

test("API Login: 400 with empty body", async ({ page }) => {
	// Make the API call in the Node.js context
	const response = await api.login.POST({ body: {} as any }, fetch)

	// Check the status code and body
	expect(response.status).toBe(400)
	expect(response.body.errors.email).toBeDefined()
	expect(response.body.errors.passphrase).toBeDefined()

	// Expect there to be no new cookies
	expect(isUserTokenSet(response["headers"])).toBe(false)
})

test("API Login: 403 when already logged in", async ({ page }) => {
	await clearDB()
	await basicUser.create()

	const data: UserLogin["Data"] = {
		email: basicUser.data.email,
		passphrase: basicUser.data.passphrase
	}

	// Make the API call in the Node.js context
	const response = await api.login.POST({ body: data }, fetch)

	// Check the status code and body
	expect(response.status).toBe(200)

	// Expect there to be new cookies
	expect(isUserTokenSet(response["headers"])).toBe(true)

	const userToken = response["headers"].get("set-cookie")

	// Make the API call in the Node.js context
	const response2 = await api.login.POST(
		{
			body: data,
			headers: {
				Cookie: userToken
			}
		},
		fetch
	)

	// Check the status code and body
	expect(response2.status).toBe(403)
})
