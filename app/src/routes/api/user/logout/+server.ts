import { tokens, cookies } from "@auth"
import { error } from "@sveltejs/kit"

/**
 * Expires the userTokens and deletes the session cookie.
 */
/** @type {import('./$types').RequestHandler} */
export async function GET(event) {
    if (!event.locals.user) {
        throw error(401, {
            message: "You are not logged in",
        })
    }

    await tokens.expireUserToken({userTokenId: event.locals.userTokenId})
    cookies.deleteUserTokenCookie({event})
    return new Response("Success")
}