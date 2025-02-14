import { fetch, basicUser, superUser, loginUser } from "$shared/testing"
import { db, schema } from "$server/database"
import { test, expect, vi } from "@playwright/test"
import { eq } from "drizzle-orm"
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

	const { id: userId } = await db.query.users.findFirst({
		where: (u, { eq }) => eq(u.username, basicUser.data.username)
	})

	/**
	 * Send request
	 */
	const response = await api.admin.users.resourceId$(userId).GET(
		{
			headers: {
				cookie
			}
		},
		fetch
	)

	/**
	 * Check the response
	 */
	expect(response.status).toBe(200)
	expect(response.data.username).toBe(basicUser.data.username)
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

	const { id: userId } = await db.query.users.findFirst({
		where: (u, { eq }) => eq(u.username, basicUser.data.username)
	})

	/**
	 * Send request
	 */
	const response = await api.admin.users.resourceId$(userId).GET(
		{
			headers: {
				cookie
			}
		},
		fetch
	)

	/**
	 * Check the response
	 */
	expect(response.status).toBe(403)
	expect(response.data.username).toBe(undefined)
})

test("admin users PUT: passes", async () => {
	/**
	 * Create user
	 */
	await db.transaction(async (tx) => {
		await basicUser.create({ tx })
		await superUser.create({ tx })
	})

	const [{ userId, isActive }] = await db
		.select({ userId: schema.users.id, isActive: schema.users.isActive })
		.from(schema.users)
		.where(eq(schema.users.username, basicUser.data.username))
		.limit(1)

	expect(isActive).toBe(true)

	/**
	 * Login
	 */
	const cookie = await loginUser(superUser.data)

	/**
	 * Send request
	 */

	const data = {
		isActive: false
	}

	const response = await api.admin.users
		.resourceId$(userId)
		.PUT({ body: data, headers: { cookie } }, fetch)

	expect(response.status).toBe(200)
	expect(response.data.success).toBe(true)

	const updatedUser = await db.query.users.findFirst({
		where: (u, { eq }) => eq(u.id, userId)
	})

	expect(updatedUser.isActive).toBe(false)
})

test("admin users PUT: fails for basic user", async () => {
	/**
	 * Create user
	 */
	await db.transaction(async (tx) => {
		await basicUser.create({ tx })
	})

	const [{ userId, isActive }] = await db
		.select({ userId: schema.users.id, isActive: schema.users.isActive })
		.from(schema.users)
		.where(eq(schema.users.username, basicUser.data.username))
		.limit(1)

	expect(isActive).toBe(true)

	/**
	 * Login
	 */
	const cookie = await loginUser(basicUser.data)

	/**
	 * Send request
	 */

	const data = {
		isActive: false
	}

	const response = await api.admin.users
		.resourceId$(userId)
		.PUT({ body: data, headers: { cookie } }, fetch)

	expect(response.status).toBe(403)
})

test("admin users DELETE: passes", async () => {
	/**
	 * Create user
	 */
	await db.transaction(async (tx) => {
		await basicUser.create({ tx })
		await superUser.create({ tx })
	})

	const [{ userId }] = await db
		.select({ userId: schema.users.id })
		.from(schema.users)
		.where(eq(schema.users.username, basicUser.data.username))
		.limit(1)

	/**
	 * Login
	 */
	const cookie = await loginUser(superUser.data)

	/**
	 * Send request
	 */
	const response = await api.admin.users.resourceId$(userId).DELETE({ headers: { cookie } }, fetch)

	expect(response.status).toBe(200)
	expect(response.data.success).toBe(true)

	const deletedUser = await db.query.users.findFirst({
		where: (u, { eq }) => eq(u.id, userId)
	})

	expect(deletedUser).toBe(null)
})
