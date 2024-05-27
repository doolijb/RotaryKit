import { boot } from "$server/boot"
import { logger } from "$server/logging"
import { userAuthentication } from "$server/middleware"

////
// BOOT
////

await boot({
    envDefaults: {
        USER_TOKEN_EXPIRATION_HOURS: "72"
    }
})

////
// MIDDLEWARE
////

const middleware: Middleware[] = [
    userAuthentication,
]

////
// REQUEST HANDLER
////

/** @type {import("@sveltejs/kit").Handle} */
export async function handle({ event, resolve }) {
    await Promise.all(Object.values(middleware).map(handler => handler(event)));
    const response = await resolve(event)
    logger.resolvedRequest(event, response)
    return response
}

