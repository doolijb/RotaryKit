import { users } from "@providers"
import { db } from "@database"
import type { RequestEvent } from "@sveltejs/kit"
import { cookies } from "@auth"

export default async function logout({
    tx=db,
    event
}: {
    tx?: DbTransaction | typeof db,
    event: RequestEvent
}) {
    await users.tokens.expire({tx, userTokenId: event.locals.userTokenId})
    cookies.deleteUserTokenCookie({event})
}