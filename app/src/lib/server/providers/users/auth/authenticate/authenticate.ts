import { eq } from "drizzle-orm"
import { db, schema } from "@database"

interface AuthenticateAndValidate {
    tx?: DbTransaction | typeof db,
    tokenId: string, 
    token: string, 
    userAgent: {[key:string]: any}, 
    validate:true
}

interface AuthenticateWithoutValidation {
    tx?: DbTransaction | typeof db,
    tokenId: string,
    token: null,
    userAgent: null,
    validate: false
}

/**
 * Takes a userTokenId and returns a user if it's valid
 * Use UAParser for userAgent
 */
export default async function authenticate({
    tx=db,
    tokenId,
    token=null,
    userAgent=null,
    validate=true
}: AuthenticateAndValidate | AuthenticateWithoutValidation ): Promise<Record<string, unknown>> {
    
    const userToken = await tx.query.userTokens.findFirst({
        with: {
            user: true,
        },
        where: eq(schema.userTokens.id, tokenId)
        // && gt(userTokens.expiresAt, new Date())
    }).execute()

    if (!userToken) {
        return null
    }

    // // Validate that the token against the database // TODO
    // if (validate) {
    //     if (
    //         userToken.token !== token
    //         || userToken.browser !== userAgent.browser.name
    //         || userToken.os !== userAgent.os.name
    //     ) {
    //         // If failure, expire the token and delete it from the client
    //         await tx.update(userTokens).set({
    //             expiresAt: new Date(),
    //         }).where(eq(userTokens.id, tokenId)).execute()
    //         // TODO - Delete from client
    //         // TODO - return error that session has expired
    //     }
    // }

    return userToken.user
}