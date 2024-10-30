import { users } from "$server/providers"
import { db } from "$server/database"
import type { RequestEvent } from "@sveltejs/kit"
import { cookies } from "$server/auth"

export async function logout({
	tx = db,
	event
}: {
	tx?: DbTransaction | typeof db
	event: RequestEvent
}) {
	await users.tokens.expire({ tx, userTokenId: event.locals.userTokenId })
	cookies.deleteUserTokenCookie({ event })
}
