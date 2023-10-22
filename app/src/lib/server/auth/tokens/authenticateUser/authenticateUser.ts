import { eq } from "drizzle-orm"
import { db, schema } from "@database"

/**
 * Takes a userTokenId and returns a user if it's valid
 * Use UAParser for userAgent
 */
export default async function authenticateUser({
    tokenId, token=null, userAgent=null, validate=true
}: {
    tokenId: string, token: string, userAgent: {[key:string]: any}, validate:true
} | {
    tokenId: string, token: null, userAgent: null, validate: false
}): Promise<Record<string, unknown>> {
    
    const userToken = await db.query.userTokens.findFirst({
        with: {
            user: true,
        },
        where: eq(schema.userTokens.id, tokenId)
        // && gt(userTokens.expiresAt, new Date())
    }).execute()

    if (!userToken) {
        return null
    }

    // // Validate that the token against the database
    // if (validate) {
    //     if (
    //         userToken.token !== token
    //         || userToken.browser !== userAgent.browser.name
    //         || userToken.os !== userAgent.os.name
    //     ) {
    //         // If failure, expire the token and delete it from the client
    //         await db.update(userTokens).set({
    //             expiresAt: new Date(),
    //         }).where(eq(userTokens.id, tokenId)).execute()
    //         // TODO - Delete from client
    //         // TODO - return error that session has expired
    //     }
    // }

    return userToken.user
}