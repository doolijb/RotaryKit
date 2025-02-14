import { db, schema } from "$server/database"
import type { RequestEvent } from "@sveltejs/kit"
import { v4 as uuid } from "uuid"
import { tokens } from "$server/auth"

/**
 * Creates a user token
 *
 * @tx - Database transaction
 * @event - SvelteKit request event
 * @userId - User ID
 */
export async function create({
	tx = db,
	event,
	userId,
	returning
}: {
	tx?: DbTransaction | typeof db
	event: RequestEvent
	userId: string
	returning?: ReturningSelect
}): PromisedQueryResult<typeof returning> {
	const id = uuid()

	const expiresAt = new Date(
		Date.now() + parseInt(process.env.USER_TOKEN_EXPIRATION_HOURS) * 60 * 60 * 1000
	)

	let browser: string
	let os: string

	try {
		browser = event.locals.userAgent.browser.name || "Unknown"
	} catch (e) {
		browser = "Unknown"
	}

	try {
		os = event.locals.userAgent.os.name || "Unknown"
	} catch (e) {
		os = "Unknown"
	}

	const query = tx.insert(schema.userTokens).values({
		id,
		userId: userId,
		token: await tokens.generateLocalToken({
			payload: {
				sub: "user",
				id
			},
			expiresIn: `${process.env.USER_TOKEN_EXPIRATION_HOURS}h`
		}),
		browser,
		os,
		expiresAt
	})

	// Returning?
	if (returning) {
		query.returning(returning)
	}

	// Return result
	return await query
}
