import { users } from "$server/providers"
import { tokens, cookies } from "$server/auth"
import type { RequestEvent } from "@sveltejs/kit"
import UAParser from "ua-parser-js"
import { logger } from "$server/logging"

export async function userAuthentication(event: RequestEvent) {
    // Get Parsed User Agent
    event.locals.userAgent = new UAParser(event.request.headers.get("user-agent")).getResult()

    // Get User Token
    const token = event.cookies.get("userToken")
    // Authenticate User
    if (token) {
        try {
            const validToken = await tokens.decryptLocalToken({token})
            event.locals.userTokenId = validToken.id as string
            const authenticatedData = await users.authenticate({
                tokenId: validToken.id as string,
                token: token,
                userAgent: event.locals.userAgent,
                validate: true,
            })
            event.locals.user = authenticatedData.user
            event.locals.adminPermissions = authenticatedData.adminPermissions
        } catch (e) {
            cookies.deleteUserTokenCookie({event})
            logger.error({ message: e.message, stack: e.stack })
        }
    }
}