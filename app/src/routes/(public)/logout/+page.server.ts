import { cookies } from "$server/auth"
import { users } from "$server/providers"


/** @type {import('./$types').PageLoad} */
export async function load(event) {
    if (event.locals.user) {
        await users.tokens.expire({userTokenId: event.locals.userTokenId})
        cookies.deleteUserTokenCookie({event})
    }
}