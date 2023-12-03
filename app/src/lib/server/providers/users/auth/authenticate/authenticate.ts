import { eq } from "drizzle-orm"
import { db, schema } from "@database"

interface AuthenticateAndValidate {
    tx?: typeof db,
    tokenId: string, 
    token: string, 
    userAgent: {[key:string]: any}, 
    validate:true
}

interface AuthenticateWithoutValidation {
    tx?: typeof db,
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
}: AuthenticateAndValidate | AuthenticateWithoutValidation ): Promise<SelectUser> {
    
    const userToken = await tx.query.userTokens.findFirst({
        where: (t, {and, eq, gt}) => and(
            eq(t.id, tokenId),
            gt(t.expiresAt, new Date())
        ),
        with: {
            user: {
                with: {
                    emails: true,
                    toStaffRoles: true // {
                    //     columns: [],
                    //     with: {
                    //         staffRole: {
                    //             with: {
                    //                 toPermissions: {
                    //                     columns: [],
                    //                     with: {
                    //                         staffPermissions: true
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                }
            }
        },
    })

    if (!userToken) {
        return null
    }

    // Validate that the token against the database // TODO
    if (validate) {
        if (
            userToken.token !== token
            || userToken.browser !== userAgent.browser.name
            || userToken.os !== userAgent.os.name
        ) {
            // If failure, expire the token and delete it from the client
            await tx.update(schema.userTokens).set({
                expiresAt: new Date(),
            }).where(eq(schema.userTokens.id, tokenId))
            throw new Error("Invalid token")
        }
    }

    return userToken.user as SelectUser
}