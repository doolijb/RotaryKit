import { tokens, cookies } from "@auth"
import { redirect } from "@sveltejs/kit"


/** @type {import('./$types').PageLoad} */
export async function load(event) {

    // Log the user out
    if (event.locals.user) {
        await tokens.expireUserToken({userTokenId: event.locals.userTokenId})
        cookies.deleteUserTokenCookie({event})
    }
}